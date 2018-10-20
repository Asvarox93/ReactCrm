import { combineReducers } from "redux";
import { reducer as formReducer } from "redux-form";
import auth from "./authUser";

const rootReducer = combineReducers({
  auth,
  form: formReducer
});

const initialState = {
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
