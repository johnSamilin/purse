import React from 'react';
import BEMHelper from 'react-bem-helper';

import './Select.scss';

function Select(props) {
  const classes = new BEMHelper('select');
  const {
    className,
    onChange,
    value,
    options,
  } = props;

  return (
    <select
      {...classes({ extra: className })}
      value={value}
      onChange={onChange}
    >
      {options.map(option =>
        <option value={option.id}>{option.label}</option>
      )}
    </select>
  );
}

export default Select;
