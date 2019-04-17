import getWssUrl from '../../services/wss/get-wss-url';
import { LOG, SCARCITY_UPDATE, WS_CLOSED, WS_READY } from '../action-types';

const websocketMiddleware = store => {
  const websocket = new WebSocket(getWssUrl());

  websocket.onmessage = ({ data }) => {
    const payload = JSON.parse(data)

    if (payload.criteria) {
      store.dispatch({
        type: SCARCITY_UPDATE,
        ...payload
      })
    } else {
      store.dispatch({
        type: LOG,
        message: 'Unexpected message shape.',
        details: payload
      })
    }
  };

  websocket.onclose = (closeEvent) => store.dispatch({
    type: WS_CLOSED,
    ...closeEvent
  });

  websocket.onerror = (event) => store.dispatch({
    type: LOG,
    message: 'Unexpected websocket event.',
    details: event
  });

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