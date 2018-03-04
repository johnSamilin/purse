import React from 'react';
import BEMHelper from 'react-bem-helper';
import moment from 'moment';
import Transaction from './Transaction';
import { EmptyState } from 'components';
import './style.scss';

function Divider({ text }) {
	const classes = new BEMHelper('budget-transactions-divider');
	return <div {...classes()}>
		<span {...classes('text')}>{text}</span>
	</div>
}

function Transactions(props) {
	const {
		data = [],
		isLoading,
		users = [],
		currency,
		onTransactionClick,
	} = props;
	const classes = new BEMHelper('budget-transactions');
	const defaultUser = {
		id: '-1',
		name: 'Someone',
	};
	let dateBlock;

	return (
		<div {...classes()}>
				{isLoading &&
					<img {...classes('loader')} src='/200w_d.gif' />
				}
				{!isLoading && (data.length
					? <ul>
						{data.map((transaction, i) => {
							const nextDateBlock = moment(transaction.date, 'x').calendar(null, {
						    sameDay: 'dddd',
						    nextDay: 'dddd',
						    nextWeek: 'dddd',
						    lastDay: 'dddd',
						    lastWeek: 'dddd',
						    sameElse: 'MMMM Do YYYY'
							});
							if (dateBlock !== nextDateBlock) {
								dateBlock = nextDateBlock;
								return [
								<Divider key={`d${i}`} text={nextDateBlock} />,
								<Transaction
									key={i} 
									{...transaction}
									author={users[transaction.ownerId] || defaultUser}
									currency={currency}
									onClick={onTransactionClick}						
								/>];
							}							
							return <Transaction
								key={i} 
								{...transaction}
								author={users[transaction.ownerId] || defaultUser}
								currency={currency}
								onClick={onTransactionClick}						
							/>
						}
						)}
					</ul>
					: <EmptyState message={'Еще ни одной транзакции'} />
				)}
		</div>
	);
}

export default Transactions;
