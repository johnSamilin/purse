import React from 'react';
import { Link } from 'react-router';
import BEMHelper from 'react-bem-helper';
import { currencies } from 'routes/Constructor/const';
import { Button, Header } from 'components';

import './style.scss';

export const Construct = (props) => {
  const {
    doCreate,
    setTitle,
    setCurrency,
    canCreate,
  } = props;

  const classes = new BEMHelper('construct');
  let pageClasses = new BEMHelper('page');
  pageClasses = pageClasses({ modifiers: { next: props.isNext, active: props.isActive } }).className;

  return (
    <div
      {...classes({ extra: pageClasses })}
    >
      <Header title='Create new budget' backurl='/' />
      <div {...classes('title')}>
        <input
          {...classes('title-input')}
          placeholder='Название'
          onKeyUp={event => setTitle(event.target.value)}
        />
      </div>
      <div {...classes('subtitle')}>
        <select {...classes('select')} onChange={event => setCurrency(event.target.value)}>
          {currencies.map(cur =>
            <option value={cur.id}>{cur.label}</option>
          )}
        </select>
      </div>
      <div {...classes('users')}></div>
      <Button mods={['success']} onClick={doCreate} disabled={!canCreate}>Создать</Button>
    </div>
  )
}

Construct.propTypes = {
}

export default Construct
