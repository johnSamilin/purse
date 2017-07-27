import api from 'services/api';
import { sortBy } from 'lodash';
import moment from 'moment';
import {
  apiPaths,
} from '../const';
// ------------------------------------
// Constants
// ------------------------------------
export const BUDGET_SELECTED = 'BUDGET_SELECTED'
export const BUDGET_UPDATED = 'BUDGET_UPDATED'
export const TRANSACTIONS_SELECTED = 'TRANSACTIONS_SELECTED'

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

function updateTransactions(transactions) {
  const ids = new Set();
  transactions.forEach(transaction => ids.add(transaction.ownerId));
  const transactionsSorted = sortBy(transactions, transaction => moment(transaction.date).format('x'));

	return {
		type: TRANSACTIONS_SELECTED,
		payload: transactionsSorted,
	};
}

function clearBudget() {
  return selectBudget({});
}

function clearTransactions() {
  return updateTransactions([]);
}

function loadBudget(id) {
  return dispatch => api.doGet(
    apiPaths.budget(id),
    {},
    res => dispatch(updateBudget(res))
  );
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
    load: loadBudget,
    clear: clearBudget,
  },
  transactions: {
  	select: updateTransactions,
    load: loadTransactions,
    clear: clearTransactions,
  },
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const BUDGET_ACTION_HANDLERS = {
  [BUDGET_SELECTED]: (state, action) => ({ ...state, data: action.payload }),
  [BUDGET_UPDATED]: (state, action) => ({ ...state, data: action.payload }),
}
const TRANSACTIONS_ACTION_HANDLERS = {
  [TRANSACTIONS_SELECTED]: (state, action) => ({ ...state, data: action.payload }),
}
// ------------------------------------
// Reducer
// ------------------------------------
const binitialState = {}
function budgetReducer (state = binitialState, action) {
  const handler = BUDGET_ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}

const tinitialState = {}
function transactionsReducer(state = tinitialState, action) {
  const handler = TRANSACTIONS_ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}

export default {
	budgetReducer,
	transactionsReducer,
}
