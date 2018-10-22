import { ADD_MODAL_ACTIVE, ADD_MODAL_OFF } from "../action/index";

const modal = (state = [], action) => {
  switch (action.type) {
    case ADD_MODAL_ACTIVE:
      return { ...state, modalActive: true };
    case ADD_MODAL_OFF:
      return { ...state, modalActive: false };
    default:
      return state;
  }
};

export default modal;
