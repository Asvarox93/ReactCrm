import React, { Component } from "react";
import { Field, reduxForm } from "redux-form";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { createCrmClient, onModalOff } from "../../action/index";

class ClientsRegisterModal extends Component {
  renderField(field) {
    return (
      <div className="auth__field formModal__field">
        <label className="auth__label">{field.label}</label>
        <input
          {...field.input}
          type={field.type}
          className="auth__input formModal__input"
        />
        <p className="auth__errors">
          {field.meta.touched ? field.meta.error : ""}
        </p>
      </div>
    );
  }

  onFormSubmit(e) {
    const { name, nip, email, tel, road, code, city, comment } = e;
    const { crmKey } = this.props;

    if (this.props.privileges.klienci) {
      this.props.createCrmClient(
        name,
        nip,
        email,
        tel,
        road,
        code,
        city,
        comment,
        crmKey,
        () => {
          this.closeClientModal();
          alert("Klient został dodany");
        }
      );
    } else {
      alert("Nie masz uprawnień!");
    }
  }

  closeClientModal() {
    this.props.onModalOff();
  }

  render() {
    const { privileges, handleSubmit } = this.props;

    if (privileges.klienci === true) {
      return (
        <div className="formModal">
          <form
            onSubmit={handleSubmit(this.onFormSubmit.bind(this))}
            className="formModal__form"
          >
            <h2 className="auth__title">Formularz dodawania nowego klienta</h2>
            {this.props.authRegisterError}
            <Field
              type="text"
              label="Nazwa klienta"
              name="name"
              component={this.renderField}
            />
            <Field
              type="text"
              label="NIP"
              name="nip"
              component={this.renderField}
            />
            <Field
              type="text"
              label="E-mail"
              name="email"
              component={this.renderField}
            />
            <Field
              type="text"
              label="Telefon"
              name="tel"
              component={this.renderField}
            />
            <Field
              type="text"
              label="Ulica"
              name="road"
              component={this.renderField}
            />
            <Field
              type="text"
              label="Kod pocztowy"
              name="code"
              component={this.renderField}
            />
            <Field
              type="text"
              label="Miasto"
              name="city"
              component={this.renderField}
            />
            <Field
              type="text"
              label="Uwagi"
              name="comment"
              component={this.renderField}
            />
            <div className="formModal__btnGroup">
              <button className="auth__submit">Dodaj</button>
              <button
                type="button"
                onClick={this.closeClientModal.bind(this)}
                className="auth__submit formModal__btnClose"
              >
                Zamknij
              </button>
            </div>
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
          <Link to="/crm" className="auth__submit formModal__btnClose">
            Cofnij
          </Link>
        </div>
      );
    }
  }
}
function validate(values) {
  const errors = [];
  //TODO: Validacja formularza
  return errors;
}

const mapStateToProps = state => {
  return {
    authRegisterError: state.auth.authRegisterError,
    crmKey: state.auth.auth.crmKey,
    privileges: state.auth.auth.privileges
  };
};

export default reduxForm({
  validate,
  form: "authClientAddForm"
})(
  connect(
    mapStateToProps,
    { createCrmClient, onModalOff }
  )(ClientsRegisterModal)
);
