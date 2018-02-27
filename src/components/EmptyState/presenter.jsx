import React from 'react';
import BEMHelper from 'react-bem-helper';
import './style.scss';

function EmptyState({ message }) {
  const classes = new BEMHelper('empty-state');

  return (
    <div {...classes()}>
      <span>{message}</span>
    </div>
  );
}

export default EmptyState;
