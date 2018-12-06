import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import {
  onModalShow,
  getCrmClients,
  setClientToEdit,
  deleteCrmClient,
  searchClientByName
} from "../../action/index";
import ClientsRegisterModal from "./crm_klienci_add";
import ClientsEditModal from "./crm_klienci_edit";

class Klienci extends Component {
  onButtonClick(arg, client = "", uid = "") {
    this.props.onModalShow(arg);

    if (client) {
      const val = { client, uid };
      this.props.setClientToEdit(val);
    }
  }

  showClientsModal(modal) {
    if (modal.active && modal.type === "ADD") {
      return <ClientsRegisterModal />;
    }
    if (modal.active && modal.type === "EDIT") {
      return <ClientsEditModal />;
    }
    return;
  }

  deteleCrmClient(clientKey) {
    const { crmKey } = this.props;
    this.props.deleteCrmClient(crmKey, clientKey);
  }

  searchClients(e) {
    const filter = e.target.value;
    this.props.searchClientByName(filter);
  }

  showAddedClients(crmClients) {
    let number = 0;
    let { searchClients } = this.props;

    let listItems = Object.entries(crmClients).map(([key, value]) => {
      number++;

      return (
        <tr key={key} name={value.name}>
          <td className="crm__table__th">{number}</td>
          <td className="crm__table__th">{value.name}</td>
          <td className="crm__table__th">{value.nip}</td>
          <td className="crm__table__th">
            <a href={`mailto:${value.email}`} data-rel="external">
              {value.email}
            </a>
          </td>
          <td className="crm__table__th">
            <a href={`tel:${value.tel}`} data-rel="external">
              {value.tel}
            </a>
          </td>
          <td className="crm__table__th">{value.road}</td>
          <td className="crm__table__th">{value.code}</td>
          <td className="crm__table__th">{value.city}</td>
          <td className="crm__table__th">{value.comment}</td>
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
              onClick={() => this.deteleCrmClient(key)}
            >
              Usuń
            </button>
          </td>
        </tr>
      );
    });

    if (searchClients) {
      listItems = listItems.filter(item => {
        return (
          item.props.name
            .toString()
            .toLowerCase()
            .search(searchClients.toString().toLowerCase()) !== -1
        );
      });
    }

    return listItems;
  }

  render() {
    const { privileges, modalActive, crmClients, searchClients } = this.props;

    if (privileges.klienci === true) {
      return (
        <div>
          {this.showClientsModal(modalActive)}
          <div>Dane do wyświetlenia klientów:</div>
          <input
            type="text"
            value={searchClients}
            onChange={this.searchClients.bind(this)}
          />
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
                <th className="crm__table__th">Nazwa</th>
                <th className="crm__table__th">NIP</th>
                <th className="crm__table__th">E-mail</th>
                <th className="crm__table__th">Telefon</th>
                <th className="crm__table__th">Ulica</th>
                <th className="crm__table__th">Kod pocztowy</th>
                <th className="crm__table__th">Miasto</th>
                <th className="crm__table__th">Uwagi</th>
              </tr>
            </thead>
            <tbody>{this.showAddedClients(crmClients)}</tbody>
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
    this.props.getCrmClients(crmKey);
  }
}

const mapStateToProps = state => {
  return {
    modalActive: state.modal,
    privileges: state.auth.auth.privileges,
    crmKey: state.auth.auth.crmKey,
    crmClients: state.fetchTable.crmClients,
    searchClients: state.fetchTable.searchClients
  };
};

export default connect(
  mapStateToProps,
  {
    onModalShow,
    getCrmClients,
    setClientToEdit,
    deleteCrmClient,
    searchClientByName
  }
)(Klienci);
