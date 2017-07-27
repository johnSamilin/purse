import { createSelector } from 'reselect'
import { get } from 'lodash'

const getRawList = (state) => get(state, 'budgets.data.budgets', [])
const getActive = (state) => get(state, 'budget.data.id', -1)

const list = createSelector(getRawList, list => list)
const active = createSelector(getActive, id => id)

export default {
	active,
	list,
}
