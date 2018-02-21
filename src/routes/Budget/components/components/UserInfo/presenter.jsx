import React from 'react';
import BEMHelper from 'react-bem-helper';
import get from 'lodash/get';

import './style.scss';

export default function UserInfo(props) {
	const {
		id,
    name,
    phone,
    email,
    children,
	} = props;
	const classes = new BEMHelper('budget-user-info');

	return (
		<div {...classes()}>
			<div {...classes('name')}>
        {name || phone || email}
      </div>
      {children}
		</div>
	);
}
