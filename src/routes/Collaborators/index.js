import { injectReducer } from '../../store/reducers';
import { setActiveModule } from 'store/modules';

const Collaborators = require('./containers').default;

export default (store) => {
  const {
    reducer,
  } = require('./modules/actions').default;
  injectReducer(store, { key: 'collaborators', reducer });

  return ({
    path: 'budgets/:id/collaborators',
    getComponent(nextState, cb) {
      require.ensure([], (require) => {
        cb(null, Collaborators);
      }, 'collaborators');
    },
    onEnter: () => {
      store.dispatch(setActiveModule('collaborators', ['budgets']));
    },
  });
};

export {
    Collaborators,
};
