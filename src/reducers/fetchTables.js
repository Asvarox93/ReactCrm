import { GET_CRM_USERS_SUCCESS, SET_USER_TO_EDIT } from "../action/index";

const fetchTable = (state = [], action) => {
  switch (action.type) {
    case GET_CRM_USERS_SUCCESS:
      const crmUsers = action.crmUsers;
      console.log("crmUsersAction: ", crmUsers);
      return { ...state, crmUsers };
    case SET_USER_TO_EDIT:
      const editUser = action.editUser;
      return { ...state, editUser };
    default:
      return state;
  }
};

export default fetchTable;
