import { USER_ADDRESS, SET_SHIPPING_CHARGES, SET_USER_COORDINATES } from "../actions/types";

const initialState = {
  userAddress: null,
  shippingCharges: null,
};

const addressReducer = (state = initialState, action) => {
  switch (action.type) {
    case USER_ADDRESS:
      return {
        ...state,
        userAddress: action.payload,
      };
    case SET_SHIPPING_CHARGES:
      return {
        ...state,
        shippingCharges: action.payload,
      };
      case SET_USER_COORDINATES:
        return{
          ...state,
          userCoordinates: action.payload
        }
    default:
      return state;
  }
};

export default addressReducer;
