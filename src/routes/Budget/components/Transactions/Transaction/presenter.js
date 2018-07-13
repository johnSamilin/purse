import React from 'react';
import BEMHelper from 'react-bem-helper';
import numeral from 'numeral';
import isEmpty from 'lodash/isEmpty';
import './style.scss';
import { UserInfo } from '../../../../../components';

const classes = new BEMHelper('budget-transaction');

export function Transaction(props) {
  const {
    data,
    author,
    currency,
    onClick,
    activeUserIds = new Set(),
  } = props;
  const {
    amount,
    date,
    note,
    cancelled,
    collaborators = [],
    isPaidByOwner,
  } = data;

  const activeCollaborators = collaborators.filter(c => activeUserIds.has(c.id));

  return (
    <div {...classes({ modifiers: { cancelled } })} onClick={() => onClick(data)}>
      <div {...classes('mandatory-info')}>
        <div {...classes('info')}>
          <UserInfo {...classes('user-info')} {...author} />
        </div>
        <div {...classes('amount')}>
          <span>{numeral(amount).format('0,[.]00')} {currency}</span>
          <div
            {...classes({
              element: 'icon-wrapper',
              modifiers: {
                hidden: isEmpty(collaborators) && !isPaidByOwner,
              },
            })}
          >
            {!isEmpty(collaborators) &&
              <div {...classes('group')}>
                {`${activeCollaborators.length > 0 ? `+${activeCollaborators.length - 0}` : ''}`}
              <div {...classes({ element: 'icon', extra: 'material-icons mi-group' })} />
              </div>
            }
            {isPaidByOwner &&
              <div {...classes('paid-indicator')}>Оплачено</div>
            }
          </div>
        </div>
      </div>
      <div {...classes({
        element: 'note',
        modifiers: {
          hidden: !note,
          padded: isEmpty(collaborators),
        },
      })}
      >
        <span>{note}</span>
      </div>
    </div>
  );
}
