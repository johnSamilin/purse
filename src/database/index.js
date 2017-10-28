import 'babel-polyfill';
import * as RxDB from 'rxdb';
import schemas from './schema';
import { actions as budgetsActions } from 'routes/Budgets/modules/actions';
import { actions as transactionsActions } from 'routes/Budget/modules/actions';
import { actions as usersActions } from 'modules/users/actions';
import { mapTransactionsToBudgets } from 'services/helpers';
RxDB.plugin(require('pouchdb-adapter-idb'));
RxDB.plugin(require('pouchdb-replication')); //enable syncing
RxDB.plugin(require('pouchdb-adapter-http')); //enable syncing over http
// RxDB.plugin(require('pouchdb-auth'));

const syncEnabled = false;
let database;
const dbUrl = 'https://couchdb-c9ebdb.smileupps.com';

function budgetsRequested(store) {
  store.dispatch(budgetsActions.request());
}

function budgetsChanged(store, budgets) {
  store.dispatch(budgetsActions.updated(budgets));
}

function usersChanged(store, users) {
  store.dispatch(usersActions.updated(users));
}

function transactionsChanged(store, transactions) {
  const map = mapTransactionsToBudgets(transactions);
  store.dispatch(transactionsActions.transactions.updated(map));
}

function seenTransactionsChanged(store, transactions) {
  const map = {};
  if (transactions !== null) {
    transactions.forEach((transaction) => {
      map[transaction.budgetId] = transaction.transactions;
    });
  }
  store.dispatch(transactionsActions.transactions.seen(map));
}

function init(store) {
  budgetsRequested(store);
  RxDB.create({
    name: 'purse',
    adapter: 'idb',          // <- storage-adapter
    password: 'myPassword',     // <- password (optional)
    multiInstance: false,
  }).then(db => {
    database = db;
    // budgets
    const budgetsCollection = db.collection({
      name: 'budgets',
      schema: schemas.budgets,
    }).then((collection) => {
        if(syncEnabled) {
          database.budgets.sync(`${dbUrl}/budgets`);
        }
        return collection
          .find()
          .$.subscribe(budgetsChanged.bind(null, store));
    });

    // transactions
    const transactionsCollection = db.collection({
      name: 'transactions',
      schema: schemas.transactions,
    }).then((collection) => {
        if(syncEnabled) {
          database.transactions.sync(`${dbUrl}/transactions`);
        }
        return collection
          .find()
          .$.subscribe(transactionsChanged.bind(null, store));
    });

    // users
    const usersCollection = db.collection({
      name: 'users',
      schema: schemas.users,
    }).then((collection) => {
        if(syncEnabled) {
          database.users.sync(`${dbUrl}/collaborators`);
        }
        return collection
          .find()
          .$.subscribe(usersChanged.bind(null, store));
    });

    // seen transactions
    const seenTransactions = db.collection({
      name: 'seentransactions',
      schema: schemas.seenTransactions,
    }).then((collection) => {
      return collection
        .find()
        .$.subscribe(seenTransactionsChanged.bind(null, store));
    });
    
    return db;
  });
}

export default {
    init,
}
export {
    database,
};
