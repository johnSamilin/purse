import React from 'react';
import BEMHelper from 'react-bem-helper';
import { currencies } from '../../../routes/Constructor/const';
import {
  Button,
  Header,
  ListItem,
  UserInfo,
  Select,
  Input,
} from '../../../components';

import './style.scss';

export const Construct = (props) => {
  const {
    getPageClasses,
    canCreate,
    users,
    onChangeTitle,
    onChangeCurrency,
    onChangeInvitedUsers,
    onSubmit,
    values,
  } = props;

  const classes = new BEMHelper('construct');

  return (
    <form
      onSubmit={onSubmit}
      {...classes({ extra: getPageClasses() })}
    >
      <Header title={'Create new budget'} backurl={'/'} />
      <div {...classes('title')}>
        <Input
          {...classes('title-input')}
          name={'title'}
          placeholder={'Название'}
          value={values.title}
          onChange={e => onChangeTitle(e.target.value)}
        />
      </div>
      <div {...classes('subtitle')}>
        <Select
          name={'currency'}
          {...classes('select')}
          value={values.currency}
          onChange={e => onChangeCurrency(e.target.value)}
          options={currencies}
        />
      </div>
      <div {...classes('users')}>
        {users && users.map((user, k) => <ListItem key={k} {...classes('user')}>
          <UserInfo {...user} />
          <div
            {...classes({
              element: 'checkbox',
              extra: 'material-icons mi-check',
              modifiers: { checked: values.invitedUsers.has(user.id) },
            })}
          >
            <input
              type={'checkbox'}
              value={values.invitedUsers.has(user.id)}
              onChange={() => onChangeInvitedUsers(user.id)}
              id={`invitedUsers[${k}]`}
            />
            <label htmlFor={`invitedUsers[${k}]`} />
          </div>
        </ListItem>)}
      </div>
      <Button
        {...classes('submit-btn')}
        mods={['success']}
        type={'submit'}
        disabled={!canCreate}
      >
        Создать
      </Button>
    </form>
  );
};

export default Construct;
