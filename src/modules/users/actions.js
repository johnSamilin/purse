// ------------------------------------
// Constants
// ------------------------------------
const USERS_UPDATED = 'USERS_UPDATED';

// ------------------------------------
// Actions
// ------------------------------------

function updated(users) {
	return {
		type: USERS_UPDATED,
		payload: users,
	};
}

export const actions = {
  updated,
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [USERS_UPDATED]: (state, action) => {
  	return { ...state, data: action.payload };
  },
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {};
export default function authReducer (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
