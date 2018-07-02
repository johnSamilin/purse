// // ------------------------------------
// // Constants
// // ------------------------------------
// export const SET_ACTIVE_MODULE = 'SET_ACTIVE_MODULE'

// // ------------------------------------
// // Actions
// // ------------------------------------
// export function setActiveModule (currentModule, nextModules) {
//   return {
//     type    : SET_ACTIVE_MODULE,
//     payload : {
//     	active: currentModule,
//     	next: nextModules
//     },
//   }
// }

// export const actions = {
//   setActiveModule,
// }

// // ------------------------------------
// // Action Handlers
// // ------------------------------------
// const ACTION_HANDLERS = {
//   [SET_ACTIVE_MODULE]    : (state, action) => ({ ...state, ...action.payload }),
// }

// // ------------------------------------
// // Reducer
// // ------------------------------------
// const initialState = {
// 	active: 'budgets'
// }
// export default function modulesReducer (state = initialState, action) {
//   const handler = ACTION_HANDLERS[action.type]

//   return handler ? handler(state, action) : state
// }
