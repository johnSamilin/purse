// @ts-check
import React from 'react';
import BEMHelper from 'react-bem-helper';
import moment from 'moment';
import { EmptyState } from '../../../../components';
import './style.scss';
import { Transaction } from './Transaction';

function Divider({ text }) {
  const classes = new BEMHelper('budget-transactions-divider');
  return (<div {...classes()}>
    <span {...classes('text')}>{text}</span>
  </div>);
}

function Transactions(props) {
  const {
    data = [],
    currency,
    onTransactionClick,
    users,
    activeUserIds = new Set(),
  } = props;
  const classes = new BEMHelper('budget-transactions');
  const defaultUser = {
    id: '-1',
    name: 'Someone',
  };
  let dateBlock;

  function content(transaction, index) {
    return (<Transaction
      key={index}
      data={transaction}
      author={users.get(transaction.ownerId) || defaultUser}
      currency={currency}
      onClick={onTransactionClick}
      activeUserIds={activeUserIds}
    />);
  }

  return (
    <div {...classes()}>
      {data.length
        ? <ul>
          {data.map((transaction, i) => {
            const nextDateBlock = moment(transaction.date, 'x').calendar(null, {
              sameDay: 'dddd',
              nextDay: 'dddd',
              nextWeek: 'dddd',
              lastDay: 'dddd',
              lastWeek: 'dddd',
              sameElse: 'MMMM Do YYYY',
            });
            if (dateBlock !== nextDateBlock) {
              dateBlock = nextDateBlock;
              return [
                <Divider key={`d${i}`} text={nextDateBlock} />,
                content(transaction, i),
              ];
            }
            return content(transaction);
          }
          )}
        </ul>
        : <EmptyState message={'Еще ни одной транзакции'} />
      }
    </div>
  );
}

export default Transactions;
