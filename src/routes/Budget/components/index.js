import React from 'react';
import { Link } from 'react-router';
import BEMHelper from 'react-bem-helper';
import {
  Header,
  Button,
} from 'components';
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
    changeUserStatus,
    transactions,
    toggleTransactionState,
    status,
    addTransaction,
    usersList,
    isOwner,
    respondInvite,
    isLoading,
    showCollaborators,
    newUsersCount,
  } = props;

  const classes = new BEMHelper('budget-details');
  let pageClasses = new BEMHelper('page');
  pageClasses = pageClasses({ modifiers: { next: props.isNext, active: props.isActive } }).className;

  return (
    <div
      {...classes({ extra: pageClasses })}
    >
      <Header title={budget.title} backurl='/'>
        <Button onClick={showCollaborators} {...classes({
          element: 'collaborators',
          extra: 'mi mi-tag-faces',
        })}>
          {newUsersCount > 0 && <span {...classes('badge')}>{newUsersCount}</span>}          
        </Button>
      </Header>
      <div {...classes('budget')}>
        {budget.id
          ? [
            <Summary
              key={2}
              transactions={transactions}
              users={usersList}
              currentUserId={currentUserId}
              currency={budget.currency.label}
              showMyBalance={status === 'active'}
            />,
            <div {...classes('budget-transactions')}>
              {budget.state === 'opened' && status === 'active' &&
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
            </div>,
            budget.state === 'opened'
              ? <Status
                key={5}
                status={status}
                requestMembership={requestMembership}
                respondInvite={respondInvite}
              />
              : null
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
