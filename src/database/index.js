// @ts-check
// import 'babel-polyfill';
import * as RxDB from 'rxdb';
import some from 'lodash/some';
import schemas from './schema';
import migrations from './migrations';
import { GlobalStore } from '../store/globalStore';
import { mapTransactionsToBudgets, mapSeenTransactionsToBudgets, logger, notify } from '../services/helpers';
import { Observable } from '../providers/Observable';
RxDB.plugin(require('pouchdb-adapter-websql'));
RxDB.plugin(require('pouchdb-adapter-idb'));
RxDB.plugin(require('pouchdb-adapter-http')); // enable syncing over http
RxDB.plugin(require('pouchdb-adapter-memory'));
// RxDB.plugin(require('pouchdb-auth'));
import isEqual from 'lodash/isEqual';
import { getAvailableQuota } from '../modules/status/actions';
import { minQuota } from '../const';

export const dbUrl = 'https://purse.smileupps.com';

async function getAdapter() {
  const isIphone = GlobalStore.modules.status.isIPhone;
  const availableQuota = await getAvailableQuota();
  if (availableQuota < minQuota) {
    return 'memory';
  }
  return isIphone ? 'websql' : 'idb';
}

class Model {

  async init() {
    this.budgetsSync = null;
    this.transactionsSync = null;
    this.usersSync = null;
    this.isSyncing = false;
    this.budgetIds = new Observable([]); // чтобы пересинхронизировать только если они изменились
    this.isReady = new Observable(false);

    if (this.instance) {
      return this.instance;
    }
    this.instance = await RxDB.create({
      name: 'purse',
      adapter: await getAdapter(),
      password: 'myPassword',
      multiInstance: false,
    });

    await this.createUsersCollection();
  }
  
  attachSideEffects() {    
    GlobalStore.modules.users.activeUser.subscribe(userInfo => this.onUserChanged(userInfo));
    GlobalStore.budgets.subscribe((budgets) => {
      this.budgetIds.value = budgets.map(budget => budget.id);
    });
    this.budgetIds.subscribe(budgetIds => this.syncTransactions(budgetIds));
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
    this.isReady.value = false;
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
    promises
      .then(() => this.mapCollectionsToStore())
      .then(() => {
        this.isReady.value = true;
      })
      .catch(er => {
        logger.error(er);
        this.isReady.value = false;
      });

    return promises;
  }

  mapCollectionsToStore() {
    this.instance.collections.users.find().$.subscribe((users) => {
      const usersMap = new Map();
      users.forEach(user => usersMap.set(user.id, user));
      GlobalStore.users.value = usersMap;
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
    } else {
      this.dropUserRelatedCollections();
    }
  }

  syncUsers() {
    if (!this.instance) {
      return Promise.reject(null);
    }
    this.usersSync = this.instance.collections.users.sync({
      remote: `${dbUrl}/collaborators`,
      options: {
        live: false,
        retry: false,
      },
    });

    return this.usersSync;
  }

  syncBudgets() {
    if (!this.instance) {
      return Promise.reject(null);
    }
    this.budgetsSync = this.instance.collections.budgets.sync({
      remote: `${dbUrl}/budgets`,
      options: {
        live: true,
        retry: true,
        filter: doc => some(doc.users, user => user.id === GlobalStore.modules.user.activeUser.value.id),
      },
    });

    return this.budgetsSync;
  }

  async syncTransactions(budgetIds) {
    if (!this.instance) {
      return Promise.reject(null);
    }
    //TODO: сделать пооптимальней
    if (this.transactionsSync) {
      (await this.transactionsSync).cancel();
    }
    this.transactionsSync = this.instance.collections.transactions.sync({
      remote: `${dbUrl}/transactions`,
      options: {
        live: true,
        retry: true,
        filter: doc => budgetIds.includes(doc.budgetId),
      },
    });

    return this.transactionsSync;
  }

  async startSync() {
    console.tlog('syncyng started')
    await this.syncBudgets();
    await this.syncTransactions(this.budgetIds.value);
    
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
