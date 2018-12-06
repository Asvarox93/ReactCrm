import React, { Component } from "react";
import { Field, reduxForm } from "redux-form";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { editCrmUser, onModalOff } from "../../action/index";

class UserEditModal extends Component {
  renderField(field) {
    if (field.type === "checkbox") {
      return (
        <div className="auth__field">
          <label className="auth__label">{field.label}</label>
          <input
            {...field.input}
            type={field.type}
            checked={field.input.value ? true : false}
            className="auth__input"
          />
          <p className="auth__errors">
            {field.meta.touched ? field.meta.error : ""}
          </p>
        </div>
      );
    } else {
      return (
        <div className="auth__field">
          <label className="auth__label">{field.label}</label>
          <input
            {...field.input}
            type={field.type}
            placeholder={field.disabled ? "*******" : ""}
            disabled={field.disabled ? true : false}
            className="auth__input"
          />
          <p className="auth__errors">
            {field.meta.touched ? field.meta.error : ""}
          </p>
        </div>
      );
    }
  }

  onFormSubmit(e) {
    const nickname = e.nickname;
    const privileges = {
      pracownicy: e.pracownicy ? e.pracownicy : false,
      zlecenia: e.zlecenia ? e.zlecenia : false,
      klienci: e.klienci ? e.klienci : false,
      korespondencja: e.korespondencja ? e.korespondencja : false,
      umowy: e.umowy ? e.umowy : false
    };
    const { crmKey } = this.props;
    const { uid: userUid } = this.props.editUser;

    if (this.props.privileges.pracownicy) {
      this.props.editCrmUser(nickname, privileges, userUid, crmKey, () => {
        this.closeRegisterModal();
        alert("Pracownik został zedytowany!");
      });
    } else {
      alert("Nie masz uprawnień!");
    }
  }

  closeRegisterModal() {
    this.props.onModalOff();
  }

  render() {
    const { privileges, handleSubmit } = this.props;
    console.log("EDYCJA");
    if (privileges.pracownicy === true) {
      return (
        <div className="formModal">
          <div>Formularz Edycji Pracownika:</div>

          <form
            onSubmit={handleSubmit(this.onFormSubmit.bind(this))}
            className="auth__form"
          >
            <h2 className="auth__title">Formularz edycji pracownika</h2>
            {this.props.dataError}
            <Field
              type="text"
              label="Imie i nazwisko"
              name="nickname"
              component={this.renderField}
            />
            <Field
              type="text"
              label="E-mail"
              name="email"
              disabled={true}
              component={this.renderField}
            />
            <Field
              type="password"
              label="Password"
              name="password"
              disabled={true}
              component={this.renderField}
            />
            <h3>Uprawnienia:</h3>
            <Field
              name="klienci"
              label="klienci"
              type="checkbox"
              component={this.renderField}
            />
            <Field
              name="zlecenia"
              label="zlecenia"
              type="checkbox"
              component={this.renderField}
            />
            <Field
              name="pracownicy"
              label="pracownicy"
              type="checkbox"
              component={this.renderField}
            />
            <Field
              name="korespondencja"
              label="korespondencja"
              type="checkbox"
              component={this.renderField}
            />
            <Field
              name="umowy"
              label="umowy"
              type="checkbox"
              component={this.renderField}
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
    const { editUser } = this.props;
    this.props.initialize({
      nickname: editUser.user.username,
      email: editUser.user.email,
      klienci: editUser.user.privileges.klienci,
      zlecenia: editUser.user.privileges.zlecenia,
      pracownicy: editUser.user.privileges.pracownicy
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
    editUser: state.fetchTable.editUser,
    dataError: state.auth.dataError,
    crmKey: state.auth.auth.crmKey,
    role: state.auth.auth.role,
    privileges: state.auth.auth.privileges
  };
};

export default reduxForm({
  validate,
  form: "authEditUserForm"
})(
  connect(
    mapStateToProps,
    { editCrmUser, onModalOff }
  )(UserEditModal)
);
