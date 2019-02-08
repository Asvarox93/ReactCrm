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
          <td>{number}</td>
          <td>{value.name}</td>
          <td>{value.nip}</td>
          <td>
            <a href={`mailto:${value.email}`} data-rel="external">
              {value.email}
            </a>
          </td>
          <td>
            <a href={`tel:${value.tel}`} data-rel="external">
              {value.tel}
            </a>
          </td>
          <td>{value.road}</td>
          <td>{value.code}</td>
          <td>{value.city}</td>
          <td>{value.comment}</td>
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
        <div className="module">
          {this.showClientsModal(modalActive)}
          <div className="module__title">Dane do wyświetlenia klientów:</div>
          <div className="module__search">
            <input
              type="text"
              className="module__searchInput"
              placeholder="Wyszukaj po nazwie klienta"
              value={searchClients}
              onChange={this.searchClients.bind(this)}
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
                <th>Nazwa</th>
                <th>NIP</th>
                <th>E-mail</th>
                <th>Telefon</th>
                <th>Ulica</th>
                <th>Kod pocztowy</th>
                <th>Miasto</th>
                <th>Uwagi</th>
              </tr>
            </thead>
            <tbody>{this.showAddedClients(crmClients)}</tbody>
          </table>
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
