import React from 'react';
import BEMHelper from 'react-bem-helper';

import './ListItem.scss';

function ListItem(props) {
  const classes = new BEMHelper('list-item');
  const {
    className,
    children,
    onClick,
    mods = [],
  } = props;

  return (
    <div {...classes({ extra: className, modifiers: mods })} onClick={onClick}>
      {children}
    </div>
  );
}

export default ListItem;
