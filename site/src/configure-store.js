import { applyMiddleware, compose, createStore } from 'redux';

import loggerMiddleware from './redux/middleware/logger';
import rootReducer from './redux/reducers/root-reducer';

const configureStore = (preloadedState) => {
  const middlewares = [loggerMiddleware];
  const middlewareEnhancer = applyMiddleware(...middlewares);

  const enhancers = [middlewareEnhancer];
  const composedEnhancers = compose(...enhancers);

  const store = createStore(rootReducer, preloadedState, composedEnhancers);

  return store;
}

export default configureStore;
