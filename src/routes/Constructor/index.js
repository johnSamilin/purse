import { injectReducer } from '../../store/reducers'
import { setActiveModule } from 'store/modules';
const Construct = require('./containers').default

export default (store) => {
  const {
    reducer,
  } = require('./modules/actions').default;
  injectReducer(store, { key: 'constructor', reducer });

  return ({
    path : 'create',
    getComponent (nextState, cb) {
      require.ensure([], (require) => {
        cb(null, Construct)

      }, 'constructor')
    },
    onEnter: () => {
      store.dispatch(setActiveModule('constructor', []))
    },
  })
}

export {
  Construct,
}
