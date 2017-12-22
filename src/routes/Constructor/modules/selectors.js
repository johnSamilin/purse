/*import { createSelector } from 'reselect';
import get from 'lodash/get';

const getRawBudget = (state) => get(state, 'budget.data', {})
const getRawTransactions = (state) => get(state, 'transactions.data', []) || []

const budget = createSelector(getRawBudget, (budget) => budget)
const transactions = createSelector(getRawTransactions, transactions => transactions)

export default {
	budget,
	transactions,
}
*/