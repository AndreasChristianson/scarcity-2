import messages from './message-reducer'
import { combineReducers } from 'redux'

const rootReducer = combineReducers({
  messages
});

export default rootReducer
