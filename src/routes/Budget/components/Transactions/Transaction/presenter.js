import React from 'react';
import BEMHelper from 'react-bem-helper';
import numeral from 'numeral';
import './style.scss';
import { UserInfo } from '../../../../../components';

export function Transaction(props) {
  const {
    data,
    author,
    currency,
    onClick,
  } = props;
  const {
    amount,
    date,
    note,
    cancelled,
  } = data;
  const classes = new BEMHelper('budget-transaction');

  return (
    <div {...classes({ modifiers: { cancelled } })} onClick={() => onClick(data)}>
      <div {...classes('mandatory-info')}>
        <UserInfo {...classes('info')} {...author} />
        <div {...classes('amount')}>
          <span>{numeral(amount).format('0,[.]00')} {currency}</span>
        </div>
      </div>
      <div {...classes({ element: 'note', modifiers: { hidden: !note } })}>
        <span>{note}</span>
      </div>
    </div>
  );
}
