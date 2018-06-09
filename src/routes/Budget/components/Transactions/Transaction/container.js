import React, { Component } from 'react';
// import { connect } from 'react-redux';
import get from 'lodash/get';
// import { actions } from '../../../modules/actions';
import presenter from './presenter';

class Transaction extends Component {
  componentWillMount() {
  }

  componentWillReceiveProps(newProps) {
  }

  render() {
    return presenter(this.props);
  }
}

const mapDispatchToProps = {

};

function mapStateToProps(state, ownProps) {
  return {
    isSynced: ownProps._synced$.getValue(),
  };
}

export default Transaction;
