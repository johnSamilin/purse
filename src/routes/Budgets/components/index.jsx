// @ts-check
import get from 'lodash/get';
import React from 'react';
import BEMHelper from 'react-bem-helper';
import { Link } from 'react-router';
import { budgetStates } from '../../../const';
import { Tabs } from '../../../components/Tabs/index';
import LoadingPanel from '../../../components/LoadingPanel';
import EmptyState from '../../../components/EmptyState';
import { paths } from '../../../routes/Budgets/const';
import Info from './Info';
import './style.scss';


export const Budgets = (props) => {
  const classes = new BEMHelper('budget-list');
  const {
    getPageClasses,
    activeList,
    pendingAttentionList,
    activeBudget,
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
                  budget={budget}
                  isActive={get(activeBudget, 'id') === budget.id}
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
                  budget={budget}
                  isActive={get(activeBudget, 'id') === budget.id}
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
    <div {...classes({ extra: getPageClasses() })}>
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
