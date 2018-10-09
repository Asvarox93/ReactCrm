import React, { Component } from "react";
import { connect } from "react-redux";
import { Field, reduxForm } from "redux-form";
import { Link } from "react-router-dom";
import { createUser, loginUser } from "../action/index";

class Auth extends Component {
  isRegister = false;

  renderField(field) {
    return (
      <div>
        <label className="auth__label">{field.label}</label>
        <input {...field.input} type={field.type} className="auth__field" />
        <p className="auth__errors">
          {field.meta.touched ? field.meta.error : ""}
        </p>
      </div>
    );
  }

  onFormSubmit(e) {
    const email = e.email;
    const password = e.password;

    if (!this.isRegister) {
      this.props.loginUser(email, password, () => {
        this.props.history.push("/crm");
      });
    }

    if (this.isRegister) {
      this.props.createUser(email, password, () => {
        this.props.history.push("/crm");
      });
    }
  }

  render() {
    const { handleSubmit } = this.props;

    return (
      <form
        onSubmit={handleSubmit(this.onFormSubmit.bind(this))}
        className="auth__form"
      >
        <h2 className="auth__title">
          Formularz {this.isRegister ? "Rejestracyjny" : "Logowania"}
        </h2>
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
        <button className="auth__submit">Zaloguj</button>
        <Link to="/" className="auth__submit auth__submit--return">
          Cofnij
        </Link>
        <p className="auth__register">
          Jeśli nie posiadasz konta kliknij{" "}
          <span
            onClick={() => {
              this.isRegister = !this.isRegister;
              this.forceUpdate();
            }}
          >
            TUTAJ!
          </span>
        </p>
      </form>
    );
  }
}

function validate(values) {
  const errors = {};

  if (!values.title) {
    errors.title = "Prosze o wprowadzenie poprawnego adresu e-mail!";
  }
  if (!values.password) {
    errors.password = "Prosze o wprowadzenie poprawnego hasła!";
  }
  if (values.password && values.password.length < 3) {
    errors.password = "Hasło musi się składać z minimum 3 znaków!";
  }

  return errors;
}

export default reduxForm({
  validate,
  form: "authForm"
})(
  connect(
    null,
    { createUser, loginUser }
  )(Auth)
);
