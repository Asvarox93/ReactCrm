import React, { Component } from "react";
import { Field, reduxForm } from "redux-form";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { createCrmUser, onModalOff } from "../action/index";

class UserRegisterModal extends Component {
  renderField(field) {
    return (
      <div className="auth__field">
        <label className="auth__label">{field.label}</label>
        <input {...field.input} type={field.type} className="auth__input" />
        <p className="auth__errors">
          {field.meta.touched ? field.meta.error : ""}
        </p>
      </div>
    );
  }

  onFormSubmit(e) {
    const email = e.email;
    const password = e.password;
    const nickname = e.nickname;
    const privileges = {
      pracownicy: e.pracownicy ? e.pracownicy : false,
      zlecenia: e.zlecenia ? e.zlecenia : false,
      klienci: e.klienci ? e.klienci : false
    };
    const { crmKey } = this.props;

    if (this.props.privileges.pracownicy) {
      this.props.createCrmUser(
        email,
        password,
        nickname,
        privileges,
        crmKey,
        () => {
          this.closeRegisterModal();
          alert("Pracownik dodany");
        }
      );
    } else {
      alert("Nie masz uprawnień!");
    }
  }

  closeRegisterModal() {
    this.props.onModalOff();
  }

  render() {
    const { privileges, handleSubmit } = this.props;

    if (privileges.pracownicy === true) {
      return (
        <div className="formModal">
          <div>Formularz dodawania pracownika:</div>

          <form
            onSubmit={handleSubmit(this.onFormSubmit.bind(this))}
            className="auth__form"
          >
            <h2 className="auth__title">
              Formularz dodawania nowego pracownika
            </h2>
            {this.props.authRegisterError}
            <Field
              type="text"
              label="Nazwa"
              name="nickname"
              component={this.renderField}
            />
            <Field
              type="text"
              label="E-mail"
              name="email"
              component={this.renderField}
            />
            <Field
              type="password"
              label="Password"
              name="password"
              component={this.renderField}
            />
            <h3>Uprawnienia:</h3>
            <Field
              name="klienci"
              label="klienci"
              component={this.renderField}
              type="checkbox"
            />
            <Field
              name="zlecenia"
              label="zlecenia"
              component={this.renderField}
              type="checkbox"
            />
            <Field
              name="pracownicy"
              label="pracownicy"
              component={this.renderField}
              type="checkbox"
            />

            <button className="auth__submit">Dodaj</button>
            <button
              type="button"
              onClick={this.closeRegisterModal.bind(this)}
              className="panel__btn panel__btn--return"
            >
              Zamknij
            </button>
          </form>

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
    { createCrmUser, onModalOff }
  )(UserRegisterModal)
);
