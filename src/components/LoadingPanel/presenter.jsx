import React from 'react';
import BEMHelper from 'react-bem-helper';
import EmptyState from 'components/EmptyState';
import './style.scss';

function LoadingPanel({ isActive, message = 'Загрузка' }) {
  const classes = new BEMHelper('loading-panel');
  const loader = (<div {...classes('content')}>
    <img src={'/loader.gif'} {...classes('image')} />
    <span>{message}</span>
  </div>);
  
  return (
    <div {...classes({ modifiers: { active: isActive } })}>
      <EmptyState message={loader} />
    </div>
  );
}

export default LoadingPanel;
