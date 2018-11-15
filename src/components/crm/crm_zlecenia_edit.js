import React, { Component } from "react";
import { Field, reduxForm } from "redux-form";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { editCrmOrder, getCrmUsers, onModalOff } from "../../action/index";

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
        <input
          {...field.input}
          disabled={field.disable ? true : null}
          type={field.type}
          className="auth__input"
        />
        <p className="auth__errors">
          {field.meta.touched ? field.meta.error : ""}
        </p>
      </div>
    );
  }

  onFormSubmit(e) {
    const { orderNote, status, worker } = e;
    const {
      crmKey,
      crmOrder: { uid: orderKey }
    } = this.props;

    if (this.props.privileges.zlecenia) {
      this.props.editCrmOrder(
        orderNote,
        status,
        worker,
        orderKey,
        crmKey,
        () => {
          this.closeOrderModal();
          alert("Zlecenie zostało zedytowane");
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
          <div>Formularz edycji zlecenia:</div>

          <form
            onSubmit={handleSubmit(this.onFormSubmit.bind(this))}
            className="auth__form"
          >
            <h2 className="auth__title">Formularz edycji zlecenia</h2>
            {this.props.authRegisterError}
            <Field
              type="text"
              label="Nazwa klienta"
              name="client"
              disable={true}
              component={this.renderField}
            />
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
            <button className="auth__submit">Edytuj</button>
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
    const {
      crmKey,
      crmOrder: { order }
    } = this.props;
    this.props.getCrmUsers(crmKey);
    this.props.initialize({
      client: order.client,
      orderNote: order.orderNote,
      status: order.status,
      worker: order.worker
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
    crmOrder: state.fetchTable.editOrder,
    crmUsers: state.fetchTable.crmUsers
  };
};

export default reduxForm({
  validate,
  form: "authOrderEditForm"
})(
  connect(
    mapStateToProps,
    { editCrmOrder, getCrmUsers, onModalOff }
  )(OrderRegisterModal)
);
