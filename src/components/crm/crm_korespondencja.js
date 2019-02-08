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
      const mailId = value.mailId;
      return (
        <tr key={key} name={value.name}>
          <td>{number}</td>
          <td>{value.name}</td>
          <td>{value.concern}</td>
          <td>{value.date}</td>
          <td>{value.type}</td>
          <td>{value.form}</td>
          <td>{value.comment}</td>
          <td className="crm__tableBtn crm__tableBtn--download">
            <button
              className="auth__submit"
              onClick={() =>
                this.downloadCrmMail(value.attachmentUrl, value.attachment)
              }
            >
              Pobierz
            </button>
          </td>
          <td className="crm__tableBtn">
            <button
              className="auth__submit"
              onClick={() => this.onButtonClick("EDIT", value, mailId)}
            >
              Edytuj
            </button>
          </td>
          <td className="crm__tableBtn crm__tableBtn--close">
            <button
              className="auth__submit"
              onClick={() => this.deteleCrmMail(mailId, value.attachmentUrl)}
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
        <div className="module">
          {this.showMailsModal(modalActive)}
          <div className="module__title">
            Dane do wyświetlenia Korespondencji:
          </div>
          <div className="module__search">
            <input
              type="text"
              className="module__searchInput"
              placeholder="Wyszukaj po nazwie klienta"
              value={searchMails}
              onChange={this.searchMails.bind(this)}
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
                <th>Dotyczy</th>
                <th>Data dokumentu</th>
                <th>Typ</th>
                <th>Forma</th>
                <th>Uwagi</th>
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
