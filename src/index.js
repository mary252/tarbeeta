import React from "react";
import ReactDOM from "react-dom";

import * as serviceWorker from "./serviceWorker";

import App from "./App";

ReactDOM.render(<App />, document.getElementById("root"));
// ReactDOM.render(routing, document.getElementById("root"));
// const rootElement = document.getElementById("root");

// if (rootElement.hasChildNodes()) {
//   ReactDOM.hydrate(routing, rootElement);
// } else {
//   ReactDOM.render(routing, rootElement);
// }
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();
