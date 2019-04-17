import { applyMiddleware, compose, createStore } from 'redux';

import loggerMiddleware from './redux/middleware/logger';
import websocketMiddleware from './redux/middleware/websocket';
import rootReducer from './redux/reducers/root-reducer';

const configureStore = (preloadedState) => {
  const middlewares = [
    loggerMiddleware,
    websocketMiddleware
  ];
  const middlewareEnhancer = applyMiddleware(...middlewares);

  const enhancers = [middlewareEnhancer];
  const composedEnhancers = compose(...enhancers);

  const store = createStore(rootReducer, preloadedState, composedEnhancers);

  return store;
}

export default configureStore;
