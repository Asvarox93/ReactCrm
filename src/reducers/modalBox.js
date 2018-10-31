import { ADD_MODAL_ACTIVE, ADD_MODAL_OFF } from "../action/index";

const modal = (state = [], action) => {
  switch (action.type) {
    case ADD_MODAL_ACTIVE:
      return { ...state, active: action.modal.active, type: action.modal.type };
    case ADD_MODAL_OFF:
      return {
        ...state,
        active: action.modal.active,
        type: action.modal.type ? action.modal.type : ""
      };
    default:
      return state;
  }
};

export default modal;
