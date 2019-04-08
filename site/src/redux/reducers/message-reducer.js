import { MESSAGE_RECIEVED } from '../action-types';

const messageReducer = (state = [], { type, message }) => {
  switch (type) {
    case MESSAGE_RECIEVED:
      return [
        ...state,
        message
      ]
    default:
      return state
  }
}

export default messageReducer;
