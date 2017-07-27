import React, { Component } from 'react';
import { connect } from 'react-redux'
import { withRouter } from 'react-router';
import { get } from 'lodash';
import { actions } from '../../modules/actions';
import Summary from './presenter';

function getBalance(total, my, count) {
	if (count === 0) {
		return 0;
	}
	return my - total / count;
}

const mapDispatchToProps = {
  
}

const mapStateToProps = (state, ownProps) => {
	let total = 0;
	let myTotal = 0;
	ownProps.transactions.forEach((t) => {
		total += !t.cancelled ? t.amount : 0;
	});
	ownProps.transactions.forEach((t) => {
		myTotal += t.ownerId === ownProps.currentUserId && !t.cancelled ? t.amount : 0
	});
	myTotal = getBalance(total, myTotal, ownProps.users.length);

  return {
    total,
    myTotal,
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Summary))
