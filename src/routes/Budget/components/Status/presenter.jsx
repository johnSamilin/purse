import React from 'react';
import BEMHelper from 'react-bem-helper';
import { userStatusMessages } from 'routes/Budget/const';
import { Button } from 'components';
import './style.scss';

function Status(props) {
	const {
		status,
		requestMembership,
		respondInvite,
	} = props;
	const classes = new BEMHelper('budget-status');
	
	return (
		status === 'invited'
			? <div {...classes('buttons')}>
				<Button mods={['success']} onClick={() => respondInvite(true)}>
					Вступить
				</Button>
				<Button mods={['removed']} onClick={() => respondInvite(false)}>
					Скрыть
				</Button>
			</div>
			: <Button mods={[status]} onClick={requestMembership}>
				{userStatusMessages[status]}
			</Button>
	);
}

export default Status;
