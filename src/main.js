import React from 'react';
import ReactDOM from 'react-dom';
import api from 'services/api';
import * as OfflinePluginRuntime from 'offline-plugin/runtime';
import moment from 'moment';
import numeral from 'numeral';
import 'numeral/locales/ru';
import AppContainer from './containers/AppContainer';
import { notify } from './services/helpers';
import { GlobalStore } from './store/globalStore';
import routes from './routes';
import { Database } from './database';

console.tlog = (...messages) => {
  console.timeEnd('delta');
  console.time('delta');
  console.info(...messages);
}

moment.locale('ru');
numeral.locale('ru');
if ('Notification' in window && !Notification.permission !== 'denied') {
  Notification.requestPermission();
}

// SW
if (!__DEV__) {
  OfflinePluginRuntime.install({
    // responseStrategy: 'network-first',
    onUpdating: () => {
      console.tlog('SW Event:', 'onUpdating');
    },
    onUpdateReady: () => {
      console.tlog('SW Event:', 'onUpdateReady');
        // Tells to new SW to take control immediately
      OfflinePluginRuntime.applyUpdate();
    },
    onUpdated: () => {
      console.tlog('SW Event:', 'onUpdated');
        // Reload the webpage to load into the new version
      if (confirm('Доступна новая версия Росплаты. Запустить?')) {
        window.location.reload();
      }
    },
    onUpdateFailed: () => {
      console.tlog('SW Event:', 'onUpdateFailed');
    },
  });
}
// ========================================================
// Modules Setup
// ========================================================
const modules = require('./modules/index').default;
modules.forEach(module => GlobalStore.registerModule(module));

api.setUserTokenGetter(() => GlobalStore.modules.auth.token.value);
// ========================================================
// Render Setup
// ========================================================
const MOUNT_NODE = document.getElementById('root');

let render = () => {
  ReactDOM.render(
    <AppContainer routes={routes} />,
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
  .catch(er => {
    console.error(er);
    alert('Что-то пошло не так... ' + JSON.stringify(er));
  });
