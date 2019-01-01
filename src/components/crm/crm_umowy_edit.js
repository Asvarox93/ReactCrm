import React, { Component } from "react";
import { Field, reduxForm } from "redux-form";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import {
  editCrmContract,
  getCrmContracts,
  onModalOff
} from "../../action/index";

class ContractEditModal extends Component {
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
    const { name, contractDate, deadlineDate, type, comment } = e;
    const {
      crmKey,
      crmContract: { uid: contractKey }
    } = this.props;

    if (this.props.privileges.zlecenia) {
      this.props.editCrmContract(
        name,
        contractDate,
        deadlineDate,
        type,
        comment,
        crmKey,
        contractKey,
        () => {
          this.closeContractModal();
          alert("Umowa/Ofera została zmieniona");
        }
      );
    } else {
      alert("Nie masz uprawnień!");
    }
  }

  closeContractModal() {
    this.props.onModalOff();
  }

  render() {
    const { privileges, handleSubmit } = this.props;

    if (privileges.umowy === true) {
      return (
        <div className="formModal">
          <div>Formularz edycji Umowy/Oferty:</div>

          <form
            onSubmit={handleSubmit(this.onFormSubmit.bind(this))}
            className="auth__form"
          >
            <h2 className="auth__title">Formularz edycji Umowy/Oferty</h2>
            {this.props.authRegisterError}
            <Field
              type="text"
              label="Kontrahent"
              name="name"
              component={this.renderField}
            />

            <Field
              type="date"
              label="Data zawarcia umowy"
              name="contractDate"
              component={this.renderField}
            />

            <Field
              type="date"
              label="Termin ralizacji"
              name="deadlineDate"
              component={this.renderField}
            />

            <Field
              type="select"
              label="Typ"
              name="type"
              component={this.renderField}
            >
              <option value="Przetarg">Przetarg</option>
              <option value="Oferta">Oferta</option>
            </Field>

            <Field
              type="text"
              label="Uwagi"
              name="comment"
              component={this.renderField}
            />

            <button className="auth__submit">Edytuj</button>
            <button
              type="button"
              onClick={this.closeContractModal.bind(this)}
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
      crmContract: { contract }
    } = this.props;
    this.props.initialize({
      name: contract.name,
      contractDate: contract.contractDate,
      deadlineDate: contract.deadlineDate,
      type: contract.type,
      comment: contract.comment
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
    crmContract: state.fetchTable.editContract
  };
};

export default reduxForm({
  validate,
  form: "authContractEditForm"
})(
  connect(
    mapStateToProps,
    { editCrmContract, getCrmContracts, onModalOff }
  )(ContractEditModal)
);
