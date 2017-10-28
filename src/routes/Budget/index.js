import { injectReducer } from '../../store/reducers'
import { setActiveModule } from 'store/modules';
const Budget = require('./containers').default

export default (store) => {
  const {
    budgetReducer,
    transactionsReducer,
  } = require('./modules/actions').default;
  injectReducer(store, { key: 'budget', reducer: budgetReducer });
  injectReducer(store, { key: 'transactions', reducer: transactionsReducer });

  return ({
    path : 'budgets/:id',
    getComponent (nextState, cb) {
      require.ensure([], (require) => {
        cb(null, Budget)

      }, 'budgets')
    },
    onEnter: () => {
      store.dispatch(setActiveModule('budget', ['collaborators']))
    },
  })
}

export {
  Budget,
}
