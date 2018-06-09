import 'babel-polyfill';
import * as RxDB from 'rxdb';
import some from 'lodash/some';
import schemas from './schema';
import migrations from './migrations';
import { GlobalStore } from '../store/globalStore';
import { mapTransactionsToBudgets, mapSeenTransactionsToBudgets } from '../services/helpers';
RxDB.plugin(require('pouchdb-adapter-idb'));
// RxDB.plugin(require('pouchdb-replication')); //enable syncing
RxDB.plugin(require('pouchdb-adapter-http')); //enable syncing over http
// RxDB.plugin(require('pouchdb-auth'));

export const dbUrl = 'https://purse.smileupps.com';

class Model {
  async init() {
    if (this.instance) {
      return this.instance;
    }
    this.instance = await RxDB.create({
      name: 'purse',
      adapter: 'idb',
      password: 'myPassword',
      multiInstance: false,
    });

    this.budgetsSync = null;
    this.transactionsSync = null;
    this.usersSync = null;
    this.isSyncing = false;

    const promise = this.createUsersCollection();
    GlobalStore.modules.users.activeUser.subscribe(userInfo => this.onUserChanged(userInfo));
    GlobalStore.budgets.subscribe((budgets) => {
      const budgetIds = budgets.map(budget => budget.id);
      this.syncTransactions(budgetIds);
    });

    return promise;
  }

  async createUsersCollection() {
    // users
    await this.instance.collection({
      name: 'users',
      schema: schemas.users,
      migrationStrategies: migrations.users,
    });
  }

  dropUserRelatedCollections() {
    console.tlog('destroy user related collections')
    const promises = Promise.all([
      this.instance.collections.budgets.destroy(),
      this.instance.collections.transactions.destroy(),
      this.instance.collections.seentransactions.destroy(),
    ]);
    promises.catch(er => {});

    return promises;
  }

  createUserRelatedCollections() {
    console.tlog('create user related collections')
    const promises = Promise.all([
      // budgets
      this.instance.collection({
        name: 'budgets',
        schema: schemas.budgets,
        migrationStrategies: migrations.budgets,
      }),
      // transactions
      this.instance.collection({
        name: 'transactions',
        schema: schemas.transactions,
        migrationStrategies: migrations.transactions,
      }),
      // seen transactions
      this.instance.collection({
        name: 'seentransactions',
        schema: schemas.seenTransactions,
        migrationStrategies: migrations.seenTransactions,
      }),
    ]);
    promises.then(() => this.mapCollectionsToStore()).catch(er => {});

    return promises;
  }

  mapCollectionsToStore() {
    this.instance.collections.users.find().$.subscribe((users) => {
      GlobalStore.users.value = users;
    });
    this.instance.collections.budgets.find().$.subscribe((budgets) => {
      GlobalStore.budgets.value = budgets;
    });
    this.instance.collections.transactions.find().$.subscribe((transactions) => {
      GlobalStore.transactions.value = mapTransactionsToBudgets(transactions);
    });
    this.instance.collections.seentransactions.find().$.subscribe((seentransactions) => {
      GlobalStore.seentransactions.value = mapSeenTransactionsToBudgets(seentransactions);
    });
  }

  async onUserChanged(newUser) {
    console.tlog('user changed', newUser);
    if (newUser) {
      await this.createUserRelatedCollections();
      this.syncBudgets(newUser.id); // will trigger syncTransactions via observable subscrition
    } else {
      this.dropUserRelatedCollections();
    }
  }

  syncUsers() {
    if (!this.instance) {
      return Promise.reject();
    }
    this.usersSync = this.instance.users.sync({
      remote: `${dbUrl}/collaborators`,
      options: {
        live: false,
        retry: true,
      },
    });

    return this.usersSync;
  }

  syncBudgets(userId) {
    if (!this.instance) {
      return Promise.reject();
    }
    this.budgetsSync = this.instance.collections.budgets.sync({
      remote: `${dbUrl}/budgets`,
      options: {
        live: true,
        retry: true,
        filter: doc => some(doc.users, user => user.id === userId),
      },
    });

    return this.budgetsSync;
  }

  syncTransactions(budgetIds) {
    if (!this.instance) {
      return Promise.reject();
    }
    //TODO: сделать пооптимальней
    this.transactionsSync = this.instance.transactions.sync({
      remote: `${dbUrl}/transactions`,
      options: {
        live: true,
        retry: true,
        filter: doc => budgetIds.includes(doc.budgetId),
      },
    });

    return this.transactionsSync;
  }

  async startSync({ userId, budgetIds = [] }) {
    console.tlog('syncyng started')
    await this.syncBudgets(userId);
    await this.syncTransactions(budgetIds);
    
    this.isSyncing = true;
  }

  async stopSync() {
    console.tlog('syncyng stopped')
    try {
      const promises = Promise.all([
        (await this.budgetsSync).cancel(),
        (await this.transactionsSync).cancel(),
      ]);
      promises.then(() => {
        this.isSyncing = false;
      });
      return promises;
    } catch(er) {
      console.error(er);
    }
  }
}

export const Database = new Model();
