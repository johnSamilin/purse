// @ts-check
import get from 'lodash/get';
import React from 'react';
import BEMHelper from 'react-bem-helper';
import { Button, Header, LoadingPanel } from '../../../components';
import { apiPaths, budgetStates } from '../../../const';
import { share } from '../../../services/share';
import { paths, userStatuses } from '../const';
import { AddForm } from './AddForm';
import { Summary } from './Summary';
import { Transactions } from './Transactions';
import { Status } from './Status';
import './style.scss';
import { ModalClosing } from './components/ModalClosing';

const classes = new BEMHelper('budget');

function BudgetEmptyState() {
  return (
    <div {...classes('empty-state')}>
      <i {...classes({ element: 'empty-state-icon', extra: 'material-icons mi-local-airport' })}></i>
      <span>Выберите бюджет</span>
    </div>
  );
}

export const Budget = (props) => {
  const {
    currentUserStatus,
    usersList,
    isLoading,

    transactions,
    newUsersCount,

    showCollaborators,
    getPageClasses,
    addTransaction,
  } = props;
  const budget = props.budget || {
    id: null,
    title: 'Бюджет',
    state: budgetStates.closed,
    _rev: null,
  };

  const content = [
    <Summary
      key={2}
      transactions={transactions}
      users={usersList}
      currency={get(budget, 'currency.label')}
      showMyBalance={currentUserStatus === userStatuses.active}
      rev={budget._rev}
    />,
    <div key={3} {...classes('budget-transactions')}>
      {budget.state === budgetStates.opened
        && currentUserStatus === userStatuses.active
          ? <AddForm
            key={4}
            currency={get(budget, 'currency.key')}
            onAdd={addTransaction}
          />
          : null
      }
      <Transactions
        key={5}
        data={transactions}
        currency={get(budget, 'currency.key')}
        canBeDeleted={currentUserStatus === userStatuses.active}
        rev={budget._rev}
      />
    </div>,
  ];
  if (budget.state === budgetStates.opened && currentUserStatus !== userStatuses.active) {
    content.push(
      <Status
        key={6}
        status={currentUserStatus}
        rev={budget._rev}
      />
    );
  }
  if (budget.state === budgetStates.closing) {
    content.push(
      <ModalClosing
        usersList={usersList}
        key={7}
        rev={budget._rev}
        ownerId={budget.ownerId}
      />
    );
  }

  return (
    <div {...classes({ extra: getPageClasses() })}>
      <Header title={budget.title} backurl={'/'} rev={budget._rev}>
        <Button
          onClick={showCollaborators}
          {...classes({
            element: 'collaborators',
            extra: 'material-icons mi-tag-faces',
          })}
        >
          {newUsersCount > 0 && <span {...classes('badge')}>{newUsersCount}</span>}
        </Button>
        <Button
          onClick={() => share('Присоединяйтесь к общему бюджету', budget.title, `${apiPaths.frontend}${paths.budget(budget.id)}`)}
          {...classes({
            element: 'share',
            extra: 'material-icons mi-person-add',
          })}
        />
      </Header>
      <div {...classes('budget')}>
        {budget.id !== null
          ? content
          : [<BudgetEmptyState key={1} />]
        }
      </div>
      <LoadingPanel isActive={isLoading} />
    </div>
  );
};

export default Budget;
