import React, { Component } from "react";
import { Field, reduxForm, change } from "redux-form";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import Dropzone from "react-dropzone";
import classNames from "classnames";
import { createCrmMail, onModalOff } from "../../action/index";

class MailRegisterModal extends Component {
  constructor() {
    super();
    this.state = {
      file: []
    };
  }

  renderField(field) {
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
    const { name, concern, type, form, comment, attachment } = e;
    const { crmKey } = this.props;

    console.log("cale e:", e);

    if (this.props.privileges.korespondencja) {
      this.props.createCrmMail(
        name,
        concern,
        type,
        form,
        comment,
        attachment,
        crmKey,
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

  onDrop(file) {
    this.setState({ file });
    this.props.dispatch(change("authMailAddForm", "attachment", file[0]));
  }
  onCancel() {
    this.setState({
      file: []
    });
  }

  render() {
    const { privileges, handleSubmit } = this.props;

    const file = this.state.file.map(file => (
      <p key={file.name}>
        {file.name} - {file.size} bytes
      </p>
    ));

    if (privileges.korespondencja === true) {
      return (
        <div className="formModal">
          <div>Formularz dodawania Korespondencji:</div>

          <form
            onSubmit={handleSubmit(this.onFormSubmit.bind(this))}
            className="auth__form"
          >
            <h2 className="auth__title">
              Formularz dodawania nowej korespondencji
            </h2>
            {this.props.authRegisterError}
            <Field
              type="text"
              label="Nazwa"
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
              type="text"
              label="Typ"
              name="type"
              component={this.renderField}
            />
            <Field
              type="text"
              label="Forma"
              name="form"
              component={this.renderField}
            />
            <Field
              type="text"
              label="Uwagi"
              name="comment"
              component={this.renderField}
            />

            <Field name="attachment" component="input" type="hidden" />

            <Dropzone
              ref="dropzone"
              onDrop={this.onDrop.bind(this)}
              onFileDialogCancel={this.onCancel.bind(this)}
              multiple={false}
              accept=".doc,.pdf,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            >
              {({ getRootProps, getInputProps, isDragActive }) => {
                return (
                  <div
                    {...getRootProps()}
                    className={classNames("dropzone", {
                      "dropzone--isActive": isDragActive
                    })}
                  >
                    <input {...getInputProps()} />
                    {isDragActive ? (
                      <p>Przeciągnij plik tutaj...</p>
                    ) : (
                      <p>
                        Przeciągnąć plik w to miejsce, lub kliknij na mnie aby
                        wybrać ręcznie.
                      </p>
                    )}
                  </div>
                );
              }}
            </Dropzone>
            <h4>Plik:</h4>
            {file}

            <button className="auth__submit">Dodaj</button>
            <button
              type="button"
              onClick={this.closeMailModal.bind(this)}
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
  form: "authMailAddForm"
})(
  connect(
    mapStateToProps,
    { createCrmMail, onModalOff }
  )(MailRegisterModal)
);
