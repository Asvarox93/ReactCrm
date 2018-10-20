import React, { Component } from "react";
import { Field, reduxForm } from "redux-form";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { createCrmUser } from "../action/index";

class Pracownicy extends Component {
  render() {
    const { privileges } = this.props;
    if (privileges.pracownicy === true) {
      return (
        <div>
          <div>Dane do wyświetlenia pracowników:</div>
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
    authRegisterError: state.auth.authRegisterError,
    authLoginError: state.auth.authLoginError,
    crmKey: state.auth.auth.crmKey,
    role: state.auth.auth.role,
    privileges: state.auth.auth.privileges
  };
};

export default reduxForm({
  validate,
  form: "authUserForm"
})(
  connect(
    mapStateToProps,
    { createCrmUser }
  )(Pracownicy)
);
