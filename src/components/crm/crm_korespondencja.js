import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import {
  onModalShow,
  getCrmMails,
  setMailToEdit,
  deleteCrmMail,
  downloadCrmMail,
  searchMailsByClient
} from "../../action/index";
import MailRegisterModal from "./crm_korespondencja_add";
import MailEditModal from "./crm_korespondencja_edit";

class Korespondencja extends Component {
  onButtonClick(arg, mail = "", uid = "") {
    this.props.onModalShow(arg);

    if (mail) {
      const val = { mail, uid };
      this.props.setMailToEdit(val);
    }
  }

  showMailsModal(modal) {
    if (modal.active && modal.type === "ADD") {
      return <MailRegisterModal />;
    }
    if (modal.active && modal.type === "EDIT") {
      return <MailEditModal />;
    }
    return;
  }

  deteleCrmMail(mailKey, fileUrl) {
    const { crmKey } = this.props;
    this.props.deleteCrmMail(crmKey, mailKey, fileUrl);
  }

  downloadCrmMail(fileUrl, fileName) {
    this.props.downloadCrmMail(fileUrl, fileName);
  }

  searchMails(e) {
    const filter = e.target.value;
    this.props.searchMailsByClient(filter);
  }

  showAddedMails(crmMails) {
    let number = 0;
    let { searchMails } = this.props;

    let listItems = Object.entries(crmMails).map(([key, value]) => {
      number++;

      return (
        <tr key={key} name={value.name}>
          <td className="crm__table__th">{number}</td>
          <td className="crm__table__th">{value.name}</td>
          <td className="crm__table__th">{value.concern}</td>
          <td className="crm__table__th">{value.type}</td>
          <td className="crm__table__th">{value.form}</td>
          <td className="crm__table__th">{value.comment}</td>
          <td>
            <button
              className="auth__submit"
              onClick={() =>
                this.downloadCrmMail(value.attachmentUrl, value.attachment)
              }
            >
              Pobierz
            </button>
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
              onClick={() => this.deteleCrmMail(key, value.attachmentUrl)}
            >
              Usuń
            </button>
          </td>
        </tr>
      );
    });

    if (searchMails) {
      listItems = listItems.filter(item => {
        return (
          item.props.name
            .toString()
            .toLowerCase()
            .search(searchMails.toString().toLowerCase()) !== -1
        );
      });
    }

    return listItems;
  }

  render() {
    const { privileges, modalActive, crmMails, searchMails } = this.props;

    if (privileges.korespondencja === true) {
      return (
        <div>
          {this.showMailsModal(modalActive)}
          <div>Dane do wyświetlenia Korespondencji:</div>
          <input
            type="text"
            value={searchMails}
            onChange={this.searchMails.bind(this)}
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
                <th className="crm__table__th">Dotyczy</th>
                <th className="crm__table__th">Typ</th>
                <th className="crm__table__th">Forma</th>
                <th className="crm__table__th">Uwagi</th>
              </tr>
            </thead>
            <tbody>{this.showAddedMails(crmMails)}</tbody>
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
    this.props.getCrmMails(crmKey);
  }
}

const mapStateToProps = state => {
  return {
    modalActive: state.modal,
    privileges: state.auth.auth.privileges,
    crmKey: state.auth.auth.crmKey,
    crmMails: state.fetchTable.crmMails,
    searchMails: state.fetchTable.searchMails
  };
};

export default connect(
  mapStateToProps,
  {
    onModalShow,
    getCrmMails,
    setMailToEdit,
    deleteCrmMail,
    downloadCrmMail,
    searchMailsByClient
  }
)(Korespondencja);
