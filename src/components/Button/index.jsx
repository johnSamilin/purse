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
    type,
  } = props;
  const modifiers = [];
  if (disabled) {
  	modifiers.push('disabled');
  }

  return (
    <button
      {...classes({ extra: className, modifiers: mods.concat(modifiers) })}
      onClick={onClick}
      type={type}
    >
      <span>{children}</span>
    </button>
  );
}

export default Button;
