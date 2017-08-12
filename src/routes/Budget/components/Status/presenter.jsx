import React from 'react';
import BEMHelper from 'react-bem-helper';
import { userStatuses } from 'routes/Budget/const';
import { Button } from 'components';
import './style.scss';

function Status(props) {
	const {
		status,
		requestMembership,
	} = props;
	const classes = new BEMHelper('budget-status');
	
	return (
		<Button mods={[status]} onClick={requestMembership}>
			{userStatuses[status]}
		</Button>
	);
}

export default Status;
