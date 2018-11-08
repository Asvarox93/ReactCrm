import {
  GET_CRM_USERS_SUCCESS,
  SET_USER_TO_EDIT,
  GET_CRM_CLIENTS_SUCCESS,
  SET_CLIENT_TO_EDIT
} from "../action/index";

const fetchTable = (state = [], action) => {
  switch (action.type) {
    case GET_CRM_USERS_SUCCESS:
      const crmUsers = action.crmUsers;
      return { ...state, crmUsers };
    case SET_USER_TO_EDIT:
      const editUser = action.editUser;
      return { ...state, editUser };
    case GET_CRM_CLIENTS_SUCCESS:
      const crmClients = action.crmClients;
      return { ...state, crmClients };
    case SET_CLIENT_TO_EDIT:
      const editClient = action.editClient;
      return { ...state, editClient };
    default:
      return state;
  }
};

export default fetchTable;
