import {
  GET_CRM_USERS_SUCCESS,
  SET_USER_TO_EDIT,
  GET_CRM_CLIENTS_SUCCESS,
  SET_CLIENT_TO_EDIT,
  GET_CRM_ORDERS_SUCCESS,
  SET_ORDER_TO_EDIT,
  GET_CRM_MAILS_SUCCESS,
  SET_MAIL_TO_EDIT,
  GET_CRM_CONTRACTS_SUCCESS,
  SET_CONTRACT_TO_EDIT,
  HIDE_CLOSED_ORDER_TOGGLE,
  SEARCH_ORDER,
  SEARCH_CLIENT,
  SEARCH_WORKER,
  SEARCH_MAILS,
  SEARCH_CONTRACTS
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
    case GET_CRM_MAILS_SUCCESS:
      const crmMails = action.crmMails;
      return { ...state, crmMails };
    case SET_MAIL_TO_EDIT:
      const editMail = action.editMail;
      return { ...state, editMail };
    case GET_CRM_CONTRACTS_SUCCESS:
      const crmContracts = action.crmContracts;
      return { ...state, crmContracts };
    case SET_CONTRACT_TO_EDIT:
      const editContract = action.editContract;
      return { ...state, editContract };
    case HIDE_CLOSED_ORDER_TOGGLE:
      const hideClosedOrders = action.hideClosedOrders;
      return { ...state, hideClosedOrders };
    case SEARCH_ORDER:
      const searchOrders = action.searchOrders;
      return { ...state, searchOrders };
    case SEARCH_CLIENT:
      const searchClients = action.searchClients;
      return { ...state, searchClients };
    case SEARCH_WORKER:
      const searchWorkers = action.searchWorkers;
      return { ...state, searchWorkers };
    case SEARCH_MAILS:
      const searchMails = action.searchMails;
      return { ...state, searchMails };
    case SEARCH_CONTRACTS:
      const searchContracts = action.searchContracts;
      return { ...state, searchContracts };
    default:
      return state;
  }
};

export default fetchTable;
