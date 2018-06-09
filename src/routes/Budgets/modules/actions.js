import api from 'services/api';
import { budgetStates } from 'const';
import {
  apiPaths,
} from '../const';

// ------------------------------------
// Constants
// ------------------------------------
const BUDGETS_REQUESTED = 'BUDGETS_REQUESTED';
const REQUEST_FULFILLED = 'REQUEST_FULFILLED';
const BUDGETS_UPDATED = 'BUDGETS_UPDATED';
const BUDGETS_CREATING = 'BUDGETS_CREATING';

// ------------------------------------
// Actions
// ------------------------------------
function requestStarted() {
  return {
    type: BUDGETS_REQUESTED,
    payload: null,
  };
}

function requestFulfilled() {
  return {
    type: REQUEST_FULFILLED,
  };
}

function updated(budgets) {
  return {
    type: BUDGETS_UPDATED,
    payload: {
      budgets,
    },
  };
}

function create() {
  return {
    type: BUDGETS_CREATING,
    payload: {},
  };
}

function requestClosing(id) {
  return api.doPost(
    apiPaths.budget(id),
    {
      status: budgetStates.closing,
    }
  );
}

export const budgetsActions = {
  updated,
  create,
  requestStarted,
  requestFulfilled,
  
  requestClosing,
};

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [BUDGETS_REQUESTED]: state => ({ ...state, isLoading: true }),
  [REQUEST_FULFILLED]: state => ({ ...state, isLoading: false }),
  [BUDGETS_UPDATED]: (state, action) => ({ ...state, data: action.payload, isLoading: false }),
  [BUDGETS_CREATING]: state => ({ ...state, isLoading: true }),
};

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {};
export default function budgetsReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type];

  return handler ? handler(state, action) : state;
}
