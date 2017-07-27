import React from 'react';
import BEMHelper from 'react-bem-helper';
import Info from './Info';
import './style.scss';

export const Budgets = (props) => {
	const classes = new BEMHelper('budget-list');
  let pageClasses = new BEMHelper('page');
  pageClasses = pageClasses({ modifiers: { next: props.isNext, active: props.isActive } }).className;
	const { list, activeId, load } = props;
	return (
	  <div
			{...classes({ extra: pageClasses })}
	  >
		<ul {...classes('list')}>
			{list && list.map((budget, i) =>
				<Info key={i} {...budget} isActive={activeId === budget.id} />
			)}
		</ul>
		<button onClick={props.add} {...classes('fab')}>+</button>
	  </div>
	)
}

Budgets.propTypes = {
  
}

export default Budgets
