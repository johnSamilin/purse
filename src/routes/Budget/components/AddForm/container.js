import React, { Component } from 'react';
import { connect } from 'react-redux'
import { withRouter } from 'react-router';
import { get } from 'lodash';
import { actions } from '../../modules/actions'
import presenter from './presenter'

class AddForm extends Component {
	constructor() {
		super();
		this.state = {
			isExpanded: false,
		};
		this.toggle = this.toggle.bind(this);
	}

	toggle(newState) {
		this.setState({
			isExpanded: newState,
		})
	}

	render() {
		return presenter({
			...this.props,
			...this.state,
			toggle: this.toggle,
		})
	}
}

const mapDispatchToProps = {
  
}

const mapStateToProps = (state, ownProps) => {	

  return {
  }
}

function mergeProps(stateProps, dispatchProps, ownProps) {
	return {
		...stateProps,
		...dispatchProps,
		...ownProps,
		add: (amount, note) => {
			if (!amount.trim()) {
				return;
			}
			ownProps.onAdd(amount, note);
		}
	}
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps, mergeProps)(AddForm))
