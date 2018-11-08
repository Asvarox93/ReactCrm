import * as firebase from "firebase";
import axios from "axios";

export const CREATE_USER_SUCCESS = "CREATE_USER_SUCCESS";
export const CREATE_USER_FAIL = "CREATE_USER_FAIL";
export const LOGIN_USER_SUCCESS = "LOGIN_USER_SUCCESS";
export const LOGIN_USER_FAIL = "LOGIN_USER_FAIL";
export const SIGN_OUT = "SIGN_OUT";
export const ADD_MODAL_ACTIVE = "ADD_MODAL_ACTIVE";
export const ADD_MODAL_OFF = "ADD_MODAL_OFF";
export const GET_CRM_USERS_SUCCESS = "GET_CRM_USERS_SUCCESS";
export const SET_USER_TO_EDIT = "SET_USER_TO_EDIT";
export const GET_CRM_CLIENTS_SUCCESS = "GET_CRM_CLIENTS_SUCCESS";
export const SET_CLIENT_TO_EDIT = "SET_CLIENT_TO_EDIT";

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
                    dispatch(createUserFail(error));
                  });
              })
              .catch(error => {
                //TODO: Do przerobienia dispatch (jest on z tworzenia uzytkownia nie wysyłania maila weryfikującego).
                dispatch(createUserFail(error));
              });
          });
        })
        .catch(error => {
          //TODO: Do przerobienia dispatch (jest on z tworzenia uzytkownia nie wysyłania maila weryfikującego).
          dispatch(createUserFail(error));
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

// ==========Pracownicy==========

export const createCrmUser = (
  email,
  pass,
  nickname,
  privileges,
  crmKey,
  callback
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
              role: "User",
              crmKey: crmKey,
              privileges: {
                dashboard: true,
                klienci: privileges.klienci,
                pracownicy: privileges.pracownicy,
                zlecenia: privileges.zlecenia
              }
            })
            .then(() => {
              dispatch(createUserSuccess(user));
              dispatch(getCrmUsers(crmKey));
              callback();
            })
            .catch(error => {
              //TODO: Do przerobienia dispatch (jest on z tworzenia uzytkownia nie wysyłania maila weryfikującego).
              dispatch(createUserFail(error));
            });
        });
    })
    .catch(error => {
      //TODO: Do przerobienia dispatch (jest on z tworzenia uzytkownia nie wysyłania maila weryfikującego).
      dispatch(createUserFail(error));
    });
};

export const editCrmUser = (
  nickname,
  privileges,
  userUid,
  crmKey,
  callback
) => dispatch => {
  firebase
    .database()
    .ref("users/" + userUid)
    .update({
      username: nickname,
      privileges: {
        dashboard: true,
        klienci: privileges.klienci,
        pracownicy: privileges.pracownicy,
        zlecenia: privileges.zlecenia
      }
    })
    .then(() => {
      dispatch(getCrmUsers(crmKey));
      callback();
    });
  //TODO: update danych w bazie i ewentualnie w użytkowniku przez cloud functions.
  return;
};

export const deleteCrmUser = (userUid, crmKey) => dispatch => {
  axios
    .post("https://us-central1-reactcrm-2477b.cloudfunctions.net/deleteUser", {
      uid: userUid
    })
    .then(r => {
      if (r.status === 200) {
        firebase
          .database()
          .ref("users/" + userUid)
          .set(null, e => {
            alert("Pracownik został usunięty!");
            dispatch(getCrmUsers(crmKey));
          });
      }
    })
    .catch(err => {
      //TODO: catch err
    });
  return;
};

export const getCrmUsers = crm => dispatch => {
  firebase
    .database()
    .ref("users")
    .orderByChild("crmKey")
    .equalTo(crm)
    .once("value", snapshot => {
      console.log("getCrmUsersVal: ", snapshot.val());
      dispatch(getCrmUsersSuccess(snapshot.val()));
    });
};

export const getCrmUsersSuccess = resp => {
  return {
    type: GET_CRM_USERS_SUCCESS,
    crmUsers: { ...resp }
  };
};

export const setUserToEdit = user => {
  return {
    type: SET_USER_TO_EDIT,
    editUser: user
  };
};

//  ==========Klienci==========

export const createCrmClient = (
  name,
  nip,
  email,
  tel,
  road,
  code,
  city,
  comment,
  crmKey,
  callback
) => dispatch => {
  createCrmClientID(crmKey)
    .then(clientId => {
      firebase
        .database()
        .ref("crm/" + crmKey + "/klienci/" + clientId)
        .set({
          clientId,
          name,
          nip,
          email,
          tel,
          road,
          code,
          city,
          comment
        })
        .then(() => {
          // dispatch(createSuccess(user));
          dispatch(getCrmClients(crmKey));
          callback();
        })
        .catch(error => {
          console.log("KlientADD: ", error);
          //TODO: Do przerobienia dispatch
          //  dispatch(createUserFail(error));
        });
    })
    .catch(error => {
      //TODO: Do zrobieniaw wyjątek
    });
};

const createCrmClientID = (crmKey, crypto = "") => {
  crypto = window.crypto.getRandomValues(new Uint32Array(1))[0];
  const result = checkIfCrmClientExist(crmKey, crypto).then(result => {
    return result;
  });

  return new Promise(function(resolve) {
    setTimeout(function() {
      resolve(result);
    }, 500);
  });
};

const checkIfCrmClientExist = (crmKey, crypto) => {
  return firebase
    .database()
    .ref("crm/" + crmKey + crypto.toString())
    .once("value")
    .then(snapshot => {
      if (snapshot.exists()) {
        crypto = window.crypto.getRandomValues(new Uint32Array(1))[0];
        return checkIfCrmClientExist(crmKey, crypto);
      } else {
        return crypto;
      }
    });
};

export const deleteCrmClient = (crmKey, clientKey) => dispatch => {
  firebase
    .database()
    .ref("crm/" + crmKey + "/klienci/" + clientKey)
    .set(null, e => {
      alert("Klient został usunięty!");
      dispatch(getCrmClients(crmKey));
    });
};

export const setClientToEdit = client => {
  return {
    type: SET_CLIENT_TO_EDIT,
    editClient: client
  };
};

export const editCrmClient = (
  name,
  nip,
  email,
  tel,
  road,
  code,
  city,
  comment,
  crmKey,
  clientKey,
  callback
) => dispatch => {
  console.log("KlientEdit: ", clientKey);
  firebase
    .database()
    .ref("crm/" + crmKey + "/klienci/" + clientKey)
    .set({
      name,
      nip,
      email,
      tel,
      road,
      code,
      city,
      comment
    })
    .then(() => {
      // dispatch(createSuccess(user));
      dispatch(getCrmClients(crmKey));
      callback();
    })
    .catch(error => {
      console.log("ClientEdit: ", error);
      //TODO: Do przerobienia dispatch
      //  dispatch(createUserFail(error));
    });
};

export const getCrmClients = crmKey => dispatch => {
  firebase
    .database()
    .ref("crm/" + crmKey + "/klienci")
    .once("value", snapshot => {
      console.log("getCrmClientsVal: ", snapshot.val());
      dispatch(getCrmClientsSuccess(snapshot.val()));
    });
};

export const getCrmClientsSuccess = resp => {
  return {
    type: GET_CRM_CLIENTS_SUCCESS,
    crmClients: { ...resp }
  };
};

//  ==========Modal==========

export const onModalShow = arg => {
  return {
    type: ADD_MODAL_ACTIVE,
    modal: { active: true, type: arg }
  };
};

export const onModalOff = () => {
  return {
    type: ADD_MODAL_OFF,
    modal: { active: false, type: "" }
  };
};
