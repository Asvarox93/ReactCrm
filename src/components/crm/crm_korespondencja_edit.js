import React, { Component } from "react";
import { Field, reduxForm } from "redux-form";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { editCrmMail, getCrmMails, onModalOff } from "../../action/index";

class MailEditModal extends Component {
  renderField(field) {
    if (field.type === "select") {
      return (
        <div className="auth__field formModal__field">
          <label className="auth__label">{field.label}</label>
          <select {...field.input} className="auth__select formModal__select">
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
    const { name, concern, date, type, form, comment } = e;
    const {
      crmKey,
      crmMail: { uid: mailKey }
    } = this.props;

    if (this.props.privileges.zlecenia) {
      this.props.editCrmMail(
        name,
        concern,
        date,
        type,
        form,
        comment,
        crmKey,
        mailKey,
        () => {
          this.closeMailModal();
          alert("Korespondencja została dodana");
        }
      );
    } else {
      alert("Nie masz uprawnień!");
    }
  }

  closeMailModal() {
    this.props.onModalOff();
  }

  render() {
    const { privileges, handleSubmit } = this.props;

    if (privileges.zlecenia === true) {
      return (
        <div className="formModal">
          <form
            onSubmit={handleSubmit(this.onFormSubmit.bind(this))}
            className="formModal__form"
          >
            <h2 className="auth__title">Formularz edycji zlecenia</h2>
            {this.props.authRegisterError}
            <Field
              type="text"
              label="Nadawca"
              name="name"
              component={this.renderField}
            />
            <Field
              type="text"
              label="Dotyczy"
              name="concern"
              component={this.renderField}
            />

            <Field
              type="select"
              label="Typ"
              name="type"
              component={this.renderField}
            >
              <option value="Przychodzące">Przychodzące</option>
              <option value="Wychodzace">Wychodzace</option>
            </Field>

            <Field
              type="select"
              label="Dostawca"
              name="form"
              component={this.renderField}
            >
              <option value="Kurier">Kurier</option>
              <option value="List priorytetowy">List priorytetowy</option>
              <option value="List ekonomiczny">List ekonomiczny</option>
              <option value="Paczka priorytetowa">Paczka priorytetowa</option>
              <option value="Paczka ekonomiczna">Paczka ekonomiczna</option>
            </Field>

            <Field
              type="date"
              label="Data dokumentu"
              name="date"
              component={this.renderField}
            />

            <Field
              type="text"
              label="Uwagi"
              name="comment"
              component={this.renderField}
            />
            <div className="formModal__btnGroup">
              <button className="auth__submit">Edytuj</button>
              <button
                type="button"
                onClick={this.closeMailModal.bind(this)}
                className="auth__submit formModal__btnClose"
              >
                Zamknij
              </button>
            </div>
          </form>
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
  componentDidMount() {
    const {
      crmMail: { mail }
    } = this.props;
    this.props.initialize({
      name: mail.name,
      concern: mail.concern,
      type: mail.type,
      form: mail.form,
      date: mail.date,
      comment: mail.comment
    });
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
    privileges: state.auth.auth.privileges,
    crmMail: state.fetchTable.editMail
  };
};

export default reduxForm({
  validate,
  form: "authMailEditForm"
})(
  connect(
    mapStateToProps,
    { editCrmMail, getCrmMails, onModalOff }
  )(MailEditModal)
);
