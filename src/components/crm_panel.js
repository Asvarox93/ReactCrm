import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import TopBar from "./crm_topbar";

class Crm_panel extends Component {
  render() {
    if (this.props.auth.loggedIn === true) {
      return (
        <div>
          <TopBar />
          React CRM started
        </div>
      );
    } else {
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
  }
}

const mapStateToProps = state => {
  return {
    auth: state.auth
  };
};

export default connect(mapStateToProps)(Crm_panel);
