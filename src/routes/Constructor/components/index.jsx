import React from 'react';
import { Link } from 'react-router';
import BEMHelper from 'react-bem-helper';
import { currencies } from 'routes/Constructor/const';
import {
  Button,
  Header,
  ListItem,
  UserInfo,
} from 'components';
import { Form, Field } from 'redux-form';

import './style.scss';

export const Construct = (props) => {
  const {
    doCreate,
    setTitle,
    setCurrency,
    canCreate,
    users,
    toggleUser,
    invitedUsers,
    gainFocus,
    title,
  } = props;

  const classes = new BEMHelper('construct');
  let pageClasses = new BEMHelper('page');
  pageClasses = pageClasses({ modifiers: { next: props.isNext, active: props.isActive } }).className;

  return (
    <Form
      {...props}
      {...classes({ extra: pageClasses })}
    >
      <Header title='Create new budget' backurl='/' />
      <div {...classes('title')}>
        <Field component={({ input }) => {
          return <input
            {...classes('title-input')}
            placeholder='Название'
            value={input.value}
            onChange={input.onChange}
          />
        }} />
      </div>
      <div {...classes('subtitle')}>
        <select {...classes('select')} onChange={event => setCurrency(event.target.value)}>
          {currencies.map(cur =>
            <option value={cur.id}>{cur.label}</option>
          )}
        </select>
      </div>
      <div {...classes('users')}>
        {users && users.map((user, k) => <ListItem index={k} {...classes('user')}>
          <input
            type="checkbox"
            value={users.length ? user.id in invitedUsers : false}
            name={`user[${user.id}]`}
            onChange={(e) => toggleUser(user, e.target.value)}
          />
          <UserInfo {...user} />
        </ListItem>)}
      </div>
      <Button
        mods={['success']}
        type='submit'
        disabled={!canCreate}
      >
        Создать
      </Button>
    </Form>
  )
}

Construct.propTypes = {
}

export default Construct
