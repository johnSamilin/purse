/* eslint-disable */
export default {
  budgets: {    
    1: function(budget) {
      return budget;
    },
    2: function(budget) {
      budget.isSynced = false;
      return budget;
    },
    3: function(budget) {
      budget.users = budget.users.map(user => ({
        ...user,
        decision: 'pending',
      }));
      return budget;
    },
    4: function(budget) {
      budget.date = (new Date()).toString();
      return budget;
    },
  },
  transactions: {
    1: function(transaction) {
      transaction.isSynced = false;
      return transaction;
    },
    2: function(transaction) {
      transaction.collaborators = [];
      transaction.isPaidByOwner = false;
      return transaction;
    },
  },
  seenTransactions: {},
  users: {
    1: function (user) {
      user.token = '';
      return user;
    },
    2: function(user) {
      user.isSynced = false;
      return user;
    },
  },
};
