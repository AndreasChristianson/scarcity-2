import getWssUrl from '../../services/wss/get-wss-url';
import { LOG, SCARCITY_UPDATE, WS_CLOSED, WS_READY } from '../action-types';

const assert = (value, validValues) =>{
  if(!value){
    throw new Error(`Empty value: ${value}`);
  }
  if(validValues && !validValues.includes(value)){
    throw new Error(`Illegal value: ${value} (legal values are ${validValues})`);
  }
}

const websocketMiddleware = store => {
  const websocket = new WebSocket(getWssUrl());

  const log = (message, details) => {
    store.dispatch({
      type: LOG,
      message,
      details
    });
  };

  websocket.onmessage = async ({ data }) => {
    try {
      const { criteria, ...fields } = JSON.parse(data)
      const { table, id, action } = criteria;

      assert(table, [
        'floor',
        'character',
        'chat',
        'actions'
      ]);      
      assert(id);
      assert(action, [
        'add',
        'remove',
        'update',
        'replace'
      ]);

      store.dispatch({
        ...fields,
        type: `${SCARCITY_UPDATE}-${criteria.table}`,
        criteria
      });
    } catch (error) {
      log('Invalid websocket message', { error, data });
    }
  };

  websocket.onclose = (closeEvent) => store.dispatch({
    type: WS_CLOSED,
    ...closeEvent
  });

  websocket.onerror = (event) =>
    log('Unexpected websocket event.', event);

  websocket.onopen = (event) => store.dispatch({
    type: WS_READY,
    ...event
  });

  return next => action => {
    const { meta: { scarcity } = {}, ...payload } = action;
    if (scarcity) {
      websocket.send(JSON.stringify(payload));
    }

    return next(action)
  }
}

export default websocketMiddleware