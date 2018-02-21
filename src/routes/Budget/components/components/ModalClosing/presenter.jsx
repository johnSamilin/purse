import React from 'react';
import BEMHelper from 'react-bem-helper';
import { Modal } from 'components/Modal';
import Button from 'components/Button';
import { decisions } from 'routes/Budget/const';
import UserInfo from '../UserInfo';

import './style.scss';

function Icon(props) {
  const classes = new BEMHelper('modal-closing');
  const {
    status,
  } = props;
  const icons = {
    [decisions.pending]: 'mi-timer',
    [decisions.approved]: 'mi mi-check',
    [decisions.rejected]: 'mi mi-close',
  };

  return (
    <div {...classes('icon', '', `mi ${icons[status]}`)} />
  );
}

export default function ModalClosing(props) {
  const classes = new BEMHelper('modal-closing');
  const {
    usersList = [],
    currentUserId,
    makeDecision,
  } = props;
  const currentUser = usersList.find(user => user.id === currentUserId) || {};

  return (
    <Modal title={'Ждем подтверждения от участников'}>
      <ul>
        {usersList
          .map((user) => {
            let status = decisions.pending;
            if (user.decision === decisions.approved || user.isOwner) {
              status = decisions.approved;
            }
            return (<UserInfo {...user}>
              <Icon status={status} />
            </UserInfo>);
          })
        }
      </ul>
      {currentUser.decision === decisions.pending &&
        <div {...classes('buttons')}>
          <Button mods={['success']} onClick={() => makeDecision(decisions.approved)}>Да, закрыть</Button>
          <Button mods={['removed']} onClick={() => makeDecision(decisions.rejected)}>Нет, еще не все</Button>
        </div>
      }
    </Modal>
  );
}
