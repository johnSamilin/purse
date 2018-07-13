// @ts-check
import React from 'react';
import BEMHelper from 'react-bem-helper';
import {
  EmptyState,
  UserInfo,
  Button,
} from '../../../../components';
import get from 'lodash/get';
import './style.scss';
import { GlobalStore } from '../../../../store/globalStore';
import { statusesMap, userStatuses } from '../../../Budget/const';
import isEmpty from 'lodash/isEmpty';

function translateStatus(status) {
  const titles = {
    [userStatuses.active]: 'Участник',
    [userStatuses.pending]: 'Ожидает',
    [userStatuses.removed]: 'Удален',
    [userStatuses.invited]: 'Приглашен',
  };

  return titles[status];
}

export default function Collaborators(props) {
  const classes = new BEMHelper('collaborators');
  
  const {
    collaborators,
    changeUserStatus,
    canManage = false,
  } = props;
  const activeBudget = GlobalStore.modules.budgets.activeBudget.value || {};
  const {
    ownerId,
  } = activeBudget;

  return (<div {...classes({
    modifiers: { empty: isEmpty(collaborators) },
  })}>
    {collaborators && collaborators.map((user, index) =>
      <div {...classes('user')} key={index}>
        <UserInfo {...user} />
        <div {...classes('actions')}>
          <span {...classes('status', user.status)}>
            {user.id == ownerId ? 'Создатель' : translateStatus(user.status)}
          </span>
          {canManage && user.id !== ownerId
            ? <Button
              {...classes('action')}
              mods={['inline', get(statusesMap, `[${user.status}].modifier`, 'active')]}
              onClick={() => changeUserStatus(user, get(statusesMap, `[${user.status}].nextStatus`, 'pending'))}
            >
              {get(statusesMap, `[${user.status}].title`)}
            </Button>
            : null
          }
        </div>
      </div>
    )}
    {!collaborators || !collaborators.length
      ? <EmptyState message={'Участники'} />
      : null
    }
  </div>);
}