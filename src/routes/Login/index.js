import { setActiveModule } from 'store/modules';
const Login = require('./containers').default;
import {
  accountkitAppId,
  accountkitApiVersion,
  csrf,
} from 'const';
import { injectReducer } from '../../store/reducers';

export default (store) => {
  const loginReducer = require('./modules/actions').default;
  injectReducer(store, { key: 'login', reducer: loginReducer });
  // Account kit
  try {
    AccountKit.init(
      {
        appId: accountkitAppId, 
        state: csrf, 
        version: accountkitApiVersion,
        fbAppEventsEnabled: true,
        debug: __DEV__,
        redirect: 'https://purse-back.herokuapp.com/auth/success',
      }
    );
  } catch(er) {
    console.error(er);
  }

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
