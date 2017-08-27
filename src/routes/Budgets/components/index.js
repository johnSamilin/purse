import React from 'react';
import BEMHelper from 'react-bem-helper';
import { Link } from 'react-router';
import { paths } from 'routes/Budgets/const';

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
		selectUser,
	} = props;
	return (
	  <div
			{...classes({ extra: pageClasses })}
	  >
			<div {...classes('username')}>
				<select onChange={e => selectUser(e.target.value)} value={userInfo.id}>
					<option value={0}>Me</option>
					<option value={1}>Not me</option>
					<option value={2}>Who</option>
				</select>
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
	  </div>
	)
}

Budgets.propTypes = {
  
}

export default Budgets
