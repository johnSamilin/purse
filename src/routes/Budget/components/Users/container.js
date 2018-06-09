import React, { Component } from 'react';
// import { connect } from 'react-redux';
import get from 'lodash/get';
// import { actions } from '../../modules/actions';
import presenter from './presenter';

export class Users extends Component {
  componentWillMount() {
  }

  componentWillReceiveProps(newProps) {
  }

  render() {
    return presenter(this.props);
  }
}
