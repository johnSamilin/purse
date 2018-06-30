// @ts-check
import moment from 'moment';
import numeral from 'numeral';
import pluralize from 'pluralize';
import React from 'react';
import BEMHelper from 'react-bem-helper';
import { Link } from 'react-router';
import Dropdown, { DropdownContent, DropdownTrigger } from 'react-simple-dropdown';
import { budgetStates } from '../../../../const';
import { paths } from '../../const';
import './style.scss';


function Info(props) {
  const {
    budget,
    requestClosing,
    openBudget,
    deleteBudget,
    selectBudget,
    isActive,
  } = props;
  const {
    id,
    date,
    title,
    state,
    sum = 0,
    currency,
    activeUsers,
    users,
    newTransactionsCount = 0,
    transactionsCount = 0,
    canManage = false,
  } = budget;
  const classes = new BEMHelper('budget-list-item');
  const isClosed = [budgetStates.closed, budgetStates.closing].includes(state);

  let menuInstance = null;
  return (
    <li {...classes({ modifiers: { active: isActive } })}>
      <div {...classes({ element: 'badge', modifiers: { green: newTransactionsCount > 0, closed: isClosed } })}>
        <i {...classes({
          element: 'badge-text',
          extra: [
            isClosed ? 'mi mi-lock-outline' : '',
          ]
        })}>
          {!isClosed &&
            `${newTransactionsCount > 0 ? `+${newTransactionsCount}` : transactionsCount}`
          }
        </i>
      </div>
      <Link to={paths.budget(id)} {...classes('wrapper')} onClick={() => selectBudget(budget)}>
        <span {...classes('title')}>{title}</span>
        <span {...classes('sum')}>{numeral(sum).format('0,[.]00')} {currency.key}</span>
        <div {...classes('subtitle')}>
          <span {...classes('people')}>
            {`${activeUsers} ${activeUsers < users.length ? `из ${users.length}` : ''}`} {pluralize('участников', activeUsers)}
          </span>
          <span {...classes('date')}>{moment(date, 'x').format('DD.MM.YYYY')}</span>
        </div>
      </Link>
      {canManage
        ? <Dropdown
          {...classes('menu')}
          ref={(element) => {
            if (element && !menuInstance) {
              menuInstance = element;
            }
          }
        }
        >
          <DropdownTrigger>
            <span {...classes({ element: 'menu-trigger', extra: 'mi mi-settings' })} />
          </DropdownTrigger>
          <DropdownContent>
            <div {...classes('menu-item')} onClick={() => {
              state === budgetStates.closed
                ? openBudget(budget)
                : requestClosing(id);
              menuInstance.hide();
            }}>
              {`${state === budgetStates.closed ? 'Открыть' : 'Закрыть'}`}
            </div>
            {__DEV__ &&
              <div {...classes('menu-item')} onClick={() => deleteBudget(budget)}>
                Удалить
              </div>
            }
          </DropdownContent>
        </Dropdown>
        : null
      }
    </li>
  );
}

export default Info;
