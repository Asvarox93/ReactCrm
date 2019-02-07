import React, { Component } from "react";
import { Link } from "react-router-dom";

import zleceniaImg from "../../images/zlecenia.png";
import klienciImg from "../../images/klienci.png";
import korespondencjaImg from "../../images/korespondencja.png";
import umowyImg from "../../images/umowy.png";
import pracownicyImg from "../../images/pracownicy.png";

export default class Dashboard extends Component {
  render() {
    return (
      <div className="dashboard">
        <Link to={"/crm/zlecenia"} className="dashboard__box">
          <img src={zleceniaImg} alt="Zlecenia" className="dashboard__img" />
          <h2 className="dashboard__title">Sprawdź swoje aktualne zlecenia</h2>
        </Link>

        <Link to={"/crm/klienci"} className="dashboard__box">
          <img src={klienciImg} alt="Klienci" className="dashboard__img" />
          <h2 className="dashboard__title">
            Sprawdź bazę swoich aktualnych klientów
          </h2>
        </Link>

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

        <Link to={"/crm/umowy"} className="dashboard__box">
          <img src={umowyImg} alt="Umowy" className="dashboard__img" />
          <h2 className="dashboard__title">Sprawdź swoje aktualne umowy</h2>
        </Link>

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
      </div>
    );
  }
}
