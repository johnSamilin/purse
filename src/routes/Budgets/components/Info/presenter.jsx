import React from 'react';
import { Link } from 'react-router';
import BEMHelper from 'react-bem-helper';
import moment from 'moment';
import numeral from 'numeral';
import { budgetStates } from 'const';
import Dropdown, { DropdownTrigger, DropdownContent } from 'react-simple-dropdown';
import pluralize from 'pluralize';
import { paths } from '../../const';

require('./style.scss');

function Info(props) {
	const {
		id,
		date,
		title,
		isActive,
		state,
    sum = 0,
    currency,
    activeUsers,
    users,
		newTransactionsCount = 0,
		transactionsCount = 0,

		requestClosing,
		openBudget,
		canManage = false,
    deleteBudget,
	} = props;
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
						`${newTransactionsCount > 0 ? '+'+newTransactionsCount : transactionsCount}`
					}
				</i>
			</div>
			<Link to={paths.budget(id)} {...classes('wrapper')}>
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
				? <Dropdown {...classes('menu')} ref={(element) => {
						if (element && !menuInstance) {
							menuInstance = element;
						}
					}}
					>
					<DropdownTrigger>
						<span {...classes('menu-trigger')}>...</span>
					</DropdownTrigger>
					<DropdownContent>
						<div {...classes('menu-item')} onClick={() => {
							state === budgetStates.closed
								? openBudget(id)
								: requestClosing(id);
							menuInstance.hide();
						}}>
              {`${state === budgetStates.closed ? 'Открыть' : 'Закрыть'}`}
            </div>
            {__DEV__ &&
              <div {...classes('menu-item')} onClick={() => deleteBudget(id)}>
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
