import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import {
  onModalShow,
  getCrmUsers,
  setUserToEdit,
  deleteCrmUser,
  searchWorkerByName
} from "../../action/index";
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

  searchWorkers(e) {
    const filter = e.target.value;
    this.props.searchWorkerByName(filter);
  }

  showAddedUsers(crmUsers) {
    let number = 0;
    let { searchWorkers } = this.props;

    let listItems = Object.entries(crmUsers).map(([key, value]) => {
      number++;

      return (
        <tr key={key} worker={value.username}>
          <td>{number}</td>
          <td>{value.username}</td>
          <td>{value.email}</td>

          <td>{value.privileges.dashboard ? "Tak" : "Nie"}</td>
          <td>{value.privileges.klienci ? "Tak" : "Nie"}</td>
          <td>{value.privileges.pracownicy ? "Tak" : "Nie"}</td>
          <td>{value.privileges.zlecenia ? "Tak" : "Nie"}</td>
          <td>{value.privileges.korespondencja ? "Tak" : "Nie"}</td>
          <td>{value.privileges.umowy ? "Tak" : "Nie"}</td>

          <td className="crm__tableBtn">
            <button
              className="auth__submit"
              onClick={() => this.onButtonClick("EDIT", value, key)}
            >
              Edytuj
            </button>
          </td>
          <td className="crm__tableBtn crm__tableBtn--close">
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

    if (searchWorkers) {
      listItems = listItems.filter(item => {
        return (
          item.props.worker
            .toString()
            .toLowerCase()
            .search(searchWorkers.toString().toLowerCase()) !== -1
        );
      });
    }

    return listItems;
  }

  render() {
    const { privileges, modalActive, crmUsers, searchWorkers } = this.props;

    if (privileges.pracownicy === true) {
      return (
        <div className="module">
          {this.showUserRegesterModal(modalActive)}
          <div className="module__title">Dane do wyświetlenia pracowników:</div>
          <div className="module__search">
            <input
              type="text"
              className="module__searchInput"
              value={searchWorkers}
              placeholder="Wyszukaj po nazwie pracownika"
              onChange={this.searchWorkers.bind(this)}
            />
            <button
              className="auth__submit module__addBtn"
              onClick={() => this.onButtonClick("ADD")}
            >
              Dodaj
            </button>
          </div>
          <table className="crm__table">
            <thead>
              <tr>
                <th>LP</th>
                <th>Imię i nazwisko</th>
                <th>Adres e-mail</th>

                <th>Dashboard</th>
                <th>Klienci</th>
                <th>Pracownicy</th>
                <th>Zlecenia</th>
                <th>Korespondencja</th>
                <th>Umowy</th>
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
    crmUsers: state.fetchTable.crmUsers,
    searchWorkers: state.fetchTable.searchWorkers
  };
};

export default connect(
  mapStateToProps,
  { onModalShow, getCrmUsers, setUserToEdit, deleteCrmUser, searchWorkerByName }
)(Pracownicy);
