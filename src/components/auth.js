import React, { Component } from "react";
import { connect } from "react-redux";
import { Field, reduxForm } from "redux-form";
import { Link } from "react-router-dom";
import { createUser } from "../action/index";

class Auth extends Component {
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

    this.props.createUser(email, password, () => {
      this.props.history.push("/crm");
    });
  }
  render() {
    const { handleSubmit } = this.props;

    return (
      <form
        onSubmit={handleSubmit(this.onFormSubmit.bind(this))}
        className="auth__form"
      >
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
    { createUser }
  )(Auth)
);
