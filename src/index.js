import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import thunk from "redux-thunk";
import { createStore, applyMiddleware } from "redux";
import {
  BrowserRouter as Router,
  Route,
  Link,
  Switch,
  Redirect
} from "react-router-dom";

import "./main.css";
import reducers from "./reducers";

import App from "./components/app";
import Auth from "./components/auth";
import Crm_panel from "./components/crm_panel";

const createStoreWithMiddleware = applyMiddleware(thunk)(createStore);

ReactDOM.render(
  <Provider store={createStoreWithMiddleware(reducers)}>
    <Router>
      <div>
        <Route path="/" component={App} />
        <Route path="/login" component={Auth} />
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
