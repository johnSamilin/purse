import React from 'react';
import BEMHelper from 'react-bem-helper';
import {
  Button,
  Input,
} from '../../../../components';
import './style.scss';

export default function AddForm(props) {
  const {
    currency = '$',
    onSubmit,
    changeAmount,
    changeNote,
    amount = 0,
    note = '',
    collaborators,
    users = [],
    
    toggleUser,
    toggleAllUsers,
  } = props;
  const classes = new BEMHelper('budget-add-form');
  const isExpanded = amount > 0;
  
  return (
    <form
      {...classes()}
      onSubmit={onSubmit}
    >
      <div {...classes('amount')}>
        <Input
          {...classes('input')}
          name={'amount'}
          placeholder={`100 ${currency}`}
          type={'number'}
          value={amount}
          onChange={changeAmount}
        />
        <Button
          type={'submit'}
          {...classes('check-btn')}
        >
          <i {...classes({
            element: 'check-btn-ico',
            extra: 'material-icons mi-check',
          })}></i>
        </Button>
      </div>
      <Input
        {...classes({
          element: 'input',
          modifiers: { hidden: !isExpanded },
        })}
        name={'note'}
        placeholder={'Optional note'}
        value={note}
        onChange={changeNote}
      />
      <div {...classes({
        element: 'collaborators',
        modifiers: { hidden: !isExpanded },
      })}>
        <Button
          {...classes('collaborator')}
          type={'button'}
          onClick={() => toggleAllUsers()}
          mods={['inline', collaborators.size === 0 ? 'success' : '']}
        >На всех</Button>        
        <Button
          {...classes('collaborator')}
          type={'button'}
          mods={['inline', collaborators.size !== 0 ? 'success' : '']}
        >Я</Button>
        {
          users.map(user => 
            <Button
            {...classes('collaborator')}
              type={'button'}
              onClick={() => toggleUser(user)}
              mods={['inline', collaborators.has(user.id) ? 'success' : '']}
            >{user.phone || user.email}</Button>
          )
        }
      </div>
    </form>
  );
}
