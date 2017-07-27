import 'babel-polyfill';
import * as RxDB from 'rxdb';
import schemas from './schema';
import { actions as budgetsActions } from '../routes/Budgets/modules/actions'
RxDB.plugin(require('pouchdb-adapter-websql'));
RxDB.plugin(require('pouchdb-replication')); //enable syncing
RxDB.plugin(require('pouchdb-adapter-http')); //enable syncing over http
// RxDB.plugin(require('pouchdb-auth'));

let database;
const dbUrl = 'https://couchdb-8c8b3e.smileupps.com';

function budgetsChanged(store, budgets) {
  store.dispatch(budgetsActions.updated(budgets));
}

function init(store) {
  RxDB.create({
    name: 'purse',
    adapter: 'websql',          // <- storage-adapter
    password: 'myPassword',     // <- password (optional)
    multiInstance: false ,
  }).then(db => {
    database = db;
    // budgets
    db.collection({
      name: 'budgets',
      schema: schemas.budgets,
    }).then((collection) => {
        database.budgets.sync(`${dbUrl}/budgets`);
        collection
          .find()
          .$.subscribe(budgetsChanged.bind(null, store));
return;
       collection.find().remove().then(() => {
          collection.insert({
            title: 'Test budget 1',
            id: '1',
            ownerId: 0,
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
              ownerId: 0,
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
    db.collection({
      name: 'transactions',
      schema: schemas.transactions,
    }).then((col) => {
      database.transactions.sync(`${dbUrl}/transactions`);
return;
      col.find().remove().then(() => {
        col.insert({
                id: '1',
                budgetId:'1',
                amount: 1000,
                date: Date.now().toString(),
                note: 'Test note',
                cancelled: false,
                ownerId: 0,
              });
        col.insert({
                id: '2',
                budgetId: '1',
                amount: 2000,
                date: Date.now().toString(),
                note: 'Test note',
                cancelled: true,
                ownerId: 0,
              });
        col.insert({
                id: '3',
                budgetId: '1',
                amount: 1400.5,
                date: Date.now().toString(),
                note: 'Test note',
                cancelled: false,
                ownerId: 0,
              });
        col.insert({
                id: '4',
                budgetId: '1',
                amount: 10000,
                date: Date.now().toString(),
                note: 'Test note',
                cancelled: false,
                ownerId: 1,
              });
        col.insert({
                id: '5',
                budgetId: '2',
                amount: 1000,
                date: Date.now().toString(),
                note: 'Test note',
                cancelled: false,
                ownerId: 2,
              });
        col.insert({
                id: '6',
                budgetId: '2',
                amount: 1000,
                date: Date.now().toString(),
                note: 'Test note',
                cancelled: false,
                ownerId: 1,
              });
        col.insert({
                id: '7',
                budgetId: '1',
                amount: 1000,
                date: (Date.now() - 60*60*27*1000).toString(),
                note: 'Test note',
                cancelled: false,
                ownerId: 1,
              });
      });
    });
    db.collection({
      name: 'users',
      schema: schemas.users,
    }).then((col) => {
      database.users.sync(`${dbUrl}/users`);

      col.find().remove().then(() => {
        col.insert({
          id: '0',
          name: 'me',
          phone: '+1111111',
        });
        col.insert({
          id: '1',
          name: 'not me',
          email: 'temp.kroogi@gmail.com',
        });
        col.insert({
          id: '3',
          name: 'him',
        });

        col.insert({
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
