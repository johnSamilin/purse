import React from 'react';
import BEMHelper from 'react-bem-helper';

import './Input.scss';

function Input(props) {
  const classes = new BEMHelper('input');
  const {
    className,
    onChange,
    value,
    type,
    placeholder,
  } = props;

  return (
    <input
      {...classes({ extra: className })}
      value={value}
      onChange={onChange}
      type={type}
      placeholder={placeholder}
    />
  );
}

export default Input;
