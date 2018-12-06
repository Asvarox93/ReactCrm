import React, { Component } from "react";
import { connect } from "react-redux";
import { Route, Link, Switch } from "react-router-dom";
import TopBar from "./crm_topbar";
import Zlecenia from "./crm_zlecenia";
import Dashboard from "./crm_dashboard";
import Klienci from "./crm_klienci";
import Pracownicy from "./crm_pracownicy";
import Korespondencja from "./crm_korespondencja";
import Umowy from "./crm_umowy";

class Crm_panel extends Component {
  render() {
    const {
      auth: { auth, loggedIn }
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
          <Switch>
            <Route exact path="/crm" component={Dashboard} />
            <Route path="/crm/zlecenia" component={Zlecenia} />
            <Route path="/crm/klienci" component={Klienci} />
            <Route path="/crm/pracownicy" component={Pracownicy} />
            <Route path="/crm/korespondencja" component={Korespondencja} />
            <Route path="/crm/umowy" component={Umowy} />
          </Switch>
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

export default connect(
  mapStateToProps,
  null
)(Crm_panel);
