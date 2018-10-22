import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import thunk from "redux-thunk";
import { createStore, applyMiddleware } from "redux";
import { BrowserRouter as Router, Route } from "react-router-dom";
import "./firebaseAuth";

import "./main.css";
import reducers, { initialState } from "./reducers";

import App from "./components/app";
import Auth from "./components/auth";
import Crm_panel from "./components/crm_panel";

const createStoreWithMiddleware = applyMiddleware(thunk)(createStore);

ReactDOM.render(
  <Provider
    store={createStoreWithMiddleware(
      reducers,
      initialState,
      window.__REDUX_DEVTOOLS_EXTENSION__ &&
        window.__REDUX_DEVTOOLS_EXTENSION__()
    )}
  >
    <Router>
      <div>
        <Route exact path="/" component={App} />
        <Route path="/autoryzacja" component={Auth} />
        <Route
          path="/crm"
          component={Crm_panel}
          authed="{this.props.currentUser}"
        />
      </div>
    </Router>
  </Provider>,
  document.querySelector("#root")
);
