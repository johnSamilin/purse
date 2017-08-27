import 'babel-polyfill';
import * as RxDB from 'rxdb';
import schemas from './schema';
import { actions as budgetsActions } from 'routes/Budgets/modules/actions';
import { actions as usersActions } from 'modules/users/actions';
RxDB.plugin(require('pouchdb-adapter-idb'));
RxDB.plugin(require('pouchdb-replication')); //enable syncing
RxDB.plugin(require('pouchdb-adapter-http')); //enable syncing over http
// RxDB.plugin(require('pouchdb-auth'));

let database;
const dbUrl = 'https://couchdb-dba8bc.smileupps.com';

function budgetsChanged(store, budgets) {
  store.dispatch(budgetsActions.updated(budgets));
}

function usersChanged(store, users) {
  store.dispatch(usersActions.updated(users));
}

function init(store) {
  RxDB.create({
    name: 'purse',
    adapter: 'idb',          // <- storage-adapter
    password: 'myPassword',     // <- password (optional)
    multiInstance: false ,
  }).then(db => {
    database = db;
    // budgets
    const budgetsCollection = db.collection({
      name: 'budgets',
      schema: schemas.budgets,
    }).then((collection) => {
        database.budgets.sync(`${dbUrl}/budgets`);
        return collection
          .find()
          .$.subscribe(budgetsChanged.bind(null, store));

       collection.find().remove().then(() => {
          collection.insert({
            title: 'Test budget 1',
            id: '1',
            ownerId: '0',
            state: "opened",
            currency: {
              key: 'RUB',
              label: 'Rub',
            },          
            sharelink: "",
            users: [
              {
                id: '0',
                name: 'me',
                phone: '+1111111',
                status: 'active',
              },
              {
                id: '1',
                name: 'not me',
                email: 'temp.kroogi@gmail.com',
                status: 'pending',
              },
              {
                id: '2',
                name: 'him',
                status: 'removed',
              },
            ],
          }).then(() => {
            collection.insert({
              title: 'Test budget 2',
              id: '2',
              ownerId: '0',
              state: "closed",
              currency: {
                key: 'RUB',
                label: 'Rub',
              },
              sharelink: "",
              users: [
              {
                id: '2',
                name: 'him',
                status: 'removed',
              },
              ],
            });
          })
        });
      }
    );

    // transactions
    const transactionsCollection = db.collection({
      name: 'transactions',
      schema: schemas.transactions,
    }).then((collection) => {
      return database.transactions.sync(`${dbUrl}/transactions`);

      collection.find().remove().then(() => {
        collection.insert({
                id: '1',
                budgetId:'1',
                amount: 1000,
                date: Date.now().toString(),
                note: 'Test note',
                cancelled: false,
                ownerId: '0',
              });
        collection.insert({
                id: '2',
                budgetId: '1',
                amount: 2000,
                date: Date.now().toString(),
                note: 'Test note',
                cancelled: true,
                ownerId: '0',
              });
        collection.insert({
                id: '3',
                budgetId: '1',
                amount: 1400.5,
                date: Date.now().toString(),
                note: 'Test note',
                cancelled: false,
                ownerId: '0',
              });
        collection.insert({
                id: '4',
                budgetId: '1',
                amount: 10000,
                date: Date.now().toString(),
                note: 'Test note',
                cancelled: false,
                ownerId: '1',
              });
        collection.insert({
                id: '5',
                budgetId: '2',
                amount: 1000,
                date: Date.now().toString(),
                note: 'Test note',
                cancelled: false,
                ownerId: '2',
              });
        collection.insert({
                id: '6',
                budgetId: '2',
                amount: 1000,
                date: Date.now().toString(),
                note: 'Test note',
                cancelled: false,
                ownerId: '1',
              });
        collection.insert({
                id: '7',
                budgetId: '1',
                amount: 1000,
                date: (Date.now() - 60*60*27*1000).toString(),
                note: 'Test note',
                cancelled: false,
                ownerId: '1',
              });
      });
    });
    const usersCollection = db.collection({
      name: 'users',
      schema: schemas.users,
    }).then((collection) => {
      database.users.sync(`${dbUrl}/collaborators`);
      return collection
        .find()
        .$.subscribe(usersChanged.bind(null, store));

      collection.find().remove().then(() => {
        collection.insert({
          id: '0',
          name: 'me',
          phone: '+1111111',
        });
        collection.insert({
          id: '1',
          name: 'not me',
          email: 'temp.kroogi@gmail.com',
        });
        collection.insert({
          id: '3',
          name: 'him',
        });

        collection.insert({
          id: '2',
          name: 'who',
        });
      });
    });
    
    return db;
  });
}

export default {
    init,
}
export {
    database
};
