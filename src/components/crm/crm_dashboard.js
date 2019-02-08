import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

import zleceniaImg from "../../images/zlecenia.png";
import klienciImg from "../../images/klienci.png";
import korespondencjaImg from "../../images/korespondencja.png";
import umowyImg from "../../images/umowy.png";
import pracownicyImg from "../../images/pracownicy.png";

class Dashboard extends Component {
  showMenuWithPrivileges(privileges) {
    const listItems = Object.entries(privileges).map(([key, value]) => {
      if (value === true) {
        if (key === "zlecenia") {
          return (
            <Link to={"/crm/zlecenia"} className="dashboard__box">
              <img
                src={zleceniaImg}
                alt="Zlecenia"
                className="dashboard__img"
              />
              <h2 className="dashboard__title">
                Sprawdź swoje aktualne zlecenia
              </h2>
            </Link>
          );
        }

        if (key === "klienci") {
          return (
            <Link to={"/crm/klienci"} className="dashboard__box">
              <img src={klienciImg} alt="Klienci" className="dashboard__img" />
              <h2 className="dashboard__title">
                Sprawdź bazę swoich aktualnych klientów
              </h2>
            </Link>
          );
        }
        if (key === "korespondencja") {
          return (
            <Link to={"/crm/korespondencja"} className="dashboard__box">
              <img
                src={korespondencjaImg}
                alt="Korespondencja"
                className="dashboard__img"
              />
              <h2 className="dashboard__title">
                Sprawdź swoje aktualną korespondencję
              </h2>
            </Link>
          );
        }
        if (key === "umowy") {
          return (
            <Link to={"/crm/umowy"} className="dashboard__box">
              <img src={umowyImg} alt="Umowy" className="dashboard__img" />
              <h2 className="dashboard__title">Sprawdź swoje aktualne umowy</h2>
            </Link>
          );
        }
        if (key === "pracownicy") {
          return (
            <Link to={"/crm/pracownicy"} className="dashboard__box">
              <img
                src={pracownicyImg}
                alt="Pracownicy"
                className="dashboard__img"
              />
              <h2 className="dashboard__title">
                Sprawdź swoich aktualnych pracowników
              </h2>
            </Link>
          );
        }
      }
      return null;
    });

    return listItems;
  }

  render() {
    const { privileges } = this.props;
    return (
      <div className="dashboard">{this.showMenuWithPrivileges(privileges)}</div>
    );
  }
}

const mapStateToProps = state => {
  return {
    privileges: state.auth.auth.privileges
  };
};

export default connect(
  mapStateToProps,
  null
)(Dashboard);
