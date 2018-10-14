import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

class Crm_topbar extends Component {
  showMenuWithPrivileges(privileges) {
    const listItems = Object.entries(privileges).map(([key, value]) => {
      if (value === true) {
        if (key === "dashboard") {
          return (
            <li className="topbar_navlink" key={key}>
              <Link to={"/crm"}>
                {key.charAt(0).toUpperCase() + key.substring(1)}
              </Link>
            </li>
          );
        }
        if (key !== "dashboard") {
          return (
            <li className="topbar_navlink" key={key}>
              <Link to={"/crm/" + key}>
                {key.charAt(0).toUpperCase() + key.substring(1)}
              </Link>
            </li>
          );
        }
      }
    });

    return listItems;
  }

  render() {
    const { role, loggedIn, email, nickname, privileges } = this.props;

    if ((loggedIn && role === "User") || (loggedIn && role === "Admin")) {
      return (
        <div className="topbar">
          <ul className="topbar__navbar">
            {this.showMenuWithPrivileges(privileges)}
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
    privileges: state.auth.auth.privileges,
    loggedIn: state.auth.loggedIn,
    role: state.auth.auth.role,
    email: state.auth.auth.email,
    nickname: state.auth.auth.nickname
  };
};

export default connect(mapStateToProps)(Crm_topbar);
