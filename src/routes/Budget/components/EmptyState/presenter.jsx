import React from 'react';
import BEMHelper from 'react-bem-helper';
import './style.scss';

function EmptyState() {
	const classes = new BEMHelper('budget-empty-state');
	
	return (
		<div {...classes()}>
			<i {...classes({ element: 'icon', extra: 'mi mi-local-airport' })}></i>
			<span>Выберите бюджет</span>
		</div>
	);
}

export default EmptyState;
