import module from './index';

// ------------------------------------
// Constants
// ------------------------------------
const AUTH_LOGGED_IN = 'AUTH_LOGGED_IN';
const AUTH_LOGGED_OUT = 'AUTH_LOGGED_OUT';

// ------------------------------------
// Actions
// ------------------------------------
function doLogin(userInfo) {
	return {
		type: AUTH_LOGGED_IN,
		payload: {
			loggedIn: true,
		}
	}
}

function doLogout() {
	return {
		type: AUTH_LOGGED_OUT,
		payload: {
			loggedIn: false,
		},
	};
}

function login(token) {
	module.setToken(token);
	return doLogin();
}

function logout() {
	return doLogout();
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
