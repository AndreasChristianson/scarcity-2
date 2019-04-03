import React from "react";
import {getWssUrl} from './services/wss/url-fetch-helper';

const App = async () =>
    <div className="App">
        <h1> 
            {'Hello, World!'} 
        </h1>
        <p>
            {`Build: ${__COMMIT_HASH__}`}
        </p>
        <p>
            {`Wss: ${await getWssUrl()}`}
        </p>
    </div>
;

export default App;