import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";
import App from "./Components/App/App";
import * as serviceWorker from './serviceWorker';
import { AuthenticationProvider } from "./Contexts/AuthenticationContext/AuthenticationContext";
import ScrollRestoration from "./Components/ScrollRestoration/ScrollRestoration";
import "./index.css";

ReactDOM.render(
  <AuthenticationProvider>
    <Router>
      <ScrollRestoration>
        <App/>
      </ScrollRestoration>
    </Router>
  </AuthenticationProvider>,
  document.getElementById(`root`)
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
