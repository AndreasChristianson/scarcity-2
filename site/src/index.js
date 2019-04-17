import React from "react";
import ReactDOM from "react-dom";
import { Provider } from 'react-redux'

import configureStore from './configure-store';
import App from './App';
import WebSocket from './components/utilities/WebSocket'
import getWssUrl from './services/wss/get-wss-url';

const store = configureStore();

ReactDOM.render(
    <Provider store={store}>
        <WebSocket url={getWssUrl()}/>
        <App />
    </Provider>,
    document.getElementById("root")
);
