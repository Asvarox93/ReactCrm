import { combineReducers } from "redux";
import { reducer as formReducer } from "redux-form";
import auth from "./authUser";
import modal from "./modalBox";
import fetchTable from "./fetchTables";
import { SIGN_OUT } from "../action/index";

const rootReducer = combineReducers({
  modal,
  auth,
  fetchTable,
  form: formReducer
});

const initialState = {
  modal: {
    active: false,
    type: ""
  },
  auth: {
    auth: {
      privileges: {
        dashboard: false,
        klienci: false,
        pracownicy: false,
        zlecenia: false,
        korespondencja: false,
        umowy: false
      }
    }
  },
  fetchTable: {
    crmUsers: "",
    editUser: "",
    crmClients: "",
    editClient: "",
    crmOrders: "",
    crmMails: "",
    editMail: "",
    crmContracts: "",
    editContract: "",
    searchOrders: "",
    searchClients: "",
    searchWorkers: "",
    searchMails: "",
    searchContracts: "",
    hideClosedOrders: false,
    editOrder: {
      history: ""
    }
  },
  form: formReducer
};

const allReducer = (state, action) => {
  if (action.type === SIGN_OUT) {
    state = initialState;
  }
  return rootReducer(state, action);
};

export { initialState };
export default allReducer;
