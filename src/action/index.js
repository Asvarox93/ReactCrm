import * as firebase from "firebase";

export const CREATE_USER_SUCCESS = "CREATE_USER_SUCCESS";
export const CREATE_USER_FAIL = "CREATE_USER_FAIL";
export const LOGIN_USER_SUCCESS = "LOGIN_USER_SUCCESS";
export const LOGIN_USER_FAIL = "LOGIN_USER_FAIL";
export const SIGN_OUT = "SIGN_OUT";

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
          createCrmID().then(crmId => {
            firebase
              .database()
              .ref("users/" + user.uid)
              .set({
                username: user.displayName,
                email: user.email,
                role: "Admin",
                crmKey: crmId,
                privileges: {
                  dashboard: true,
                  klienci: true,
                  pracownicy: true,
                  zlecenia: true
                }
              })
              .then(e => {
                firebase
                  .database()
                  .ref("crm/" + crmId)
                  .set({
                    owner: user.email
                  })
                  .then(() => {
                    dispatch(createUserSuccess(user));
                    callback();
                  })
                  .catch(error => {
                    //TODO: Do przerobienia dispatch (jest on z tworzenia uzytkownia nie wysyłania maila weryfikującego).
                    error => dispatch(createUserFail(error));
                  });
              })
              .catch(error => {
                //TODO: Do przerobienia dispatch (jest on z tworzenia uzytkownia nie wysyłania maila weryfikującego).
                error => dispatch(createUserFail(error));
              });
          });
        })
        .catch(function(error) {
          //TODO: Do przerobienia dispatch (jest on z tworzenia uzytkownia nie wysyłania maila weryfikującego).
          error => dispatch(createUserFail(error));
        });
    })
    .catch(error => dispatch(createUserFail(error)));
};

const createCrmID = (crypto = "", exist = true) => {
  crypto = window.crypto.getRandomValues(new Uint32Array(1))[0];
  const result = checkIfCrmIDExist(crypto).then(result => {
    return result;
  });

  return new Promise(function(resolve) {
    setTimeout(function() {
      resolve(result);
    }, 500);
  });
};

const checkIfCrmIDExist = crypto => {
  return firebase
    .database()
    .ref("crm/" + crypto.toString())
    .once("value")
    .then(snapshot => {
      if (snapshot.exists()) {
        crypto = window.crypto.getRandomValues(new Uint32Array(1))[0];
        return checkIfCrmIDExist(crypto);
      } else {
        return crypto;
      }
    });
};

export const createUserSuccess = resp => {
  return {
    type: CREATE_USER_SUCCESS,
    user: resp
  };
};

export const createUserFail = error => {
  //TODO: dorobienie ifów na error.code (na wzór z dokumentacji)
  if (error.code === "auth/email-already-in-use") {
    return {
      type: CREATE_USER_FAIL,
      error: "Ten adres email jest już używany przez inne konto."
    };
  }

  return {
    type: CREATE_USER_FAIL,
    error: error.message
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
          const privileges = snapshot.val().privileges;
          const crmKey = snapshot.val().crmKey;
          dispatch(loginUserSuccess({ ...resp, role, privileges, crmKey }));
          callback();
        });
    })
    .catch(error => {
      dispatch(loginUserFail(error));
    });
};

export const loginUserSuccess = resp => {
  return {
    type: LOGIN_USER_SUCCESS,
    user: { ...resp }
  };
};

export const loginUserFail = error => {
  //TODO: dorobienie ifów na error.code (na wzór z dokumentacji)
  if (error.code === "auth/user-not-found") {
    return {
      type: LOGIN_USER_FAIL,
      error: "Użytkownik nie istnieje lub hasło jest nieprawidłowe."
    };
  }

  return {
    type: LOGIN_USER_FAIL,
    error: error.message
  };
};

export const createCrmUser = (
  email,
  pass,
  nickname,
  privileges,
  crmKey
) => dispatch => {
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
              role: "Admin",
              crmKey: crmKey,
              privileges: {
                dashboard: privileges.dashboard,
                klienci: privileges.klienci,
                pracownicy: privileges.pracownicy,
                zlecenia: privileges.zlecenia
              }
            })
            .then(() => {
              dispatch(createUserSuccess(user));
            })
            .catch(error => {
              //TODO: Do przerobienia dispatch (jest on z tworzenia uzytkownia nie wysyłania maila weryfikującego).
              error => dispatch(createUserFail(error));
            });
        });
    })
    .catch(error => {
      //TODO: Do przerobienia dispatch (jest on z tworzenia uzytkownia nie wysyłania maila weryfikującego).
      error => dispatch(createUserFail(error));
    });
};

export const onSignOut = () => dispatch => {
  console.log("WYLOGOWANO");
  firebase
    .auth()
    .signOut()
    .then(() => {
      return dispatch({ type: SIGN_OUT });
    })
    .catch(error => {
      //TODO: odwołanie
      console.log(error);
    });
};
