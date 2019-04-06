import React from "react";

const App = async (props) =>
    <div className="App">
        <h1> 
            {'Hello, World!'} 
        </h1>
        <p>
            {`Build: ${__COMMIT_HASH__}`}
        </p>
    </div>
;

export default App;