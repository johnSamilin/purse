import api from 'services/api';
// ------------------------------------
// Constants
// ------------------------------------
export const BUDGET_CREATED = 'BUDGET_CREATED'

// ------------------------------------
// Actions
// ------------------------------------
function create(budget) {
  return {
    type: BUDGET_CREATED,
    payload: budget,
  };
}

export const actions = {
  create,
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [BUDGET_CREATED]: (state, action) => ({ ...state, data: action.payload }),
}
// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {}
function reducer (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}

export default {
	reducer,
}
