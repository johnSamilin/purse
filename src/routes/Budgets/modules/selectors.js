import { createSelector } from 'reselect';
import { get, findLast } from 'lodash';
import authModule from 'modules/auth';

const getRawList = state => get(state, 'budgets.data.budgets', []) || [];
const getActive = state => get(state, 'budget.data.id', '-1');
const getUserId = state => get(state, 'auth.data.id', '-1');
const getTransactionsMap = state => get(state, 'transactions.list', {});
const getSeenTransactionsMap = state => get(state, 'transactions.seen', {});
const getUsersList = state => get(state, 'users.data', []) || [];
const getUserToken = authModule.getToken;

const list = createSelector(
	[getRawList, getUserId, getTransactionsMap, getSeenTransactionsMap],
	(list, userId, transactionsMap, seenTransactions) => list.map(budget => {
		const transactionsCount = transactionsMap[budget.id] || 0;
		const seenTransactionsCount = get(seenTransactions, `${budget.id}`, 0);

		return {
			...budget,
			canManage: budget.ownerId === userId,
			transactionsCount,
			newTransactionsCount: transactionsCount - seenTransactionsCount,
		};
	})
);
const active = createSelector(getActive, id => id);
const userInfo = createSelector(
	[ getUsersList, getUserToken ],
	(users, token) => findLast(users, ['token', token]) || {});

export default {
	active,
	list,
	userInfo,
}
