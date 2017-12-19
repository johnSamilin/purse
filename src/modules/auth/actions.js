import Api from 'services/api';
import { apiPaths } from 'routes/Login/const';
import module from './index';

// ------------------------------------
// Constants
// ------------------------------------
const AUTH_LOGGED_IN = 'AUTH_LOGGED_IN';
const AUTH_LOGGED_OUT = 'AUTH_LOGGED_OUT';
const AUTH_USER_DISPATCHED = 'AUTH_USER_DISPATCHED';

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

function dispatch(userInfo) {
	return {
		type: AUTH_USER_DISPATCHED,
		payload: {
			userInfo,
		},
	};
}

function login(token) {
	module.setToken(token);
	return doLogin();
}

function logout() {
	module.setToken('');
	return doLogout();
}

function getToken({ code, csrf }) {
	return dispatch => Api.doPost(
		apiPaths.getToken(),
		{ code, csrf }
	);
}

export const actions = {
  login,
  logout,
  getToken,
  dispatch,
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [AUTH_LOGGED_IN]: (state, action) => {
  	return { ...state, data: { ...state.data, ...action.payload } };
  },
  [AUTH_LOGGED_OUT]: (state, action) => {
  	return { ...state, data: { ...state.data, ...action.payload } };
  },
  [AUTH_USER_DISPATCHED]: (state, action) => {
	  return { ...state, data: { ...state.data, ...action.payload } };
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
