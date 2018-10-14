import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import TopBar from "./crm_topbar";

class Crm_panel extends Component {
  render() {
    const {
      auth: { auth: auth, loggedIn: loggedIn }
    } = this.props;

    if (loggedIn && auth.role === "Admin") {
      console.log("LOGGED AS ADMINISTRATOR");
    }
    if (loggedIn && auth.role === "User") {
      console.log("LOGGED AS USER");
    }

    if (loggedIn && auth.emailVerified) {
      return (
        <div>
          <TopBar />
          React CRM started
        </div>
      );
    }
    if (!loggedIn) {
      return (
        <div>
          <h2 className="panel__authFail">
            Nie masz wystarczających uprawnien do wyświetlenia zawartości CRM.
            Zaloguj się!
          </h2>
          <Link to="/autoryzacja" className="panel__btn panel__btn--return">
            Logowanie
          </Link>
        </div>
      );
    }
    if (!auth.emailVerified) {
      return (
        <div>
          <h2 className="panel__authFail">
            Nie masz wystarczających uprawnien do wyświetlenia zawartości CRM
            ponieważ Twój adres email nie został zweryfikowany. Zweryfikuj adres
            a następnie zaloguj sie ponownie!
          </h2>
          <Link to="/autoryzacja" className="panel__btn panel__btn--return">
            Logowanie
          </Link>
        </div>
      );
    }
  }
}

const mapStateToProps = state => {
  return {
    auth: state.auth
  };
};

export default connect(mapStateToProps)(Crm_panel);
