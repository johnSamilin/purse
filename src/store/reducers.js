import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import locationReducer from './location'
import modulesReducer from './modules'

export const makeRootReducer = (asyncReducers) => {
  return combineReducers({
    location: locationReducer,
    ...asyncReducers,
    routing: routerReducer,
    modules: modulesReducer,
  })
}

export const injectReducer = (store, { key, reducer }) => {
  if (Object.hasOwnProperty.call(store.asyncReducers, key)) return

  store.asyncReducers[key] = reducer
  store.replaceReducer(makeRootReducer(store.asyncReducers))
}

export default makeRootReducer
