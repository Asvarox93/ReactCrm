import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import {
  onModalShow,
  getCrmOrders,
  setOrderToEdit,
  closeCrmOrder,
  getCrmOrdersByDataFilter,
  hideClosedOrders,
  searchOrdersByClients
} from "../../action/index";
import OrderRegisterModal from "./crm_zlecenia_add";
import OrderEditModal from "./crm_zlecenia_edit";
import OrderHistoryModal from "./crm_zlecenia_history";

class Zlecenia extends Component {
  onButtonClick(arg, order = "", uid = "") {
    this.props.onModalShow(arg);

    if (order) {
      const val = { order, uid };
      this.props.setOrderToEdit(val);
    }
  }

  showOrdersModal(modal) {
    if (modal.active && modal.type === "ADD") {
      return <OrderRegisterModal />;
    }
    if (modal.active && modal.type === "EDIT") {
      return <OrderEditModal />;
    }
    if (modal.active && modal.type === "HISTORY") {
      return <OrderHistoryModal />;
    }
    return;
  }

  closeCrmOrder(orderKey) {
    const { crmKey } = this.props;
    this.props.closeCrmOrder(crmKey, orderKey);
  }

  hideClosedOrders(e) {
    const filter = e.target.checked;
    this.props.hideClosedOrders(filter);
  }

  onDataFilterChange(filter) {
    const { crmOrders } = this.props;
    this.props.getCrmOrdersByDataFilter(crmOrders, filter);
  }

  searchOrders(e) {
    const filter = e.target.value;
    this.props.searchOrdersByClients(filter);
  }

  showAddedOrders(crmOrders) {
    let number = 0;
    let { hideOrders, searchOrders } = this.props;
    let listItems = Object.entries(crmOrders).map(([key, value]) => {
      number++;

      if (value.status !== "zamknięte") {
        return (
          <tr key={key} client={value.client}>
            <td>{number}</td>
            <td>{value.client}</td>
            <td>{value.addedDate}</td>
            <td>{value.orderNote}</td>
            <td>{value.status}</td>
            <td>{value.worker}</td>
            <td className="crm__tableBtn">
              <button
                className="auth__submit"
                onClick={() => this.onButtonClick("EDIT", value, value.key)}
              >
                Edytuj
              </button>
            </td>
            <td className="crm__tableBtn crm__tableBtn--history">
              <button
                className="auth__submit"
                onClick={() => this.onButtonClick("HISTORY", value, value.key)}
              >
                Działania
              </button>
            </td>
            <td className="crm__tableBtn crm__tableBtn--close">
              <button
                className="auth__submit"
                onClick={() => this.closeCrmOrder(value.key)}
              >
                Zamknij
              </button>
            </td>
          </tr>
        );
      }
      if (hideOrders === false) {
        return (
          <tr key={key} client={value.client}>
            <td>{number}</td>
            <td>{value.client}</td>
            <td>{value.addedDate}</td>
            <td>{value.orderNote}</td>
            <td>{value.status}</td>
            <td>{value.worker}</td>
            <td className="crm__tableBtn crm__tableBtn--history">
              <button
                className="auth__submit"
                onClick={() => this.onButtonClick("HISTORY", value, key)}
              >
                Działania
              </button>
            </td>
          </tr>
        );
      }

      return null;
    });

    if (searchOrders) {
      listItems = listItems.filter(item => {
        if (item !== null) {
          return (
            item.props.client
              .toString()
              .toLowerCase()
              .search(searchOrders.toString().toLowerCase()) !== -1
          );
        }
        return undefined;
      });
    }

    return listItems;
  }

  render() {
    const {
      privileges,
      modalActive,
      crmOrders,
      hideOrders,
      searchOrders
    } = this.props;

    if (privileges.zlecenia === true) {
      return (
        <div className="module">
          {this.showOrdersModal(modalActive)}
          <div className="module__title">Dane do wyświetlenia pracowników:</div>
          <div className="module__search">
            <input
              type="text"
              className="module__searchInput"
              placeholder="Wyszukaj po nazwie klienta"
              value={searchOrders}
              onChange={this.searchOrders.bind(this)}
            />
            <button
              className="auth__submit module__addBtn"
              onClick={() => this.onButtonClick("ADD")}
            >
              Dodaj Zlecenie
            </button>
          </div>
          <label>
            <input
              type="checkbox"
              value={hideOrders}
              onChange={this.hideClosedOrders.bind(this)}
            />
            Ukryj zakończone zlecenia
          </label>
          <table className="crm__table">
            <thead>
              <tr>
                <th>LP</th>
                <th>Nazwa klienta</th>
                <th>
                  Data dodania{" "}
                  <span onClick={() => this.onDataFilterChange("desc")}>
                    /\
                  </span>
                  <span onClick={() => this.onDataFilterChange("asc")}>\/</span>
                </th>
                <th>Treść zlecenia</th>
                <th>Status</th>
                <th>Pracownik</th>
              </tr>
            </thead>
            <tbody>{this.showAddedOrders(crmOrders)}</tbody>
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
    this.props.getCrmOrders(crmKey);
  }
}

const mapStateToProps = state => {
  return {
    modalActive: state.modal,
    privileges: state.auth.auth.privileges,
    crmKey: state.auth.auth.crmKey,
    crmOrders: state.fetchTable.crmOrders,
    hideOrders: state.fetchTable.hideClosedOrders,
    searchOrders: state.fetchTable.searchOrders
  };
};

export default connect(
  mapStateToProps,
  {
    onModalShow,
    getCrmOrders,
    setOrderToEdit,
    closeCrmOrder,
    getCrmOrdersByDataFilter,
    hideClosedOrders,
    searchOrdersByClients
  }
)(Zlecenia);
