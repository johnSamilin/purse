import React from 'react';
import BEMHelper from 'react-bem-helper';

import './style.scss';

export function UserInfo(props) {
  const {
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
