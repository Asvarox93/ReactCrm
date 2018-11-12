import {
  GET_CRM_USERS_SUCCESS,
  SET_USER_TO_EDIT,
  GET_CRM_CLIENTS_SUCCESS,
  SET_CLIENT_TO_EDIT,
  GET_CRM_ORDERS_SUCCESS,
  SET_ORDER_TO_EDIT
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
    case GET_CRM_ORDERS_SUCCESS:
      const crmOrders = action.crmOrders;
      return { ...state, crmOrders };
    case SET_ORDER_TO_EDIT:
      const editOrder = action.editOrder;
      return { ...state, editOrder };
    default:
      return state;
  }
};

export default fetchTable;
