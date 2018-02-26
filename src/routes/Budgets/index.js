import { injectReducer } from '../../store/reducers';
import { setActiveModule } from 'store/modules';

const Budgets = require('./containers').default;

export default (store) => {
  const reducer = require('./modules/actions').default;
  injectReducer(store, { key: 'budgets', reducer });

  return ({
    path: 'budgets',
    getComponent(nextState, cb) {
      require.ensure([], (require) => {
        cb(null, Budgets);
      }, 'budgets');
    },
    onEnter: () => {
      store.dispatch(setActiveModule('budgets', ['budget', 'constructor', 'collaborators']));
    },
  });
};

export {
  Budgets,
};
