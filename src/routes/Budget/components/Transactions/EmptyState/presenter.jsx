import React from 'react';
import BEMHelper from 'react-bem-helper';
import './style.scss';

function EmptyState(props) {
	const classes = new BEMHelper('budget-transactions-empty-state');

	return (
		<div {...classes()}>
			<span>No transactions yet</span>
		</div>
	);
}

export default EmptyState;
