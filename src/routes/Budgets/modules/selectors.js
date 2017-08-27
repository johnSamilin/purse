import { createSelector } from 'reselect'
import { get } from 'lodash'

const getRawList = state => get(state, 'budgets.data.budgets', []) || [];
const getActive = state => get(state, 'budget.data.id', '-1');
const getUserId = state => get(state, 'auth.data.id', '-1');

const list = createSelector(
	[getRawList, getUserId],
	(list, userId) => list.map(budget => ({
		...budget,
		canManage: budget.ownerId === userId,
	}))
);
const active = createSelector(getActive, id => id);

export default {
	active,
	list,
}
