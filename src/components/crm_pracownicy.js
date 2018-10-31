import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import {
  onModalShow,
  getCrmUsers,
  setUserToEdit,
  deleteCrmUser
} from "../action/index";
import UserRegisterModal from "./crm_pracownicy_add";
import UserEditModal from "./crm_pracownicy_edit";

class Pracownicy extends Component {
  onButtonClick(arg, user = "", uid = "") {
    if (user.role !== "Admin") {
      this.props.onModalShow(arg);

      if (user) {
        const val = { user, uid };
        this.props.setUserToEdit(val);
      }
    } else {
      alert("Nie możesz edytować Administratora CRM!");
      return;
    }
  }

  showUserRegesterModal(modal) {
    if (modal.active && modal.type === "ADD") {
      console.log("ADD");
      return <UserRegisterModal />;
    }
    if (modal.active && modal.type === "EDIT") {
      console.log("EDIT");
      return <UserEditModal />;
    }
    return;
  }

  deteleCrmUser(key, role) {
    if (role === "Admin") {
      alert("Nie możesz wykasować Administratora CRM!");
      return;
    }
    const { crmKey } = this.props;
    this.props.deleteCrmUser(key, crmKey);
  }

  showAddedUsers(crmUsers) {
    let number = 0;

    const listItems = Object.entries(crmUsers).map(([key, value]) => {
      number++;

      return (
        <tr key={key}>
          <td className="crm__table__th">{number}</td>
          <td className="crm__table__th">{value.username}</td>
          <td className="crm__table__th">{value.email}</td>
          <td className="crm__table__th">
            <ul>
              <li>Dashboard: {value.privileges.dashboard ? "Tak" : "Nie"}</li>
              <li>Klienci: {value.privileges.klienci ? "Tak" : "Nie"}</li>
              <li>Pracownicy: {value.privileges.pracownicy ? "Tak" : "Nie"}</li>
              <li>Zlecenia: {value.privileges.zlecenia ? "Tak" : "Nie"}</li>
            </ul>
          </td>
          <td>
            <button
              className="auth__submit"
              onClick={() => this.onButtonClick("EDIT", value, key)}
            >
              Edytuj
            </button>
          </td>
          <td>
            <button
              className="auth__submit"
              onClick={() => this.deteleCrmUser(key, value.role)}
            >
              Usuń
            </button>
          </td>
        </tr>
      );
    });

    return listItems;
  }

  render() {
    const { privileges, modalActive, crmUsers } = this.props;

    if (privileges.pracownicy === true) {
      return (
        <div>
          {this.showUserRegesterModal(modalActive)}
          <div>Dane do wyświetlenia pracowników:</div>
          <button
            className="auth__submit"
            onClick={() => this.onButtonClick("ADD")}
          >
            Dodaj
          </button>

          <table className="crm__table">
            <thead>
              <tr>
                <th className="crm__table__th">LP</th>
                <th className="crm__table__th">Imię i nazwisko</th>
                <th className="crm__table__th">Adres e-mail</th>
                <th className="crm__table__th">Przywileje</th>
              </tr>
            </thead>
            <tbody>{this.showAddedUsers(crmUsers)}</tbody>
          </table>

          {/* TODO: Stworzenie componentu wyszukiwarki, stworzenie componentu dodawania użytkownika(modal-box), autoryzacja */}
          {/* Component dodawania użytkownika powinien zawierać: Pole nickname, email, password i uid administratora */}
        </div>
      );
    } else {
      return (
        <div>
          <div>
            Nie masz wystarczających uprawnień do wyświetlenia tej zawartości.
          </div>
          <Link to="/crm" className="panel__btn panel__btn--return">
            Cofnij
          </Link>
        </div>
      );
    }
  }

  componentDidMount() {
    const crmKey = this.props.crmKey;
    this.props.getCrmUsers(crmKey);
  }
}

const mapStateToProps = state => {
  return {
    modalActive: state.modal,
    privileges: state.auth.auth.privileges,
    crmKey: state.auth.auth.crmKey,
    crmUsers: state.fetchTable.crmUsers
  };
};

export default connect(
  mapStateToProps,
  { onModalShow, getCrmUsers, setUserToEdit, deleteCrmUser }
)(Pracownicy);
