import React, { Component } from "react";
import { Field, reduxForm } from "redux-form";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import _ from "lodash";
import { historyCrmOrder, onModalOff } from "../../action/index";

class OrderHistoryModal extends Component {
  renderField(field) {
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

  onFormSubmit(e) {
    const { history } = e;
    const {
      crmKey,
      crmOrder: { uid: orderKey }
    } = this.props;

    if (this.props.privileges.zlecenia) {
      this.props.historyCrmOrder(history, orderKey, crmKey, () => {
        this.closeOrderModal();
        alert("Działanie zostało dodane");
      });
    } else {
      alert("Nie masz uprawnień!");
    }
  }

  closeOrderModal() {
    this.props.onModalOff();
  }

  getCurrentHistory(history) {
    if (history) {
      const currentHistory = Object.entries(history).map(([key, value]) => {
        return (
          <div key={key} date={value.date}>
            <h6>
              Dodane przez: {value.user} w dniu {value.date}
            </h6>
            <p>{value.history}</p>
          </div>
        );
      });
      return currentHistory;
    }
    return;
  }

  render() {
    const {
      privileges,
      handleSubmit,
      crmOrder: { order: crmOrder }
    } = this.props;

    if (privileges.zlecenia === true) {
      return (
        <div className="formModal">
          <div>Historia działań</div>
          <div className="auth_history">
            {_.orderBy(
              this.getCurrentHistory(crmOrder.history),
              ["props.date"],
              ["asc"]
            )}
          </div>
          <form
            onSubmit={handleSubmit(this.onFormSubmit.bind(this))}
            className="auth__form"
          >
            <h2 className="auth__title">Dodaj działanie</h2>
            <Field
              type="textarea"
              label="Treść zlecenia"
              name="history"
              component={this.renderField}
            />
            <button className="auth__submit">Dodaj</button>
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
}
function validate(values) {
  const errors = [];
  //TODO: Validacja formularza
  return errors;
}

const mapStateToProps = state => {
  return {
    crmKey: state.auth.auth.crmKey,
    privileges: state.auth.auth.privileges,
    crmOrder: state.fetchTable.editOrder
  };
};

export default reduxForm({
  validate,
  form: "authOrderHistoryForm"
})(
  connect(
    mapStateToProps,
    { historyCrmOrder, onModalOff }
  )(OrderHistoryModal)
);
