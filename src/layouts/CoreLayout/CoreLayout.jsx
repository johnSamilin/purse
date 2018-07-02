// @ts-check
import React, { Component } from 'react';
import BEMHelper from 'react-bem-helper';

import { Budget } from '../../routes/Budget/containers';
import { Budgets } from '../../routes/Budgets/containers';
import { Construct } from '../../routes/Constructor/containers';
import { Login } from '../../routes/Login/containers';
import { Collaborators } from '../../routes/Collaborators/containers';
import { notify } from '../../services/helpers';

import './CoreLayout.scss';
import { Database } from '../../database/index';
import { GlobalStore } from '../../store/globalStore';

const MobileDetect = require('mobile-detect');

export class CoreLayout extends Component {
  constructor(params) {
    super(params);
    this.state = {
      isOffline: false,
      isLoggedIn: GlobalStore.modules.auth.isLoggedIn.value,
    };
    GlobalStore.modules.auth.isLoggedIn.subscribe(isLoggedIn => this.onLoginChanged(isLoggedIn));
  }

  componentDidMount() {
    window.addEventListener('offline', () => this.setOfflineStatus(true));
    window.addEventListener('online', () => this.setOfflineStatus(false));
  }

  onLoginChanged(isLoggedIn) {
    this.setState({
      isLoggedIn,
    });
  }

  setOfflineStatus(isOffline) {
    notify(`${isOffline ? 'Я оффлайн' : 'Я снова онлайн'}`);
    if (isOffline) {
      Database.stopSync();
    } else {
      Database.startSync();
    }
    this.setState({
      isOffline,
    });
  }

  render() {
    const classes = new BEMHelper('core-layout');
    const md = new MobileDetect(window.navigator.userAgent);
    const isMobile = md.mobile() && !md.tablet();
    const { isOffline, isLoggedIn } = this.state;

    return (
      <div {...classes()}>
        <div {...classes({ element: 'viewport', modifiers: { mobile: isMobile, offline: isOffline } })}>
          {isLoggedIn === true
            ? [
              <Collaborators key={1} />,
              <Budget key={2} />,
              <Construct key={3} />,
              <Budgets key={4} />,
            ]
            : <Login key={5} />
          }
        </div>
      </div>
    );
  }
}

export default CoreLayout;
