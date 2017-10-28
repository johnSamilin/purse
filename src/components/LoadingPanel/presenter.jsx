import React from 'react';
import BEMHelper from 'react-bem-helper';
import EmptyState from 'components/EmptyState';
import './style.scss';

function LoadingPanel({ message, isActive }) {
	const classes = new BEMHelper('loading-panel');
	const loader = (<div>
		<img src={'/loader.gif'} {...classes('image')} />
		{message}
	</div>);
	
	return (
		<div {...classes({ modifiers: { active: isActive } })}>
			<EmptyState message={loader} />
		</div>
	);
}

export default LoadingPanel;
