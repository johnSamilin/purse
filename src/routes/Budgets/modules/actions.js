import api from 'services/api';
import {
	apiPaths,
} from '../const';

// ------------------------------------
// Constants
// ------------------------------------
const BUDGETS_UPDATED = 'BUDGETS_UPDATED'
const BUDGETS_CREATE = 'BUDGETS_CREATE'

// ------------------------------------
// Actions
// ------------------------------------
function updated(budgets) {
	return {
		type: BUDGETS_UPDATED,
		payload: {
			budgets
		}
	}
}

function create() {
	return {
		type: BUDGETS_CREATE,
		payload: {}
	}
}

function load() {
	return dispatch => api.doGet(
		apiPaths.budgets(),
		{},
		res => {
			dispatch(updated(res));
		}
	);
}

export const actions = {
  updated,
  create,
  load,
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [BUDGETS_UPDATED]: (state, action) => {
  	return { ...state, data: action.payload, isLoading: false };
  },
  [BUDGETS_CREATE]: (state, action) => {
  	return { ...state, isLoading: true };
  },
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {};
export default function counterReducer (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
