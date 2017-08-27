import React from 'react';
import { Link } from 'react-router';
import BEMHelper from 'react-bem-helper';
import moment from 'moment';
import Dropdown, { DropdownTrigger, DropdownContent } from 'react-simple-dropdown';
import { paths } from '../../const';

require('./style.scss');

function Info(props) {
	const {
		id,
		date,
		title,
		isActive,
		state,
		closeBudget,
		openBudget,
		newTransactionsCount = 0,
		canManage = false,
	} = props;
	const classes = new BEMHelper('budget-list-item');
	const isClosed = state === 'closed';

	let menuInstance = null;
	return (
		<li {...classes({ modifiers: { active: isActive } })}>
			<div {...classes({ element: 'badge', modifiers: { green: newTransactionsCount > 0, closed: isClosed } })}>
				<i {...classes({
					element: 'badge-text',
					extra: isClosed ? 'mi mi-lock-outline' : '',
				})}>
					{!isClosed &&
						`${newTransactionsCount > 0 ? '+' : ''}${newTransactionsCount}`
					}
				</i>
			</div>
			<Link to={paths.budget(id)} {...classes('wrapper')}>
				<span {...classes('date')}>{moment(date).format('DD.MM.Y')}</span>
				<span {...classes('title')}>{title}</span>
			</Link>
			{state === 'opened' && canManage
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
									closeBudget(id);
									menuInstance.hide();
								}}>Закрыть</div>
							}
							{state === 'closed' &&
								<div {...classes('menu-item')} onClick={() => {
									openBudget(id);
									menuInstance.hide();
								}}>Открыть</div>
							}
						</DropdownContent>
					</Dropdown>
				: null
			}
		</li>
	);
}

export default Info;
