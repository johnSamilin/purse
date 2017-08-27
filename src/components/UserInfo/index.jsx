import React from 'react';
import BEMHelper from 'react-bem-helper';

import './UserInfo.scss';

function UserInfo(props) {
  const {
    className,
    id,
    name,
    phone,
    email,
  } = props;
  const classes = new BEMHelper('user-info');

  return (
    <div {...classes({ extra: className })}>
      <span {...classes('name')}>
        {name}
      </span>
      <span {...classes('phone')}>
        {phone ? phone : email}
      </span>
    </div>
  );
}

export default UserInfo;
