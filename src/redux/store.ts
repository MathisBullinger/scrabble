import { createStore, combineReducers, applyMiddleware, compose } from 'redux'
import createSaga from 'redux-saga'
import reducers from './reducers'
import saga from './sagas'

const sagaMiddleware = createSaga()

export const store = createStore(
  combineReducers(reducers),
  compose(
    applyMiddleware(sagaMiddleware),
    (window as any).__REDUX_DEVTOOLS_EXTENSION__ &&
      (window as any).__REDUX_DEVTOOLS_EXTENSION__()
  )
)

sagaMiddleware.run(saga)
