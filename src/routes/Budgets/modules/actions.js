import api from 'services/api';
import {
	apiPaths,
} from '../const';

// ------------------------------------
// Constants
// ------------------------------------
const BUDGETS_REQUESTED = 'BUDGETS_REQUESTED'
const BUDGETS_UPDATED = 'BUDGETS_UPDATED'
const BUDGETS_CREATE = 'BUDGETS_CREATE'

// ------------------------------------
// Actions
// ------------------------------------
function request() {
	return {
		type: BUDGETS_REQUESTED,
		payload: null,
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
		type: BUDGETS_CREATE,
		payload: {},
	};
}

export const actions = {
  updated,
  create,
  request,
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
	[BUDGETS_REQUESTED]: (state, action) => {
		return { ...state, isLoading: true };
	},
	[BUDGETS_UPDATED]: (state, action) => {
		return { ...state, data: action.payload, isLoading: false };
	},
	[BUDGETS_CREATE]: (state, action) => {
		return { ...state, isLoading: true };
	},
};

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {};
export default function counterReducer (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
