import React from 'react';
import BEMHelper from 'react-bem-helper';
import { userStatuses } from 'routes/Budget/const';
import './style.scss';

function Status(props) {
	const {
		status,
		requestMembership,
	} = props;
	const classes = new BEMHelper('budget-status');
	
	return (
		<div {...classes({ modifiers: [status] })} onClick={requestMembership}>
			<span>{userStatuses[status]}</span>
		</div>
	);
}

export default Status;
