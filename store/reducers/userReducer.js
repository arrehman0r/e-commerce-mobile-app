// userReducer.js
import { SET_USER, CLEAR_USER, SET_TOKEN, CART_ID, REDEEM_CODE } from "../actions/types";

const initialState = {
  user: null,
  token: null,
  cartId: null,
  redeemCode: null
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_USER:
      return {
        ...state,
        user: action.payload
      };
    case SET_TOKEN:
      return {
        ...state,
        token: action.payload
      };
    case CART_ID:
      return {
        ...state,
        cartId: action.payload
      };
    case REDEEM_CODE:
      return {
        ...state,
        redeemCode: action.payload
      }
    case CLEAR_USER:
      return {
        ...state,
        user: null
      };
    default:
      return state;
  }
};

export default userReducer;
