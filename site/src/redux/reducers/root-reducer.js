import log from './log-reducer';
import scarcity from './scarcity-reducer';
import { combineReducers } from 'redux';

const rootReducer = combineReducers({
  log,
  scarcity
});

export default rootReducer;
