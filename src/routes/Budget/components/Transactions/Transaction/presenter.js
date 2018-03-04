import React from 'react';
import BEMHelper from 'react-bem-helper';
import numeral from 'numeral';
import { UserInfo } from 'components';
import './style.scss';

function Transaction(props) {
  const {
    id,
    amount,
    date,
    note,
    cancelled,
    author,
    currency,
    isSynced,
    onClick,
  } = props;
  const classes = new BEMHelper('budget-transaction');

  return (
    <div {...classes({ modifiers: { cancelled } })} onClick={() => onClick(id)}>
      <div {...classes('mandatory-info')}>
        <UserInfo {...classes('info')} {...author} />
        <div {...classes('amount')}>
          <span>{numeral(amount).format('0,[.]00')} {currency}</span>
        </div>
      </div>
      {!isSynced && <span>Not synced yet</span>}
      <div {...classes({ element: 'note', modifiers: { hidden: !note } })}>
        <span>{note}</span>
      </div>
    </div>
  );
}

export default Transaction;
