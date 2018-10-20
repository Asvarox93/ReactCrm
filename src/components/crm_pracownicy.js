import React, { Component } from "react";
import { Field, reduxForm } from "redux-form";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { createCrmUser } from "../action/index";

class Pracownicy extends Component {
  renderField(field) {
    return (
      <div className={field.notRegister ? "auth__field--hide" : "auth__field"}>
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
    const privileges = e.privileges;
    const { role, crmKey } = this.props;

    if (role === "Admin") {
      this.props.createCrmUser(
        email,
        password,
        nickname,
        privileges,
        crmKey,
        () => {
          alert("Pracownik dodany!");
        }
      );
    }
  }

  render() {
    const { privileges, handleSubmit } = this.props;
    const userPrivileges = {};
    if (privileges.pracownicy === true) {
      return (
        <div>
          <div>Dane do wyświetlenia pracowników:</div>

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
            {/*TODO: checkboxy z uprawnieniami */}

            <button className="auth__submit">Zarejestruj</button>
            <Link to="/" className="auth__submit auth__submit--return">
              Cofnij
            </Link>
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
    { createCrmUser }
  )(Pracownicy)
);
