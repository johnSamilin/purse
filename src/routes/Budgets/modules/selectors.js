import { createSelector } from 'reselect';
import get from 'lodash/get';

const getRawList = state => get(state, 'budgets.data.budgets', []) || [];
const getActive = state => get(state, 'budget.data.id', '-1');
const getUserId = state => get(state, 'auth.data.userInfo.id', '-1');
const getUserInfo = state => get(state, 'auth.data.userInfo', {});
const getTransactionsMap = state => get(state, 'transactions.list', {});
const getSeenTransactionsMap = state => get(state, 'transactions.seen', {});

const list = createSelector(
  [getRawList, getUserId, getTransactionsMap, getSeenTransactionsMap],
  (budgetList, userId, transactionsMap, seenTransactions) => budgetList.map((budget) => {
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
const availableBudgets = createSelector(
  getRawList,
  availableBudgetsList => availableBudgetsList.map(budget => budget.id)
);

export default {
  active,
  list,
  userInfo: getUserInfo,
  availableBudgets,
};
