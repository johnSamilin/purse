import React from 'react';
import BEMHelper from 'react-bem-helper';

import './Header.scss';

function Header(props) {
  const classes = new BEMHelper('header');
  const {
    title,
    children,
    goTo,
    backurl,
  } = props;

  return (
    <div {...classes()}>
      <i onClick={() => goTo(backurl)} {...classes({ element: 'btn', extra: 'material-icons mi-arrow-back' })}></i>
      <h1 {...classes('title')}>{title}</h1>
      <div {...classes('buttons')}>
        {children}
      </div>
    </div>
  );
}

export default Header;
