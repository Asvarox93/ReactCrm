import { combineReducers } from "redux";
import { reducer as formReducer } from "redux-form";
import auth from "./authUser";
import modal from "./modalBox";
import fetchTable from "./fetchTables";

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
        zlecenia: false
      }
    }
  },
  fetchTable: {
    crmUsers: "",
    editUser: "",
    crmClients: "",
    editClient: "",
    crmOrders: "",
    editOrder: ""
  },
  form: formReducer
};

export { initialState };
export default rootReducer;
