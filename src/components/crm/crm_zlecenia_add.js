import React, { Component } from "react";
import { Field, reduxForm } from "redux-form";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import {
  createCrmOrder,
  getCrmClients,
  getCrmUsers,
  onModalOff
} from "../../action/index";

class OrderRegisterModal extends Component {
  renderField(field) {
    if (field.type === "select") {
      return (
        <div className="auth__field">
          <label className="auth__label">{field.label}</label>
          <select {...field.input} className="auth__select">
            <option disabled>Wybierz</option>
            {field.children}
          </select>
          <p className="auth__errors">
            {field.meta.touched ? field.meta.error : ""}
          </p>
        </div>
      );
    }

    if (field.type === "textarea") {
      return (
        <div className="auth__field">
          <label className="auth__label">{field.label}</label>
          <textarea {...field.input} className="auth__textarea" />
          <p className="auth__errors">
            {field.meta.touched ? field.meta.error : ""}
          </p>
        </div>
      );
    }
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
    const { client, orderNote, status, worker } = e;
    const { crmKey } = this.props;
    const addedDate = new Date()
      .toJSON()
      .slice(0, 10)
      .replace(/-/g, "/");

    if (this.props.privileges.zlecenia) {
      this.props.createCrmOrder(
        client,
        addedDate,
        orderNote,
        status,
        worker,
        crmKey,
        () => {
          this.closeOrderModal();
          alert("Zlecenie zostało dodane");
        }
      );
    } else {
      alert("Nie masz uprawnień!");
    }
  }

  closeOrderModal() {
    this.props.onModalOff();
  }

  render() {
    const { privileges, handleSubmit, crmClients, crmUsers } = this.props;
    const statusOption = ["Przyjęte", "Realizacja", "Oczekuje", "Zakończone"];

    if (privileges.zlecenia === true) {
      return (
        <div className="formModal">
          <div>Formularz dodawania zlecenia:</div>

          <form
            onSubmit={handleSubmit(this.onFormSubmit.bind(this))}
            className="auth__form"
          >
            <h2 className="auth__title">Formularz dodawania nowego zlecenia</h2>
            {this.props.authRegisterError}
            <Field
              type="select"
              label="Nazwa klienta"
              name="client"
              component={this.renderField}
            >
              {Object.entries(crmClients).map(([key, value]) => {
                return (
                  <option key={key} value={value.name}>
                    {value.name}
                  </option>
                );
              })}
            </Field>
            <Field
              type="textarea"
              label="Treść zlecenia"
              name="orderNote"
              component={this.renderField}
            />
            <Field
              type="select"
              label="Status"
              name="status"
              component={this.renderField}
            >
              {statusOption.map(option => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </Field>
            <Field
              type="select"
              label="Pracownik"
              name="worker"
              component={this.renderField}
            >
              {Object.entries(crmUsers).map(([key, value]) => {
                return (
                  <option key={key} value={value.username}>
                    {value.username}
                  </option>
                );
              })}
            </Field>
            <button className="auth__submit">Dodaj</button>
            <button
              type="button"
              onClick={this.closeOrderModal.bind(this)}
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
  componentDidMount() {
    const crmKey = this.props.crmKey;
    this.props.getCrmClients(crmKey);
    this.props.getCrmUsers(crmKey);
    this.props.initialize({
      client: "Wybierz",
      status: "Wybierz",
      worker: "Wybierz"
    });
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
    privileges: state.auth.auth.privileges,
    crmClients: state.fetchTable.crmClients,
    crmUsers: state.fetchTable.crmUsers
  };
};

export default reduxForm({
  validate,
  form: "authOrderAddForm"
})(
  connect(
    mapStateToProps,
    { createCrmOrder, getCrmClients, getCrmUsers, onModalOff }
  )(OrderRegisterModal)
);