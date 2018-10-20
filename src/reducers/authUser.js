import initialState from "../reducers/index";
import {
  CREATE_USER_SUCCESS,
  CREATE_USER_FAIL,
  LOGIN_USER_SUCCESS,
  LOGIN_USER_FAIL,
  SIGN_OUT
} from "../action/index";

const auth = (state = [], action) => {
  let auth = "";

  switch (action.type) {
    case LOGIN_USER_SUCCESS:
      const user = action.user.user;
      auth = {
        uid: user.uid,
        role: action.user.role,
        crmKey: action.user.crmKey,
        privileges: action.user.privileges,
        nickname: user.displayName,
        email: user.email,
        emailVerified: user.emailVerified
      };
      return { ...state, loggedIn: true, auth };
    case LOGIN_USER_FAIL:
      return { ...state, loggedIn: false, authLoginError: action.error };
    case CREATE_USER_SUCCESS:
      const {
        user: { uid: userId }
      } = action;
      return { ...state, loggedIn: true, userId };
    case CREATE_USER_FAIL:
      return { ...state, loggedIn: false, authRegisterError: action.error };
    case SIGN_OUT:
      state = initialState;
      return state;
    default:
      return state;
  }
};

export default auth;
