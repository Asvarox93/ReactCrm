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
        <input
          {...field.input}
          type={field.type}
          placeholder={field.label}
          className="auth__input"
        />
        <p className="auth__errors">
          {field.meta.dirty ? field.meta.error : ""}
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
        this.setState({ isRegister: false });
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
          {this.state.isRegister ? "Rejestracja" : "Logowanie"}
        </h2>
        {this.state.isRegister
          ? this.props.authRegisterError
          : this.props.authLoginError}
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
          label="Hasło"
          name="password"
          component={this.renderField}
        />
        <button className="auth__submit">
          {this.state.isRegister ? "Zarejestruj" : "Zaloguj"}
        </button>
        <p className="auth__register">
          {this.state.isRegister
            ? "Posiadasz już konto?"
            : "Nie posiadasz konta?"}
        </p>
        <button
          className="auth__change"
          onClick={() => {
            this.setState({ isRegister: !this.state.isRegister });
          }}
        >
          {this.state.isRegister ? "Logowanie" : "Rejestracja"}
        </button>
        <Link to="/" className="auth__return">
          Cofnij
        </Link>
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
  if (values.password && values.password.length <= 3) {
    errors.password = "Hasło musi się składać z minimum 3 znaków!";
  }

  return errors;
}

const mapStateToProps = state => {
  return {
    authRegisterError: state.auth.authRegisterError,
    authLoginError: state.auth.authLoginError
  };
};

export default reduxForm({
  validate,
  form: "authForm"
})(
  connect(
    mapStateToProps,
    { createUser, loginUser }
  )(Auth)
);
