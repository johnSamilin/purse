import React from 'react';
import BEMHelper from 'react-bem-helper';
import numeral from 'numeral';
import { EmptyState, Button, UserInfo } from 'components';
import { statusesMap } from 'routes/Budget/const';
import get from 'lodash/get';
import './style.scss';

function Users(props) {
	const {
		users,
		canManage,
		onChangeStatus,
		ownerId,
	} = props;
	const classes = new BEMHelper('budget-users');

	return (
		<div {...classes()}>
			{users && users.map(user =>
				<div {...classes('user')}>
					<UserInfo {...user} />
					<div {...classes('actions')}>
						<span {...classes('status', user.status)}>
							{user.id == ownerId ? 'Owner' : user.status}
						</span>
						{canManage && user.id !== ownerId
							? <Button
								{...classes('action')}
								mods={['inline', get(statusesMap, `[${user.status}].modifier`, 'active')]}
								onClick={() => onChangeStatus(user, get(statusesMap, `[${user.status}].nextStatus`, 'pending'))}
							>
								{get(statusesMap, `[${user.status}].title`)}
							</Button>
							: null
						}
					</div>
				</div>
			)}
			{!users || !users.length
				? <EmptyState message={'Участники'} />
				: null
			}
		</div>
	);
}

export default Users;
