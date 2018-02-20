import { createSelector } from 'reselect';
import get from 'lodash/get';
import { decisions, userStatuses } from '../const';

const getRawBudget = state => get(state, 'budget.data', {});
const getRawTransactions = state => get(state, 'transactions.data', []) || [];
const getGlobalUsers = state => get(state, 'users.data', []) || [];

const budget = createSelector(getRawBudget, budget => budget);
const transactions = createSelector(getRawTransactions, transactions => transactions);
const users = createSelector(
  getRawBudget, getGlobalUsers,
  (rawBudget, globalUsers) => {
    const rawList = rawBudget.users ? rawBudget.users.filter(user => user.status === userStatuses.active) : [];
    const budgetUserIds = rawList ? rawList.map(user => user.id) : [];

    const usersMap = {};
    if (rawList) {
      rawList
        .filter(user => user.status === userStatuses.active)
        .forEach((user) => {
          usersMap[user.id] = user;
        });
    }
    globalUsers
      .filter(user => budgetUserIds.includes(user.id))
      .forEach((user) => {
        const isOwner = rawBudget.ownerId === user.id;
        usersMap[user.id] = {
          ...usersMap[user.id],
          ...user,
          isOwner,
        };
      });

    return usersMap;
  }
);

export default {
  budget,
  transactions,
  users,
};
