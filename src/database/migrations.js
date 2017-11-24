export default {
    budgets: {},
    transactions: {},
    seenTransactions: {},
    users: {
        1: function (user) {
            user.token = '';
            return user;
        },
    },
};