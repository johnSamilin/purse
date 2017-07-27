import React from 'react';
import BEMHelper from 'react-bem-helper';
import numeral from 'numeral';
import './style.scss';

function Users(props) {
	const {
		users,
	} = props;
	const classes = new BEMHelper('budget-users');

	return (
		<div {...classes()}>
			{users && users.map(user =>
				<div {...classes('user')}>
					<span {...classes('username')}>{user.name}</span>
					
				</div>
			)}
		</div>
	);
}

export default Users;
