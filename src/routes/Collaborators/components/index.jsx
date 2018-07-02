// @ts-check
import React from 'react';
import BEMHelper from 'react-bem-helper';
import {
  EmptyState,
  UserInfo,
  Button,
  Header,
} from '../../../components';
import get from 'lodash/get';
import './style.scss';
import { paths } from '../const';
import { GlobalStore } from '../../../store/globalStore';
import { statusesMap } from '../../Budget/const';

export default function Collaborators(props) {
  const classes = new BEMHelper('collaborators');
  
  const {
    collaborators,
    changeUserStatus,
    canManage = false,

    getPageClasses,
  } = props;
  const activeBudget = GlobalStore.modules.budgets.activeBudget.value || {};
  const {
    title,
    ownerId,
  } = activeBudget;
  const backurl = paths.budget(activeBudget.id);

  return (
    <div {...classes({ extra: getPageClasses() })}>
      <Header title={title} backurl={backurl} />
      {collaborators && collaborators.map(user =>
        <div {...classes('user')}>
          <UserInfo {...user} />
          <div {...classes('actions')}>
            <span {...classes('status', user.status)}>
              {user.id == ownerId ? 'Owner' : user.status}
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
    </div>
  );
}