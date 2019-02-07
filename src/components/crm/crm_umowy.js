import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import {
  onModalShow,
  getCrmContracts,
  setContractToEdit,
  deleteCrmContract,
  downloadCrmContract,
  searchContractsByClient
} from "../../action/index";
import ContractEditModal from "./crm_umowy_edit";
import ContractRegisterModal from "./crm_umowy_add";

class Umowy extends Component {
  onButtonClick(arg, contract = "", uid = "") {
    this.props.onModalShow(arg);

    if (contract) {
      const val = { contract, uid };
      this.props.setContractToEdit(val);
    }
  }

  showContractsModal(modal) {
    if (modal.active && modal.type === "ADD") {
      return <ContractRegisterModal />;
    }
    if (modal.active && modal.type === "EDIT") {
      return <ContractEditModal />;
    }
    return;
  }

  deteleCrmContract(contractKey, fileUrl) {
    const { crmKey } = this.props;
    this.props.deleteCrmContract(crmKey, contractKey, fileUrl);
  }

  downloadCrmContract(fileUrl, fileName) {
    this.props.downloadCrmContract(fileUrl, fileName);
  }

  searchContracts(e) {
    const filter = e.target.value;
    this.props.searchContractsByClient(filter);
  }

  showAddedContracts(crmContracts) {
    let number = 0;
    let { searchContracts } = this.props;

    let listItems = Object.entries(crmContracts).map(([key, value]) => {
      number++;
      const contractId = value.contractId;
      return (
        <tr key={key} name={value.name}>
          <td>{number}</td>
          <td>{value.name}</td>
          <td>{value.contractDate}</td>
          <td>{value.deadlineDate}</td>
          <td>{value.type}</td>
          <td>{value.comment}</td>
          <td className="crm__tableBtn crm__tableBtn--download">
            <button
              className="auth__submit"
              onClick={() =>
                this.downloadCrmContract(value.attachmentUrl, value.attachment)
              }
            >
              Pobierz
            </button>
          </td>
          <td className="crm__tableBtn">
            <button
              className="auth__submit"
              onClick={() => this.onButtonClick("EDIT", value, contractId)}
            >
              Edytuj
            </button>
          </td>
          <td className="crm__tableBtn crm__tableBtn--close">
            <button
              className="auth__submit"
              onClick={() =>
                this.deteleCrmContract(contractId, value.attachmentUrl)
              }
            >
              Usuń
            </button>
          </td>
        </tr>
      );
    });

    if (searchContracts) {
      listItems = listItems.filter(item => {
        return (
          item.props.name
            .toString()
            .toLowerCase()
            .search(searchContracts.toString().toLowerCase()) !== -1
        );
      });
    }

    return listItems;
  }

  render() {
    const {
      privileges,
      modalActive,
      crmContracts,
      searchContracts
    } = this.props;

    if (privileges.umowy === true) {
      return (
        <div>
          {this.showContractsModal(modalActive)}
          <div>Dane do wyświetlenia Korespondencji:</div>
          <input
            type="text"
            value={searchContracts}
            onChange={this.searchContracts.bind(this)}
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
                <th>LP</th>
                <th>Nazwa klienta</th>
                <th>Data zawarcia</th>
                <th>Termin realizacji</th>
                <th>Typ</th>
                <th>Uwagi</th>
              </tr>
            </thead>
            <tbody>{this.showAddedContracts(crmContracts)}</tbody>
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
    this.props.getCrmContracts(crmKey);
  }
}

const mapStateToProps = state => {
  return {
    modalActive: state.modal,
    privileges: state.auth.auth.privileges,
    crmKey: state.auth.auth.crmKey,
    crmContracts: state.fetchTable.crmContracts,
    searchContracts: state.fetchTable.searchContracts
  };
};

export default connect(
  mapStateToProps,
  {
    onModalShow,
    getCrmContracts,
    setContractToEdit,
    deleteCrmContract,
    downloadCrmContract,
    searchContractsByClient
  }
)(Umowy);
