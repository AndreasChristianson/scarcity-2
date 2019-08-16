import { combineReducers } from 'redux';
import merge from 'merge-deep';

import { SCARCITY_UPDATE } from '../action-types';

const applyStateUpdate = (map, { action, id }, data) => {
  switch (action) {
    case 'replace':
      return new Map(
        Object.keys(data).map(
          key => [key, data[key]]
        )
      );
    case 'upsert':
      return map.set(id, data);
    case 'remove':
      map.delete(id);
      return map;
  }
};

const createScarcityReducer = (table) => (state = new Map(), { type, criteria, ...data }) => {
  if (type === `${SCARCITY_UPDATE}-${table}`) {
    return applyStateUpdate(state, criteria, data);
  } else {
    return state;
  }
};

const reducers = [
  'floor',
  'floorObjects',
  'character',
  'chat',
  'actions'
].reduce((prev, curr) => ({
  ...prev,
  [curr]: createScarcityReducer(curr)
}), {});

export default combineReducers(reducers);
