import React from 'react';
import BEMHelper from 'react-bem-helper';
import { userStatuses } from 'routes/Budget/const';
import { Field } from 'redux-form';
import {
	Button,
} from 'components';
import './style.scss';

function Input({ input, className, placeholder, type = 'text' }) {
	return <input
		className={className}
		value={input.value}
		onChange={input.onChange}
		placeholder={placeholder}
		type={type}
	/>;
}

function AddForm(props) {
	const {
		isExpanded,
		currency = '$',
		handleSubmit,
		onSubmit,
	} = props;
	const classes = new BEMHelper('budget-add-form');
	let refAmount;
	
	return (
		<form
			{...classes()}
			{...props}
			onSubmit={handleSubmit(onSubmit)}
		>
			<div {...classes('amount')}>
				<Field
					component={Input}
					{...classes('input')}
					name={'amount'}
					placeholder={`100 ${currency}`}
					type={'number'}
				/>
				<Button
					type='submit'
					{...classes('check-btn')}
				>
					<i {...classes({
						element: 'check-btn-ico',
						extra: 'mi mi-check'
					})}></i>
				</Button>
			</div>
			<Field
				component={Input}
				{...classes({
					element: 'input',
					modifiers: { hidden: !isExpanded }
				})}
				name={'note'}
				placeholder={'Optional note'}
			/>
		</form>
	);
}

export default AddForm;
