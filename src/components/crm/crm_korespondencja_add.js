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
    const { name, concern, date, type, form, comment, attachment } = e;
    const { crmKey } = this.props;

    if (this.props.privileges.korespondencja) {
      this.props.createCrmMail(
        name,
        concern,
        date,
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
          <form
            onSubmit={handleSubmit(this.onFormSubmit.bind(this))}
            className="formModal__form"
          >
            <h2 className="auth__title">
              Formularz dodawania nowej korespondencji
            </h2>
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
                      <p className="formModal__plikDrag">
                        Przeciągnij plik tutaj...
                      </p>
                    ) : (
                      <p className="formModal__plik">
                        Przeciągnąć plik w to miejsce, lub kliknij na mnie aby
                        wybrać ręcznie.
                      </p>
                    )}
                  </div>
                );
              }}
            </Dropzone>
            <h4 className="formModal__plik">Plik:</h4>
            {file}
            <div className="formModal__btnGroup">
              <button className="auth__submit">Dodaj</button>
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
    const dateObj = new Date();
    const month = dateObj.getUTCMonth() + 1;
    const day = dateObj.getUTCDate();
    const year = dateObj.getUTCFullYear();
    const newdate = year + "-" + month + "-" + day;

    this.props.initialize({
      type: "Przychodzące",
      form: "Kurier",
      date: newdate
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
