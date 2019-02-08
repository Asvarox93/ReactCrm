import React, { Component } from "react";
import { Field, reduxForm } from "redux-form";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import _ from "lodash";
import { historyCrmOrder, onModalOff } from "../../action/index";

class OrderHistoryModal extends Component {
  renderField(field) {
    return (
      <div className="history__field">
        <textarea {...field.input} className="history__textarea" />
        <p className="history__errors">
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
            <p>{value.history}</p>
            <h6>
              Dodane przez: <span>{value.user}</span> w dniu{" "}
              <span>{value.date}</span>
            </h6>
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
        <div className="history">
          <div className="history__title">Historia działań</div>
          <div className="history__content">
            {_.orderBy(
              this.getCurrentHistory(crmOrder.history),
              ["props.date"],
              ["asc"]
            )}
          </div>
          <form
            onSubmit={handleSubmit(this.onFormSubmit.bind(this))}
            className="history__form"
          >
            <h2 className="history__title">Dodaj działanie</h2>
            <Field
              type="textarea"
              name="history"
              component={this.renderField}
            />
            <div className="history__btnGroup">
              <button className="auth__submit">Dodaj</button>
              <button
                type="button"
                onClick={this.closeOrderModal.bind(this)}
                className="auth__submit history__btnClose"
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
          <Link to="/crm" className="auth__submit history__addBtn--close">
            Cofnij
          </Link>
        </div>
      );
    }
  }
}
function validate(values) {
  const errors = [];
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
