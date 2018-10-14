import * as firebase from "firebase";

export const CREATE_USER_SUCCESS = "CREATE_USER_SUCCESS";
export const CREATE_USER_FAIL = "CREATE_USER_FAIL";
export const LOGIN_USER_SUCCESS = "LOGIN_USER_SUCCESS";
export const LOGIN_USER_FAIL = "LOGIN_USER_FAIL";

export const createUser = (email, pass, nickname, callback) => dispatch => {
  firebase
    .auth()
    .createUserWithEmailAndPassword(email, pass)
    .then(() => {
      const user = firebase.auth().currentUser;
      //TODO: do zrobienia przy weryfikacji Then i Catch.
      user.sendEmailVerification();
      user
        .updateProfile({
          displayName: nickname
        })
        .then(() => {
          firebase
            .database()
            .ref("users/" + user.uid)
            .set({
              username: user.displayName,
              email: user.email,
              role: "Admin"
            })
            .then(e => {
              console.log("success - User created with DB");
              return dispatch(createUserSuccess(user, callback));
            })
            .catch(error => {
              //TODO: Do przerobienia dispatch (jest on z tworzenia uzytkownia nie wysyłania maila weryfikującego).
              error => dispatch(createUserFail);
            });
        })
        .catch(function(error) {
          //TODO: Do przerobienia dispatch (jest on z tworzenia uzytkownia nie wysyłania maila weryfikującego).
          error => dispatch(createUserFail);
        });
    })
    .catch(error => dispatch(createUserFail));
};

export const createUserSuccess = (resp, callback) => dispatch => {
  callback();
  return {
    type: CREATE_USER_SUCCESS,
    user: resp
  };
};

//TODO: Odwołanmie z tego poniżej
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
      firebase
        .database()
        .ref("/users/" + resp.user.uid)
        .once("value")
        .then(function(snapshot) {
          const role = snapshot.val().role;
          return dispatch(loginUserSuccess({ ...resp, role }, callback));
        });
    })
    .catch(error => {
      dispatch(loginUserFail(error));
    });
};

export const loginUserSuccess = (resp, callback) => {
  callback();
  return {
    type: LOGIN_USER_SUCCESS,
    user: { ...resp }
  };
};

//TODO: Odwołanmie z tego poniżej
export const loginUserFail = error => {
  return {
    type: LOGIN_USER_FAIL,
    error
  };
};
