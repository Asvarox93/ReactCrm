import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

class Crm_topbar extends Component {
  render() {
    const { role, loggedIn, email, nickname } = this.props;

    if (loggedIn && role === "User") {
      return (
        <div className="topbar">
          <ul className="topbar__navbar">
            <li className="topbar_navlink">
              <Link to="/crm">Dashboard</Link>
            </li>
            <li className="topbar_navlink">
              <Link to="/crm/zlecenia">Zlecenia</Link>
            </li>
            <li className="topbar_navlink">
              <Link to="/crm/klienci">Klienci</Link>
            </li>
          </ul>
          <div className="topbar__user">
            Dzień dobry
            {nickname ? nickname : email}
          </div>
          <button className="topbar__userLogout">Logout</button>
        </div>
      );
    }

    if (loggedIn && role === "Admin") {
      return (
        <div className="topbar">
          <ul className="topbar__navbar">
            <li className="topbar_navlink">
              <Link to="/crm">Dashboard</Link>
            </li>
            <li className="topbar_navlink">
              <Link to="/crm/zlecenia">Zlecenia</Link>
            </li>
            <li className="topbar_navlink">
              <Link to="/crm/klienci">Klienci</Link>
            </li>
            <li className="topbar_navlink">
              <Link to="/crm/pracownicy">Pracownicy</Link>
            </li>
          </ul>
          <div className="topbar__user">
            Dzień dobry
            {nickname ? nickname : email}
          </div>
          <button className="topbar__userLogout">Logout</button>
        </div>
      );
    }
  }
}

const mapStateToProps = state => {
  return {
    loggedIn: state.auth.loggedIn,
    role: state.auth.auth.role,
    email: state.auth.auth.email,
    nickname: state.auth.auth.nickname
  };
};

export default connect(mapStateToProps)(Crm_topbar);
