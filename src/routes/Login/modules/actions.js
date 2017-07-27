// ------------------------------------
// Constants
// ------------------------------------
export const LOGIN_CHANGE_EMAIL = 'LOGIN_CHANGE_EMAIL';

// ------------------------------------
// Actions
// ------------------------------------
export function changeEmail (value) {
  return {
    type    : LOGIN_CHANGE_EMAIL,
    payload : value
  }
}

export const actions = {
  changeEmail,
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [LOGIN_CHANGE_EMAIL]: (state, action) => ({ ...state, data: action.payload }),
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  data: {
    email: '',
  },
};
export default function loginReducer (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
