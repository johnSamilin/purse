import React from 'react';
import BEMHelper from 'react-bem-helper';
import './style.scss';
import { decisions } from '../../../const';
import { Modal, Button } from '../../../../../components';
import { GlobalStore } from '../../../../../store/globalStore';
import { UserInfo } from '../UserInfo/presenter';

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
    users = [],
    makeDecision,
    ownerId,
  } = props;
  const currentUserId = GlobalStore.modules.users.activeUser.value.id;
  const currentUser = users.find(user => user.id === currentUserId) || {};
  const canMakeDecision = currentUser.decision === decisions.pending && !currentUser.isOwner;
  return (
    <Modal title={'Ждем подтверждения от участников'}>
      <ul>
        {users
          .map((user) => {
            let status = decisions.pending;
            if (user.decision === decisions.approved || user.id === ownerId) {
              status = decisions.approved;
            }
            return (<UserInfo {...user}>
              <Icon status={status} />
            </UserInfo>);
          })
        }
      </ul>
      {canMakeDecision &&
        <div {...classes('buttons')}>
          <Button mods={['success']} onClick={() => makeDecision(decisions.approved)}>Да, закрыть</Button>
          <Button mods={['removed']} onClick={() => makeDecision(decisions.rejected)}>Нет, еще не все</Button>
        </div>
      }
    </Modal>
  );
}
