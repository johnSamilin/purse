import React from 'react';
import BEMHelper from 'react-bem-helper';
import { Link } from 'react-router';
import { paths } from 'routes/Budgets/const';
import LoadingPanel from 'components/LoadingPanel';
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
  } = props;
  const sections = [
    {
      title: 'Активные бабайки',
      content: (
        <ul {...classes('list')}>
          {activeList && activeList
            .filter(b => b.state !== budgetStates.closing)
            .map((budget, i) =>
              <Info
                key={i}
                {...budget}
                isActive={activeId === budget.id}
                requestClosing={requestClosing}
                openBudget={openBudget}
              />
            )}
        </ul>
      ),
    },
    {
      title: 'Внимание',
      content: (
        <ul {...classes('list')}>
          {pendingAttentionList && pendingAttentionList
            .filter(b => b.state === budgetStates.closing)
            .map((budget, i) =>
              <Info
                key={i}
                {...budget}
                isActive={activeId === budget.id}
                requestClosing={requestClosing}
                openBudget={openBudget}
              />
            )}
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
