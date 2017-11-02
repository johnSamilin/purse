import React from 'react';
import BEMHelper from 'react-bem-helper';
import { Link } from 'react-router';
import { paths } from 'routes/Budgets/const';
import LoadingPanel from 'components/LoadingPanel';

import Info from './Info';
import './style.scss';

export const Budgets = (props) => {
  const classes = new BEMHelper('budget-list');
  let pageClasses = new BEMHelper('page');
  pageClasses = pageClasses({ modifiers: { next: props.isNext, active: props.isActive } }).className;
	const {
		list,
		activeId,
		load,
		closeBudget,
		openBudget,
		userInfo,
		isLoading,
		exit,
	} = props;
	return (
	  <div
			{...classes({ extra: pageClasses })}
	  >
			<div {...classes('username')}>
				<span
					{...classes({
						element: 'exit',
						extra: 'mi mi-power-settings-new',
					})}
					onClick={exit}
				></span>
				<span {...classes('name')}>{userInfo.name}</span>
			</div>
			<ul {...classes('list')}>
				{list && list.map((budget, i) =>
					<Info
						key={i}
						{...budget}
						isActive={activeId === budget.id}
						closeBudget={closeBudget}
						openBudget={openBudget}
					/>
				)}
			</ul>
			<Link to={paths.construct()} {...classes('fab')}>+</Link>
			<LoadingPanel isActive={isLoading} />
	  </div>
	)
}

Budgets.propTypes = {
  
}

export default Budgets
