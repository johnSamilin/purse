import React, { Component } from 'react';
import { connect } from 'react-redux';
import { database } from 'database';
import { get } from 'lodash'; 
import authModule from 'modules/auth';
import { actions as authActions } from 'modules/auth/actions';
import { actions } from '../modules/actions';
import presenter from '../components';
import select from '../modules/selectors';

class Budgets extends Component {
	constructor() {
		super();
		this.state = {
			userInfo: {},
		};
	}

	componentWillReceiveProps(nextProps) {
		if (this.props.isLoading === false && nextProps.isLoading === true) {
			this.props.load();
		}
	}

	render() {
		return presenter(this.props);
	}
}

const mapDispatchToProps = {
  load: actions.load,
  exit: authActions.logout,
}

function mapStateToProps(state) {
	const isLoading = get(state, 'budgets.isLoading', false);
	const userInfo = select.userInfo();

	return {
	  list: select.list(state),
	  activeId: select.active(state),
	  isActive: state.modules.active === 'budgets',
	  isNext: state.modules.next.includes('budgets'),
	  isLoading,
	  userInfo,
	}
}

function mergeProps(stateProps, dispatchProps, ownProps) {
	return {
		...stateProps,
		...dispatchProps,
		...ownProps,
		closeBudget(id) {
			const budgetQuery = database.budgets.findOne(id);
			budgetQuery.exec().then((budget) => {
					budget.state = 'closed';
					budget.save();
				});
		},
		openBudget(id) {
			const budgetQuery = database.budgets.findOne(id);
			budgetQuery.exec().then((budget) => {
					budget.state = 'opened';
					budget.save();
				});
		},
	};
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(Budgets)
