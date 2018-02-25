import 'babel-polyfill';
import * as RxDB from 'rxdb';
import some from 'lodash/some';
import schemas from './schema';
import migrations from './migrations';
import { actions as budgetsActions } from 'routes/Budgets/modules/actions';
import { actions as transactionsActions } from 'routes/Budget/modules/actions';
import { actions as usersActions } from 'modules/users/actions';
import { mapTransactionsToBudgets } from 'services/helpers';
RxDB.plugin(require('pouchdb-adapter-idb'));
// RxDB.plugin(require('pouchdb-replication')); //enable syncing
RxDB.plugin(require('pouchdb-adapter-http')); //enable syncing over http
// RxDB.plugin(require('pouchdb-auth'));

export const dbUrl = 'https://purse.smileupps.com';

export class Database {
  static instance = null;
  static budgetsSync = null;
  static transactionsSync = null;
  static usersSync = null;
  static isSyncing = false;

  static budgetsRequested(store) {
    store.dispatch(budgetsActions.requestStarted());
  }
  
  static budgetsChanged(store, budgets) {
    store.dispatch(budgetsActions.updated(budgets));
  }
  
  static usersChanged(store, users) {
    store.dispatch(usersActions.updated(users));
  }
  
  static transactionsChanged(store, transactions) {
    const map = mapTransactionsToBudgets(transactions);
    store.dispatch(transactionsActions.transactions.updated(map));
  }
  
  static seenTransactionsChanged(store, transactions) {
    const map = {};
    if (transactions !== null) {
      transactions.forEach((transaction) => {
        map[transaction.budgetId] = transaction.transactions;
      });
    }
    store.dispatch(transactionsActions.transactions.seen(map));
  }

  static async init() {
    if (Database.instance) {
      return Database.instance;
    }
    Database.instance = await RxDB.create({
      name: 'purse',
      adapter: 'idb',
      password: 'myPassword',
      multiInstance: false,
    });

    // budgets
    await Database.instance.collection({
      name: 'budgets',
      schema: schemas.budgets,
      migrationStrategies: migrations.budgets,
    });

    // transactions
    await Database.instance.collection({
      name: 'transactions',
      schema: schemas.transactions,
      migrationStrategies: migrations.transactions,
    });

    // users
    await Database.instance.collection({
      name: 'users',
      schema: schemas.users,
      migrationStrategies: migrations.users,
    });

    // seen transactions
    await Database.instance.collection({
      name: 'seentransactions',
      schema: schemas.seenTransactions,
      migrationStrategies: migrations.seenTransactions,
    });
  }

  static async bindToStore(store) {
    Database.budgetsRequested(store);
    await Database.instance.collections.budgets.find().$.subscribe(Database.budgetsChanged.bind(null, store));
    await Database.instance.collections.transactions.find().$.subscribe(Database.transactionsChanged.bind(null, store));
    await Database.instance.collections.users.find().$.subscribe(Database.usersChanged.bind(null, store));
    await Database.instance.collections.seentransactions.find().$.subscribe(Database.seenTransactionsChanged.bind(null, store));
  }

  static syncUsers() {
    if (!Database.instance) {
      return new Promise((resolve, reject) => reject());
    }
    Database.usersSync = Database.instance.users.sync({
      remote: `${dbUrl}/collaborators`,
      options: {
        live: false,
        retry: true,
      },
    });

    return Database.usersSync;
  }

  static syncBudgets(userId) {
    if (!Database.instance) {
      return new Promise((resolve, reject) => reject());
    }
    Database.budgetsSync = Database.instance.collections.budgets.sync({
      remote: `${dbUrl}/budgets`,
      options: {
        live: true,
        retry: true,
        filter: doc => some(doc.users, user => user.id === userId),
      }  
    });

    return Database.budgetsSync;
  }

  static syncTransactions(budgetIds) {
    if (!Database.instance) {
      return new Promise((resolve, reject) => reject());
    }
    //TODO: сделать пооптимальней
    Database.transactionsSync = Database.instance.transactions.sync({
      remote: `${dbUrl}/transactions`,
      options: {
        live: true,
        retry: true,
        filter: doc => budgetIds.includes(doc.budgetId),
      },
    });

    return Database.transactionsSync;
  }

  static async startSync({ userId, budgetIds = [] }) {
    console.info('syncyng started')
    await Database.syncBudgets(userId);
    await Database.syncTransactions(budgetIds);
    
    Database.isSyncing = true;
  }

  static async stopSync() {
    console.info('syncyng stopped')
    try {
      const promises = Promise.all([
        (await Database.budgetsSync).cancel(),
        (await Database.transactionsSync).cancel(),
      ]);
      promises.then(() => {
        Database.isSyncing = false;
      });
      return promises;
    } catch(er) {}
  }
}
