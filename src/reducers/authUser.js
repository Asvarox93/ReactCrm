import {
  CREATE_USER_SUCCESS,
  CREATE_USER_FAIL,
  LOGIN_USER_SUCCESS,
  LOGIN_USER_FAIL
} from "../action/index";

const auth = (state = [], action) => {
  switch (action.type) {
    case LOGIN_USER_SUCCESS:
      const userIds = action.user.uid;
      return { ...state, loggedIn: true, userIds };
    case LOGIN_USER_FAIL:
      return { ...state, loggedIn: false };
    case CREATE_USER_SUCCESS:
      const {
        user: { uid: userId }
      } = action;
      return { ...state, loggedIn: true, userId };
    case CREATE_USER_FAIL:
      const { error } = action;
      return { ...state, loggedIn: false, error };
    default:
      return state;
  }
};

export default auth;
