import React, { Component } from 'react';
import { connect } from 'react-redux'
import get from 'lodash/get';
import { actions } from '../../../modules/actions'
import presenter from './presenter'

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
  
}

const mapStateToProps = (state, ownProps) => {

  return {
    
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Transaction)
