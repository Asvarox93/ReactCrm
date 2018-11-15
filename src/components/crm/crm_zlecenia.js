import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import _ from "lodash";
import {
  onModalShow,
  getCrmOrders,
  setOrderToEdit,
  closeCrmOrder
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
      console.log("ADD");
      return <OrderRegisterModal />;
    }
    if (modal.active && modal.type === "EDIT") {
      console.log("EDIT");
      return <OrderEditModal />;
    }
    if (modal.active && modal.type === "HISTORY") {
      console.log("HISTORY");
      return <OrderHistoryModal />;
    }
    return;
  }

  closeCrmOrder(orderKey) {
    const { crmKey } = this.props;
    this.props.closeCrmOrder(crmKey, orderKey);
  }

  showAddedOrders(crmOrders) {
    let number = 0;

    const listItems = Object.entries(crmOrders).map(([key, value]) => {
      number++;

      if (value.status !== "zamknięte") {
        return (
          <tr key={key} date={value.addedDate}>
            <td className="crm__table__th">{number}</td>
            <td className="crm__table__th">{value.client}</td>
            <td className="crm__table__th">{value.addedDate}</td>
            <td className="crm__table__th">{value.orderNote}</td>
            <td className="crm__table__th">{value.status}</td>
            <td className="crm__table__th">{value.worker}</td>
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
                onClick={() => this.onButtonClick("HISTORY", value, key)}
              >
                Działania
              </button>
            </td>
            <td>
              <button
                className="auth__submit"
                onClick={() => this.closeCrmOrder(key)}
              >
                Zamknij
              </button>
            </td>
          </tr>
        );
      }
      return (
        <tr key={key}>
          <td className="crm__table__th">{number}</td>
          <td className="crm__table__th">{value.client}</td>
          <td className="crm__table__th">{value.addedDate}</td>
          <td className="crm__table__th">{value.orderNote}</td>
          <td className="crm__table__th">{value.status}</td>
          <td className="crm__table__th">{value.worker}</td>
          <td>
            <button
              className="auth__submit"
              onClick={() => this.onButtonClick("EDIT", value, key)}
            >
              Działania
            </button>
          </td>
        </tr>
      );
    });

    return listItems;
  }

  render() {
    const { privileges, modalActive, crmOrders } = this.props;

    if (privileges.pracownicy === true) {
      return (
        <div>
          {this.showOrdersModal(modalActive)}
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
                <th className="crm__table__th">Nazwa klienta</th>
                <th className="crm__table__th">Data dodania</th>
                <th className="crm__table__th">Treść zlecenia</th>
                <th className="crm__table__th">Status</th>
                <th className="crm__table__th">Pracownik</th>
              </tr>
            </thead>
            <tbody>
              {_.orderBy(
                this.showAddedOrders(crmOrders),
                ["props.date"],
                ["asc"]
              )}
            </tbody>
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
    crmOrders: state.fetchTable.crmOrders
  };
};

export default connect(
  mapStateToProps,
  { onModalShow, getCrmOrders, setOrderToEdit, closeCrmOrder }
)(Zlecenia);
