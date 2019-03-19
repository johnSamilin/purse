// @ts-check
// import 'babel-polyfill';
import * as RxDB from 'rxdb';
import some from 'lodash/some';
import schemas from './schema';
import migrations from './migrations';
import { GlobalStore } from '../store/globalStore';
import { mapTransactionsToBudgets, mapSeenTransactionsToBudgets, logger, notify, whenSynced } from '../services/helpers';
import { Observable } from '../providers/Observable';
RxDB.plugin(require('pouchdb-adapter-websql'));
RxDB.plugin(require('pouchdb-adapter-idb'));
RxDB.plugin(require('pouchdb-adapter-http')); // enable syncing over http
RxDB.plugin(require('pouchdb-adapter-memory'));
RxDB.plugin(require('pouchdb-auth'));
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

    GlobalStore.budgets.subscribe((budgets) => {
      this.budgetIds.value = budgets.map(budget => budget.id);
    });
    this.budgetIds.subscribe(budgetIds => this.syncTransactions(budgetIds));
    
    if (this.instance) {
      return this.instance;
    }
    this.instance = await RxDB.create({
      name: 'purse',
      adapter: await getAdapter(),
      password: 'myPassword',
      multiInstance: false,
    });
    

    // authentication
    this.authenticator = new RxDB.PouchDB(dbUrl, { adapter: 'http' }); //remove 'jsnext:main' and 'main' fields from 'pouchdb-promise' package.json
    await Database.authenticator.useAsAuthenticationDB();
  }
  
  dropCollections() {
    this.isReady.value = false;
    const promises = Promise.all([
      this.instance.collections.users.destroy(),
      this.instance.collections.budgets.destroy(),
      this.instance.collections.transactions.destroy(),
      this.instance.collections.seentransactions.destroy(),
    ]);
    promises.catch(er => {});

    return promises;
  }

  createCollections() {
    const promises = Promise.all([
      // users
      this.instance.collection({
        name: 'users',
        schema: schemas.users,
        migrationStrategies: migrations.users,
      }),
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
      .then(() => {        
        this.instance.collections.seentransactions.find().$.subscribe((seentransactions) => {
          GlobalStore.seentransactions.value = mapSeenTransactionsToBudgets(seentransactions);
        });
        this.isReady.value = true;
      })
      .catch(er => {
        logger.error(er);
        this.isReady.value = false;
      });

    return promises;
  }

  async syncUsers(filter = u => u) {
    if (!this.instance) {
      return Promise.reject(null);
    }
    if (this.usersSync) {
      (await this.usersSync).cancel();
    }
    this.usersSync = this.instance.collections.users.sync({
      remote: `${dbUrl}/collaborators`,
      options: {
        live: false,
        retry: false,
        filter,
      },
    });
    this.instance.collections.users.find().$.subscribe((users) => {
      const usersMap = new Map();
      users.forEach(user => usersMap.set(user.id, user));
      GlobalStore.users.value = usersMap;
    });

    return this.usersSync;
  }

  async syncBudgets() {
    if (!this.instance) {
      return Promise.reject(null);
    }
    if (this.budgetsSync) {
      (await this.budgetsSync).cancel();
    }
    this.budgetsSync = this.instance.collections.budgets.sync({
      remote: `${dbUrl}/budgets`,
      options: {
        live: true,
        retry: true,
        filter: doc => some(doc.users, user => user.id === GlobalStore.modules.users.activeUser.value.id),
      },
    });
    this.instance.collections.budgets.find().$.subscribe((budgets) => {
      GlobalStore.budgets.value = budgets;
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
    this.instance.collections.transactions.find().$.subscribe((transactions) => {
      GlobalStore.transactions.value = mapTransactionsToBudgets(transactions);
    });

    return this.transactionsSync;
  }

  async startSync() {
    await this.syncUsers();
    await whenSynced(this.usersSync);
    await this.syncBudgets();
    
    this.isSyncing = true;
  }

  async stopSync() {
    try {
      const promises = Promise.all([
        (await this.usersSync).cancel(),
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

  async getSession(username, token) {
    const { ok } = await this.authenticator.session();
    if (ok) {
      return true;
    }
    const result = await this.authenticator.logIn(username, token);
    if (!result.ok) {
      throw new Error(result);
    }
  }

  stopSession() {
    this.dropCollections();
    this.authenticator.logOut();
  }

  async logInLocal(token) {
    await this.createCollections();
    await this.syncUsers(user => user.token === token);
    await whenSynced(this.usersSync);
    const users = await this.instance.collections.users.find().where({ token }).exec();
    if (users.length === 0)  {
      throw new Error('User not found');
    }
    
    return users[0];
  }

}

export const Database = new Model();
