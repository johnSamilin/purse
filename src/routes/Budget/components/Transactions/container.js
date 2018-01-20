import React, { Component } from 'react';
import { connect } from 'react-redux'
import { withRouter } from 'react-router';
import get from 'lodash/get';
import { actions } from '../../modules/actions'
import presenter from './presenter'

class Transactions extends Component {
  componentWillMount() {
  }

  componentWillReceiveProps(newProps) {
  }

  render() {
    return presenter(this.props);
  }
}

const mapDispatchToProps = {
  
}

const mapStateToProps = (state) => {
	const isLoading = get(state, 'budget.isLoading');

  return {
    isLoading,
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Transactions))
