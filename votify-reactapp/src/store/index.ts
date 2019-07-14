import { combineReducers, createStore, applyMiddleware, Store, compose, StoreEnhancer } from 'redux'
import createSagaMiddleware from 'redux-saga'
import { all } from 'redux-saga/effects'

import authReducer from './auth/reducers'
import roomReducer from './room/reducers'
import hubReducer from './hub/reducers'
import playerReducer from './player/reducers';

import hubSaga from './hub/sagas'
import authSaga from './auth/sagas'
import roomSaga from './room/sagas'
import playerSaga from './player/sagas'

const rootReducer = combineReducers({
  auth: authReducer,
  hub: hubReducer,
  room: roomReducer,
  player: playerReducer,
})

export type AppState = ReturnType<typeof rootReducer>

function* rootSaga() {
  yield all([
    hubSaga(),
    authSaga(),
    roomSaga(),
    playerSaga(),
  ])
}

export default function configureStore(preloadedState?: AppState): Store {
  const sagaMiddleware = createSagaMiddleware()
  const middlewares = [sagaMiddleware]
  const middlewareEnhancer = applyMiddleware(...middlewares)

  const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  const enhancers = [middlewareEnhancer]
  const composedEnhancers = composeEnhancers(...enhancers) as StoreEnhancer

  const store = createStore(rootReducer, preloadedState, composedEnhancers)

  sagaMiddleware.run(rootSaga)

  return store
}
