import React from 'react';
import ReactDOM from 'react-dom';
import { Database } from 'database';
import api from 'services/api';
import * as OfflinePluginRuntime from 'offline-plugin/runtime';
import createStore from './store/createStore';
import AppContainer from './containers/AppContainer';

// SW
if (!__DEV__) {
  OfflinePluginRuntime.install({
    // responseStrategy: 'network-first',
    onUpdating: () => {
      console.log('SW Event:', 'onUpdating');
    },
    onUpdateReady: () => {
      console.log('SW Event:', 'onUpdateReady');
        // Tells to new SW to take control immediately
      alert('Доступна новая версия Росплаты');
      OfflinePluginRuntime.applyUpdate();
    },
    onUpdated: () => {
      console.log('SW Event:', 'onUpdated');
        // Reload the webpage to load into the new version
      if (confirm('Доступна новая версия Росплаты. Запустить?')) {
        window.location.reload();
      }
    },
    onUpdateFailed: () => {
      console.log('SW Event:', 'onUpdateFailed');
    },
  });
}

// ========================================================
// Store Instantiation
// ========================================================
const initialState = window.___INITIAL_STATE__;
const store = createStore(initialState);

// ========================================================
// Modules Setup
// ========================================================
const modules = require('./modules/index').default;

modules.forEach(module => module.init(store));

const authModule = require('./modules/auth').default;

api.setUserTokenGetter(authModule.getToken);
// ========================================================
// Render Setup
// ========================================================
const MOUNT_NODE = document.getElementById('root');

let render = () => {
  const routes = require('./routes/index').default(store);

  ReactDOM.render(
    <AppContainer store={store} routes={routes} />,
    MOUNT_NODE
  );
};

// This code is excluded from production bundle
if (__DEV__) {
  if (module.hot) {
    // Development render functions
    const renderApp = render;
    const renderError = (error) => {
      const RedBox = require('redbox-react').default;

      ReactDOM.render(<RedBox error={error} />, MOUNT_NODE);
    };

    // Wrap render in try/catch
    render = () => {
      try {
        renderApp();
      } catch (error) {
        console.error(error);
        renderError(error);
      }
    };

    // Setup hot module replacement
    module.hot.accept('./routes/index', () =>
      setImmediate(() => {
        ReactDOM.unmountComponentAtNode(MOUNT_NODE);
        render();
      })
    );
  }
}

// ========================================================
// Go!
// ========================================================
Database
  .init()
  .then(render)
  .then(() => Database.bindToStore(store))
  .catch(er => console.error(er));
