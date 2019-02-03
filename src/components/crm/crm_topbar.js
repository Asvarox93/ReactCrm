import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { onSignOut } from "../../action/index";
import Logo from "../../images/logo_topbar.png";

class Crm_topbar extends Component {
  showMenuWithPrivileges(privileges) {
    const listItems = Object.entries(privileges).map(([key, value]) => {
      if (value === true) {
        if (key === "dashboard") {
          return (
            <li className="topbar__navlink" key={key}>
              <Link to={"/crm"}>
                {key.charAt(0).toUpperCase() + key.substring(1)}
              </Link>
            </li>
          );
        }
        if (key !== "dashboard") {
          return (
            <li className="topbar__navlink" key={key}>
              <Link to={"/crm/" + key}>
                {key.charAt(0).toUpperCase() + key.substring(1)}
              </Link>
            </li>
          );
        }
      }
      return null;
    });

    return listItems;
  }

  render() {
    const { role, loggedIn, email, nickname, privileges } = this.props;

    if ((loggedIn && role === "User") || (loggedIn && role === "Admin")) {
      return (
        <div className="topbar">
          <div className="topbar__logotype">
            <img src={Logo} alt="Logo Strony" className="topbar__logoImg" />
            <span>CRM</span>Pyxis
          </div>
          <div className="topbar__user">
            Witaj: <span>{nickname ? nickname : email}</span>
          </div>
          <Link
            to="/autoryzacja"
            className="topbar__userLogout"
            onClick={() => {
              this.props.onSignOut();
            }}
          >
            Logout
          </Link>
          <ul className="topbar__navbar">
            {this.showMenuWithPrivileges(privileges)}
          </ul>
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

export default connect(
  mapStateToProps,
  { onSignOut }
)(Crm_topbar);
