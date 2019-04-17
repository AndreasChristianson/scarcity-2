import { SCARCITY_UPDATE } from '../action-types';

const messageReducer = (state = {}, { type, criteria, fields }) => {
  switch (type) {
    case SCARCITY_UPDATE:
      return applyStateUpdate(state, criteria, fields)
    default:
      return state
  }
}

export default messageReducer;
