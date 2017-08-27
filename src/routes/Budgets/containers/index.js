import React, { Component } from 'react';
import { connect } from 'react-redux';
import { database } from 'database';
import { get } from 'lodash'; 
import { actions } from '../modules/actions';
import { actions as authActions } from 'modules/auth/actions';
import presenter from '../components';
import select from '../modules/selectors';

class Budgets extends Component {
	componentWillMount() {
		// this.props.load();
	}

	render() {
		return presenter(this.props);
	}
}

const mapDispatchToProps = {
  load: actions.load,
  selectUser: authActions.login,
}

const mapStateToProps = (state) => {

	return {
	  list: select.list(state),
	  activeId: select.active(state),
	  isActive: state.modules.active === 'budgets',
	  isNext: state.modules.next.includes('budgets'),
	  userInfo: get(state, 'auth.data', {
		  id: -1,
		  name: 'unknown user',
	  }),
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
		selectUser(userId) {
			dispatchProps.selectUser({
				id: userId.toString(),
				name: 'User #'+userId,
			});
		}
	};
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(Budgets)
