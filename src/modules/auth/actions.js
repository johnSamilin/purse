// ------------------------------------
// Constants
// ------------------------------------
const AUTH_LOGGED_IN = 'AUTH_LOGGED_IN'
const AUTH_LOGGED_OUT = 'AUTH_LOGGED_OUT'

// ------------------------------------
// Actions
// ------------------------------------
function login(userInfo) {
	return {
		type: AUTH_LOGGED_IN,
		payload: {
			loggedIn: true,
			userInfo,
		}
	}
}

function logout() {
	return {
		type: AUTH_LOGGED_OUT,
		payload: {
			loggedIn: false,
		},
	};
}

export const actions = {
  login,
  logout,
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [AUTH_LOGGED_IN]: (state, action) => {
  	return { ...state, data: action.payload };
  },
  [AUTH_LOGGED_OUT]: (state, action) => {
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
