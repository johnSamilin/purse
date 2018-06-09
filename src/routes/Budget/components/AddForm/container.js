import React, { Component } from 'react';
// import { connect } from 'react-redux'
import { withRouter } from 'react-router';
import get from 'lodash/get';
// import { reduxForm, reset } from 'redux-form';
// import { actions } from '../../modules/actions';
import { forms } from '../../const';
import presenter from './presenter';

export class AddForm extends Component {
	render() {
		return presenter(this.props);
	}
}

// const mapDispatchToProps = {
//   flush: () => reset(forms.transaction),
// }

// const mapStateToProps = (state, ownProps) => {
// 	const formValues = get(state, 'form.transaction.values');
// 	const amount = get(formValues, 'amount', '');
// 	return {
// 		isExpanded: amount ? amount.trim().length > 0 : false,
// 		initialValues: {
// 			amount: '',
// 			note: '',
// 		},
// 	};
// }

// function mergeProps(stateProps, dispatchProps, ownProps) {
// 	return {
// 		...stateProps,
// 		...dispatchProps,
// 		...ownProps,
// 		onSubmit: ({ amount, note }) => {
// 			const sum = parseInt(amount.replace(/[\s\D]*/g, ''), 10);
// 			if (!sum) {
// 				return;
// 			}
// 			ownProps.onAdd(amount, note);
// 			dispatchProps.flush();
// 		}
// 	}
// }

