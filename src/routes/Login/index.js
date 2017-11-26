import { setActiveModule } from 'store/modules';
const Login = require('./containers').default;
import { injectReducer } from '../../store/reducers';

export default (store) => {
  const loginReducer = require('./modules/actions').default;
  injectReducer(store, { key: 'login', reducer: loginReducer });
  // Account kit
  
  return ({
    path : 'login',
    getComponent (nextState, cb) {
      require.ensure([], (require) => {
        cb(null, Login);
      }, 'login')
    },
    onEnter: () => {
      store.dispatch(setActiveModule('login', []))
    },
  })
}

export {
  Login,
}
