import React from 'react';
import { Link } from 'react-router';
import BEMHelper from 'react-bem-helper';
import EmptyState from './EmptyState';
import Summary from './Summary';
import Transactions from './Transactions';
import Status from './Status';
import AddForm from './AddForm';
import Users from './Users';
import './style.scss';

export const Budget = (props) => {
  const {
    budget,
    currentUserId,
    requestMembership,
    transactions,
    toggleTransactionState,
    status,
    addTransaction,
    usersList,
  } = props;

  const classes = new BEMHelper('budget-details');
  let pageClasses = new BEMHelper('page');
  pageClasses = pageClasses({ modifiers: { next: props.isNext, active: props.isActive } }).className;

  return (
    <div
      {...classes({ extra: pageClasses })}
    >
      <div {...classes('budget')}>
        {budget.id
          ? [
            <Link key={1} to='/budgets'>Назад</Link>,
            <Summary
              key={2}
              transactions={transactions}
              users={usersList}
              currentUserId={currentUserId}
              currency={budget.currency.label}
              showMyBalance={status === 'active'}
            />,
            <div {...classes('budget-users-transactions')}>
              <div {...classes('budget-users')}>
                {status === 'active' &&
                  <AddForm
                    key={3}
                    currency={budget.currency.key}
                    onAdd={addTransaction}
                  />}
                <Transactions
                  key={4}
                  data={transactions}
                  users={usersList}
                  currency={budget.currency.key}
                  onTransactionClick={toggleTransactionState}         
                />
              </div>
              <Users
                key={6}
                users={usersList}
              />
            </div>,
            <Status key={5} status={status} requestMembership={requestMembership} />
          ]
          : <EmptyState />
        }
      </div>
    </div>
  )
}

Budget.propTypes = {
}

export default Budget
