import { LOG } from '../action-types';

const logReducer = (state = [], { type, details, message }) => {
  switch (type) {
    case LOG:
      console.log(message, details);

      const timeStamp = Date.now();

      return [
        ...state,
        {
          details,
          message,
          timeStamp
        }
      ]
    default:
      return state;
  }
}

export default logReducer;
