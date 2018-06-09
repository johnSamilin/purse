import React, { Component } from 'react';
import { browserHistory, Router } from 'react-router';
// import { Provider } from 'react-redux';
// import { syncHistoryWithStore } from 'react-router-redux';

class AppContainer extends Component {

  shouldComponentUpdate() {
    return false;
  }

  render() {
    const { routes } = this.props;
    // const history = syncHistoryWithStore(browserHistory, store);

    return (
      <div style={{ height: '100%' }}>
        <Router history={browserHistory} children={routes} />
      </div>
    );
  }
}

export default AppContainer;
