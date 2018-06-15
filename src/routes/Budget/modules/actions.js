import api from 'services/api';
import sortBy from 'lodash/sortBy';
import moment from 'moment';
import {
  apiPaths,
} from '../const';
// ------------------------------------
// Constants
// ------------------------------------
export const BUDGET_SELECTED = 'BUDGET_SELECTED';
export const BUDGET_UPDATED = 'BUDGET_UPDATED';
export const TRANSACTIONS_SELECTED = 'TRANSACTIONS_SELECTED';
export const TRANSACTIONS_UPDATED = 'TRANSACTIONS_UPDATED';
export const SEEN_TRANSACTIONS_CHANGED = 'SEEN_TRANSACTIONS_CHANGED';
export const BUDGET_REQUESTED = 'BUDGET_REQUESTED';
// ------------------------------------
// Actions
// ------------------------------------
function selectBudget(budget) {
  return {
    type: BUDGET_SELECTED,
    payload: budget,
  };
}
function updateBudget(budget) {
  return {
    type: BUDGET_UPDATED,
    payload: budget,
  };
}

function requestBudget(isLoading = false) {
  return {
    type: BUDGET_REQUESTED,
    payload: isLoading,
  };
}

function updateTransactions(transactions) {
  const ids = new Set();
  transactions.forEach(transaction => ids.add(transaction.ownerId));
  const transactionsSorted = sortBy(transactions, transaction => moment(transaction.date).format('x'));

  return {
    type: TRANSACTIONS_SELECTED,
    payload: transactionsSorted,
  };
}

function updateTransactionsGlobal(map) {
  return {
    type: TRANSACTIONS_UPDATED,
    payload: map,
  };
}

function updateSeenTransactions(map) {
  return {
    type: SEEN_TRANSACTIONS_CHANGED,
    payload: map,
  };
}

function clearBudget() {
  return selectBudget({});
}

function clearTransactions() {
  return updateTransactions([]);
}

function getBudgetFromServer(id, callback) {
  return (dispatch) => {
    dispatch(requestBudget(true));
    const request = api.doGet(apiPaths.budget(id), {}, callback);
    request.finally(() => dispatch(requestBudget(false)));
  };
}

function remoteRequestMembership(budgetId) {
  return (dispatch) => {
    dispatch(requestBudget(true));
    const request = api.doPost(apiPaths.membership(budgetId), {});
    request.finally(() => dispatch(requestBudget(false)));
  };
}

function loadTransactions(budgetId) {
  return dispatch => api.doGet(
    apiPaths.transactions(budgetId),
    {},
    res => dispatch(updateTransactions(res))
  );
}

export const actions = {
  budget: {
    select: selectBudget,
    update: updateBudget,
    clear: clearBudget,
    getBudgetFromServer,
    remoteRequestMembership,
  },
  transactions: {
    select: updateTransactions,
    load: loadTransactions,
    clear: clearTransactions,
    updated: updateTransactionsGlobal,
    seen: updateSeenTransactions,
  },
};

// ------------------------------------
// Action Handlers
// ------------------------------------
const BUDGET_ACTION_HANDLERS = {
  [BUDGET_SELECTED]: (state, action) => ({ ...state, data: action.payload }),
  [BUDGET_UPDATED]: (state, action) => ({ ...state, data: action.payload }),
  [BUDGET_REQUESTED]: (state, action) => ({ ...state, isLoading: action.payload }),
};
const TRANSACTIONS_ACTION_HANDLERS = {
  [TRANSACTIONS_SELECTED]: (state, action) => ({ ...state, data: action.payload }),
  [TRANSACTIONS_UPDATED]: (state, action) => ({ ...state, list: action.payload }),
  [SEEN_TRANSACTIONS_CHANGED]: (state, action) => ({ ...state, seen: action.payload }),
};
// ------------------------------------
// Reducer
// ------------------------------------
const binitialState = {};
function budgetReducer(state = binitialState, action) {
  const handler = BUDGET_ACTION_HANDLERS[action.type];

  return handler ? handler(state, action) : state;
}

const tinitialState = {};
function transactionsReducer(state = tinitialState, action) {
  const handler = TRANSACTIONS_ACTION_HANDLERS[action.type];

  return handler ? handler(state, action) : state;
}

export default {
  budgetReducer,
  transactionsReducer,
};
