import React, { Component } from 'react';
import BEMHelper from 'react-bem-helper';
// import { connect } from 'react-redux';

// import { Budget } from 'routes/Budget/containers';
import { Budgets } from 'routes/Budgets/containers';
// import { Construct } from 'routes/Constructor/containers';
import { Login } from 'routes/Login/containers';
// import { Collaborators } from 'routes/Collaborators/containers';
import { notify } from 'services/helpers';

import './CoreLayout.scss';
import { Database } from '../../database/index';
import { GlobalStore } from '../../store/globalStore';

const MobileDetect = require('mobile-detect');

export class CoreLayout extends Component {
  constructor() {
    super();
    this.state = {
      isOffline: false,
      isLoggedIn: false,
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
      <div className="container">
        <div {...classes({ element: 'viewport', modifiers: { mobile: isMobile, offline: isOffline } })}>
          {isLoggedIn === true
            ? [
              /*<Collaborators />,
              <Budget />,
              <Construct />,*/
              <Budgets />,
            ]
            : <Login />
          }
        </div>
      </div>
    );
  }
}

// function mapStateToProps(state) {
//   const { id } = selectors.userInfo(state);
//   const budgetIds = selectors.availableBudgets(state);

//   return {
//     isLoggedIn: state.auth.data.loggedIn,
//     userId: id,
//     budgetIds,
//   };
// }

export default CoreLayout;
