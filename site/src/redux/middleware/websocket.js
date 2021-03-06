import getWssUrl from '../../services/wss/get-wss-url';
import { LOG, SCARCITY_UPDATE, WS_CLOSED, WS_READY } from '../action-types';

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
      const { criteria: {table, ...criteria}, ...fields } = JSON.parse(data);

      store.dispatch({
        ...fields,
        type: `${SCARCITY_UPDATE}-${table}`,
        criteria
      });
    } catch (error) {
      log('Failed websocket message', { error, data });
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