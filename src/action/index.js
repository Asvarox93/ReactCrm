import * as firebase from "firebase";

export const CREATE_USER_SUCCESS = "CREATE_USER_SUCCESS";
export const CREATE_USER_FAIL = "CREATE_USER_FAIL";
export const LOGIN_USER_SUCCESS = "LOGIN_USER_SUCCESS";
export const LOGIN_USER_FAIL = "LOGIN_USER_FAIL";

export const createUser = (email, pass, callback) => dispatch => {
  firebase
    .auth()
    .createUserWithEmailAndPassword(email, pass)
    .then(resp => {
      return dispatch(createUserSuccess(resp, callback));
    })
    .catch(error => dispatch(createUserFail));
};

export const createUserSuccess = (resp, callback) => dispatch => {
  const user = firebase.auth().currentUser;
  user
    .sendEmailVerification()
    .then(function() {
      callback();
    })
    .catch(function(error) {
      //TODO: Do przerobienia dispatch.
      error => dispatch(createUserFail);
    });

  return {
    type: CREATE_USER_SUCCESS,
    user: resp
  };
};
export const createUserFail = error => {
  return {
    type: CREATE_USER_FAIL,
    error
  };
};

export const loginUser = (email, pass, callback) => dispatch => {
  firebase
    .auth()
    .signInWithEmailAndPassword(email, pass)
    .then(resp => {
      return dispatch(loginUserSuccess(resp, callback));
    })
    .catch(error => {
      dispatch(loginUserFail);
    });
};

export const loginUserSuccess = (resp, callback) => {
  callback();
  return {
    type: LOGIN_USER_SUCCESS,
    user: resp
  };
};

export const loginUserFail = error => {
  return {
    type: LOGIN_USER_FAIL,
    error
  };
};
