import React from 'react';
import { Link } from 'react-router';
import BEMHelper from 'react-bem-helper';
import { currencies } from 'routes/Constructor/const';
import {
  Button,
  Header,
  ListItem,
  UserInfo,
  Select,
  Input,
} from 'components';
import { Field } from 'redux-form';

import './style.scss';

function Title({ input, className }) {
  return <Input
      className={className}
      placeholder='Название'
      value={input.value}
      onChange={input.onChange}
    />;
}

function Currency({ input, className }) {
  return <Select
      className={className}
      value={input.value}
      onChange={input.onChange}
      options={currencies}
    />;
}

function Checkbox({ input, className }) {
  const classes = new BEMHelper('construct');
  return <div {...classes({
      element: 'checkbox',
      extra: 'mi mi-check',
      modifiers: { checked: input.value }
    })}>
      <input
        type="checkbox"
        value={input.value}
        onChange={input.onChange}
        id={input.name}
      />
      <label htmlFor={input.name}></label>
    </div>;
}

export const Construct = (props) => {
  const {
    canCreate,
    users,
    onSubmit,
    handleSubmit,
  } = props;

  const classes = new BEMHelper('construct');
  let pageClasses = new BEMHelper('page');
  pageClasses = pageClasses({ modifiers: { next: props.isNext, active: props.isActive } }).className;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      {...classes({ extra: pageClasses })}
    >
      <Header title='Create new budget' backurl='/' />
      <div {...classes('title')}>
        <Field component={Title} {...classes('title-input')} name={'title'} />
      </div>
      <div {...classes('subtitle')}>
        <Field component={Currency} {...classes('select')} name={'currency'} />
      </div>
      <div {...classes('users')}>
        {users && users.map((user, k) => <ListItem index={k} {...classes('user')}>
          <UserInfo {...user} />
          <Field
            component={Checkbox}            
            name={`invitedUsers[${k}]`}
          />
        </ListItem>)}
      </div>
      <Button
        mods={['success']}
        type='submit'
        disabled={!canCreate}
      >
        Создать
      </Button>
    </form>
  )
}

export default Construct
