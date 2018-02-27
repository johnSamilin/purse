import React from 'react';
import BEMHelper from 'react-bem-helper';
import { Link } from 'react-router';
import { paths } from 'routes/Budgets/const';
import LoadingPanel from 'components/LoadingPanel';
import EmptyState from 'components/EmptyState';
import { budgetStates } from 'const';

import Info from './Info';
import './style.scss';
import { Tabs } from '../../../components/Tabs/index';

export const Budgets = (props) => {
  const classes = new BEMHelper('budget-list');
  let pageClasses = new BEMHelper('page');
  pageClasses = pageClasses({
    modifiers: {
      next: props.isNext,
      active: props.isActive,
    },
  }).className;
  const {
    activeList,
    pendingAttentionList,
    activeId,
    load,
    requestClosing,
    openBudget,
    userInfo,
    isLoading,
    logout,
    deleteBudget,
  } = props;
  const sections = [
    {
      title: 'Все бюджеты',
      content: (
        <ul {...classes('list', { empty: !activeList.length })}>
          {activeList.length
            ? activeList
              .filter(b => b.state !== budgetStates.closing)
              .map((budget, i) =>
                <Info
                  key={i}
                  {...budget}
                  isActive={activeId === budget.id}
                  requestClosing={requestClosing}
                  openBudget={openBudget}
                  deleteBudget={deleteBudget}
                />
              )
            : <EmptyState message={'Пока ни одного бюджета. Создайте или присоединитесь к существующему'} />
            }
        </ul>
      ),
    },
    {
      title: 'Внимание',
      badge: pendingAttentionList.length,
      content: (
        <ul {...classes('list', { empty: !pendingAttentionList.length })}>
          {pendingAttentionList.length
            ? pendingAttentionList
              .filter(b => b.state === budgetStates.closing)
              .map((budget, i) =>
                <Info
                  key={i}
                  {...budget}
                  isActive={activeId === budget.id}
                  requestClosing={requestClosing}
                  openBudget={openBudget}
                  deleteBudget={deleteBudget}
                />
              )
            : <EmptyState message={'Нет бюджетов, требующих вашего внимания'} />
            }
        </ul>
      ),
    },
  ];

  return (
    <div {...classes({ extra: pageClasses })}>
      <div {...classes('username')}>
        <span
          {...classes({
            element: 'exit',
            extra: 'mi mi-power-settings-new',
          })}
          onClick={logout}
        />
        <span {...classes('name')}>{userInfo.phone}</span>
      </div>
      <Tabs sections={sections} />
      <Link to={paths.construct()} {...classes('fab')}>+</Link>
      <LoadingPanel isActive={isLoading} />
    </div>
  );
};

export default Budgets;
