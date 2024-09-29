import { HIDE_TOAST, SHOW_TOAST } from "../actions/types";

 // Reducer
 const initialState = {
    visible: false,
    message: '',
  };
  
const toastReducer = (state = initialState, action) => {
  switch (action.type) {
    case SHOW_TOAST:
      return {
        ...state,
        visible: true,
        message: action.payload,
      };
    case HIDE_TOAST:
      return {
        ...state,
        visible: false,
        message: '',
      };
    default:
      return state;
  }
};

export default toastReducer;