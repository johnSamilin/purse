import React from 'react';
import BEMHelper from 'react-bem-helper';
import numeral from 'numeral';
import './style.scss';

function Transaction(props) {
	const {
		id,
        amount,
        date,
        note,
        cancelled,
        author,
        currency,
        onClick,
	} = props;
	const classes = new BEMHelper('budget-transaction');

	return (
		<div {...classes({ modifiers: { cancelled } })} onClick={() => onClick(id)}>
			<div {...classes('mandatory-info')}>
				<div {...classes('info')}>
					<span {...classes('author')}>{author.name} </span>
					<span {...classes('author-contacts')}>{author.phone ? author.phone : author.email}</span>
				</div>
				<div {...classes('amount')}>
					<span>{numeral(amount).format('0,[.]00').replace(',', ' ')} {currency}</span>
				</div>
			</div>
			<div {...classes({ element: 'note', modifiers: { hidden: !note } })}>
				<span>{note}</span>
			</div>
		</div>
	);
}

export default Transaction;
