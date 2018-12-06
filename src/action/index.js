import * as firebase from "firebase";
import axios from "axios";
import _ from "lodash";

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
export const GET_CRM_ORDERS_SUCCESS = "GET_CRM_ORDERS_SUCCESS";
export const SET_ORDER_TO_EDIT = "SET_ORDER_TO_EDIT";
export const HIDE_CLOSED_ORDER_TOGGLE = "HIDE_CLOSED_ORDER_TOGGLE";
export const SEARCH_ORDER = "SEARCH_ORDER";
export const SEARCH_CLIENT = "SEARCH_CLIENT";
export const SEARCH_WORKER = "SEARCH_WORKER";

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
        zlecenia: privileges.zlecenia,
        korespondencja: privileges.korespondencja,
        umowy: privileges.umowy
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
    .ref("crm/" + crmKey + "/klienci/" + crypto.toString())
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

//  ==========Zlecenia==========

export const createCrmOrder = (
  client,
  addedDate,
  orderNote,
  status,
  worker,
  crmKey,
  callback
) => dispatch => {
  createCrmOrderID(crmKey)
    .then(orderId => {
      firebase
        .database()
        .ref("crm/" + crmKey + "/zlecenia/" + orderId)
        .set({
          client,
          addedDate,
          orderNote,
          status,
          worker
        })
        .then(() => {
          // dispatch(createSuccess(user));
          dispatch(getCrmOrders(crmKey));
          callback();
        })
        .catch(error => {
          console.log("OrderADD: ", error);
          //TODO: Do przerobienia dispatch
          //  dispatch(createUserFail(error));
        });
    })
    .catch(error => {
      //TODO: Do zrobieniaw wyjątek
    });
};

const createCrmOrderID = (crmKey, crypto = "") => {
  crypto = window.crypto.getRandomValues(new Uint32Array(1))[0];
  const result = checkIfCrmOrderExist(crmKey, crypto).then(result => {
    return result;
  });

  return new Promise(function(resolve) {
    setTimeout(function() {
      resolve(result);
    }, 500);
  });
};

const checkIfCrmOrderExist = (crmKey, crypto) => {
  return firebase
    .database()
    .ref("crm/" + crmKey + "/zlecenia/" + crypto.toString())
    .once("value")
    .then(snapshot => {
      if (snapshot.exists()) {
        crypto = window.crypto.getRandomValues(new Uint32Array(1))[0];
        return checkIfCrmOrderExist(crmKey, crypto);
      } else {
        return crypto;
      }
    });
};

export const closeCrmOrder = (crmKey, orderKey) => dispatch => {
  firebase
    .database()
    .ref("crm/" + crmKey + "/zlecenia/" + orderKey)
    .update({
      status: "zamknięte"
    })
    .then(() => {
      alert("Zlecenie zostało zamknięte!");
      dispatch(getCrmOrders(crmKey));
    });
};

export const setOrderToEdit = order => {
  return {
    type: SET_ORDER_TO_EDIT,
    editOrder: order
  };
};

export const editCrmOrder = (
  orderNote,
  status,
  worker,
  orderKey,
  crmKey,
  callback
) => dispatch => {
  firebase
    .database()
    .ref("crm/" + crmKey + "/zlecenia/" + orderKey)
    .update({
      orderNote,
      status,
      worker
    })
    .then(() => {
      // dispatch(createSuccess(user));
      dispatch(getCrmOrders(crmKey));
      callback();
    })
    .catch(error => {
      console.log("OrderEdit: ", error);
      //TODO: Do przerobienia dispatch
      //  dispatch(createUserFail(error));
    });
};

export const historyCrmOrder = (
  history,
  orderKey,
  crmKey,
  callback
) => dispatch => {
  const user = firebase.auth().currentUser;
  createCrmOrderHistoryID(crmKey, orderKey).then(historyId => {
    firebase
      .database()
      .ref("crm/" + crmKey + "/zlecenia/" + orderKey + "/history/" + historyId)
      .set({
        user: user.displayName,
        date: new Date()
          .toJSON()
          .slice(0, 10)
          .replace(/-/g, "/"),
        history
      })
      .then(() => {
        // dispatch(createSuccess(user));
        dispatch(getCrmOrders(crmKey));
        callback();
      })
      .catch(error => {
        console.log("OrderEdit: ", error);
        //TODO: Do przerobienia dispatch
        //  dispatch(createUserFail(error));
      });
  });
};

const createCrmOrderHistoryID = (crmKey, orderKey, crypto = "") => {
  crypto = window.crypto.getRandomValues(new Uint32Array(1))[0];
  const result = checkIfCrmOrderHistoryExist(crmKey, orderKey, crypto).then(
    result => {
      return result;
    }
  );

  return new Promise(function(resolve) {
    setTimeout(function() {
      resolve(result);
    }, 500);
  });
};

const checkIfCrmOrderHistoryExist = (crmKey, orderKey, crypto) => {
  return firebase
    .database()
    .ref(
      "crm/" +
        crmKey +
        "/zlecenia/" +
        orderKey +
        "/history/" +
        crypto.toString()
    )
    .once("value")
    .then(snapshot => {
      if (snapshot.exists()) {
        crypto = window.crypto.getRandomValues(new Uint32Array(1))[0];
        return checkIfCrmOrderHistoryExist(crmKey, orderKey, crypto);
      } else {
        return crypto;
      }
    });
};

export const getCrmOrders = crmKey => dispatch => {
  firebase
    .database()
    .ref("crm/" + crmKey + "/zlecenia")
    .once("value", snapshot => {
      let arr = Object.entries(snapshot.val()).map(e =>
        Object.assign(e[1], { key: e[0] })
      );
      const orderFilter = _.orderBy(arr, ["addedDate"], ["desc"]);
      dispatch(getCrmOrdersSuccess(orderFilter));
    });
};

export const getCrmOrdersByDataFilter = (crmOrders, filter) => dispatch => {
  let orderFilter = "";

  if (filter === "asc") {
    orderFilter = _.orderBy(crmOrders, ["addedDate"], ["asc"]);
  }
  if (filter === "desc") {
    orderFilter = _.orderBy(crmOrders, ["addedDate"], ["desc"]);
  }

  dispatch(getCrmOrdersSuccess(orderFilter));
};

export const getCrmOrdersSuccess = resp => {
  return {
    type: GET_CRM_ORDERS_SUCCESS,
    crmOrders: { ...resp }
  };
};

export const searchOrdersByClients = arg => {
  return {
    type: SEARCH_ORDER,
    searchOrders: arg
  };
};

export const searchClientByName = arg => {
  return {
    type: SEARCH_CLIENT,
    searchClients: arg
  };
};

export const searchWorkerByName = arg => {
  return {
    type: SEARCH_WORKER,
    searchWorkers: arg
  };
};

export const hideClosedOrders = arg => {
  return {
    type: HIDE_CLOSED_ORDER_TOGGLE,
    hideClosedOrders: arg
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
