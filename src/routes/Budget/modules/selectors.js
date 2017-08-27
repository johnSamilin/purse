import { createSelector } from 'reselect';
import { get } from 'lodash';

const getRawBudget = (state) => get(state, 'budget.data', {});
const getRawTransactions = (state) => get(state, 'transactions.data', []) || [];
const getRawUsers = (state) => get(state, 'users.data', []) || [];

const budget = createSelector(getRawBudget, (budget) => budget)
const transactions = createSelector(getRawTransactions, transactions => transactions)
const users = createSelector(
	getRawBudget, getRawUsers,
	(budget, users) => {
		const budgetUsers = budget.users ? budget.users.map(user => user.id) : [];
		const statuses = {};
		if (budget.users) {
			budget.users.forEach(user => {
				statuses[user.id] = user.status;
			});
		}
		return users
			.filter(user => budgetUsers.includes(user.id))
			.map(user => ({
				...user,
				status: statuses[user.id],
			}));
	}
)

export default {
	budget,
	transactions,
	users,
}
