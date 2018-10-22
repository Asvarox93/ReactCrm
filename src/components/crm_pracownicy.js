import React, { Component } from "react";
import { Field, reduxForm } from "redux-form";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { onModalShow } from "../action/index";
import UserRegisterModal from "./crm_pracownicy_add";

class Pracownicy extends Component {
  onButtonClick() {
    if (this.props.privileges.pracownicy) {
      this.props.onModalShow();
    } else {
      return {};
    }
  }

  showUserRegesterModal(active) {
    if (active) {
      return <UserRegisterModal />;
    }
    return;
  }

  render() {
    const { privileges, modalActive } = this.props;

    if (privileges.pracownicy === true) {
      return (
        <div>
          <div>Dane do wyświetlenia pracowników:</div>
          <button
            className="auth__submit"
            onClick={this.onButtonClick.bind(this)}
          >
            Dodaj
          </button>
          {this.showUserRegesterModal(modalActive)}
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
}

function validate(values) {
  const errors = [];

  return errors;
}

const mapStateToProps = state => {
  return {
    modalActive: state.modal.modalActive,
    privileges: state.auth.auth.privileges
  };
};

export default reduxForm({
  validate,
  form: "authUserForm"
})(
  connect(
    mapStateToProps,
    { onModalShow }
  )(Pracownicy)
);
