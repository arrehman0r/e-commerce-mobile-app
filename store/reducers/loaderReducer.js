import { SET_LOADING } from "../actions/types";

const initialState = {
    loading: false,
  };
  
  const loaderReducer = (state = initialState, action) => {
    switch (action.type) {
      case SET_LOADING:
        return {
          ...state,
          loading: action.payload,
        };
      default:
        return state;
    }
  };
  
  export default loaderReducer;
  