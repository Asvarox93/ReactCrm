import { combineReducers } from "redux";
import { reducer as formReducer } from "redux-form";
import auth from "./authUser";
import modal from "./modalBox";

const rootReducer = combineReducers({
  modal,
  auth,
  form: formReducer
});

const initialState = {
  modal: "",
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
  form: formReducer
};

export { initialState };
export default rootReducer;
