import React, { Component } from "react";
import { connect } from "react-redux";
import { Field, reduxForm } from "redux-form";
import { Link } from "react-router-dom";
import { createUser, loginUser } from "../action/index";

class Auth extends Component {
  constructor(props) {
    super(props);
    this.state = { isRegister: false };
  }

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

    if (!this.state.isRegister) {
      this.props.loginUser(email, password, () => {
        this.props.history.push("/crm");
      });
    }

    if (this.state.isRegister) {
      const nickname = e.nickname;
      this.props.createUser(email, password, nickname, () => {
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
          Formularz {this.state.isRegister ? "Rejestracyjny" : "Logowania"}
        </h2>
        <Field
          type="text"
          label="Nazwa"
          notRegister={!this.state.isRegister}
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
        <button className="auth__submit">
          {this.state.isRegister ? "Zarejestruj" : "Zaloguj"}
        </button>
        <Link to="/" className="auth__submit auth__submit--return">
          Cofnij
        </Link>
        <p className="auth__register">
          {this.state.isRegister
            ? "Jeśli chcesz się zalogować kliknij "
            : "Jeśli nie posiadasz konta kliknij "}
          <span
            onClick={() => {
              this.setState({ isRegister: !this.state.isRegister });
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

  if (!values.email) {
    errors.email = "Prosze o wprowadzenie poprawnego adresu e-mail!";
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
