import React, { Component } from 'react';
import { browserHistory, Router } from 'react-router';

class AppContainer extends Component {

  shouldComponentUpdate() {
    return false;
  }

  render() {
    const { routes } = this.props;

    return (
      <div style={{ height: '100%' }}>
        <Router history={browserHistory} children={routes} />
      </div>
    );
  }
}

export default AppContainer;
