import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import {
  onModalShow,
  getCrmOrders,
  setOrderToEdit,
  deleteCrmOrder
} from "../../action/index";
import OrderRegisterModal from "./crm_zlecenia_add";
import OrderEditModal from "./crm_zlecenia_edit";

class Zlecenia extends Component {
  onButtonClick(arg, client = "", uid = "") {
    this.props.onModalShow(arg);

    if (client) {
      const val = { client, uid };
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
    return;
  }

  deteleCrmOrder(orderKey) {
    const { crmKey } = this.props;
    this.props.deleteCrmOrder(crmKey, orderKey);
  }

  showAddedOrders(crmOrders) {
    let number = 0;

    const listItems = Object.entries(crmOrders).map(([key, value]) => {
      number++;

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
              Edytuj
            </button>
          </td>
          <td>
            <button
              className="auth__submit"
              onClick={() => this.deteleCrmOrder(key)}
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
    crmOrders: state.fetchTable.crmOrders
  };
};

export default connect(
  mapStateToProps,
  { onModalShow, getCrmOrders, setOrderToEdit, deleteCrmOrder }
)(Zlecenia);
