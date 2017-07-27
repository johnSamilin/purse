import React from 'react';
import BEMHelper from 'react-bem-helper';
import { userStatuses } from 'routes/Budget/const';
import './style.scss';

function AddForm(props) {
	const {
		isExpanded,
		toggle,
		currency = '$',
		add,
	} = props;
	const classes = new BEMHelper('budget-add-form');
	let refAmount;
	
	return (
		<div {...classes()}>
			<input {...classes('input')} placeholder={`100 ${currency}`} ref={el => refAmount = el} />
			<i {...classes({ element: 'check-btn', extra: 'mi mi-check' })} onClick={() => {
				add(refAmount.value, '');
				refAmount.value = '';
			}}></i>
		</div>
	);
}

export default AddForm;
