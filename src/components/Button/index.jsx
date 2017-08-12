import React from 'react';
import BEMHelper from 'react-bem-helper';

import './Button.scss';

function Button(props) {
  const classes = new BEMHelper('button');
  const {
    className,
    children,
    onClick,
    mods = [],
    disabled,
  } = props;
  const modifiers = [];
  if (disabled) {
  	modifiers.push('disabled');
  }

  return (
    <div {...classes({ extra: className, modifiers: mods.concat(modifiers) })} onClick={onClick}>
      <span>{children}</span>
    </div>
  );
}

export default Button;
