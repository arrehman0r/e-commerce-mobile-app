import {
  ADD_TO_CART,
  ADD_GROCERY_ITEM,
  CLEAR_FROM_CART,
  REMOVE_FROM_CART,
  REMOVE_GROCERY_ITEM,
} from "../actions/types";
import uuid from 'react-native-uuid';

export const INITIAL_STATE = {
  groceryItems: [],
  cart: {},
};

const groceryReducer = (state = INITIAL_STATE, { type, payload }) => {
  
  switch (type) {
    case ADD_GROCERY_ITEM:
      // Check if the product already exists in the groceryItems array
      const existingProductIndex = state.groceryItems.findIndex(item => item.id === payload.id);
      if (existingProductIndex !== -1) {
        // If the product already exists, do not add it again
        return state;
      }

      // If the product doesn't exist, add it to the groceryItems array
      return {
        ...state,
        groceryItems: [
          ...state.groceryItems,
          {
            key: uuid.v4(), // Use uuid to generate a unique key
            ...payload,
          },
        ],
      };

    case REMOVE_GROCERY_ITEM:
      return {
        ...state,
        groceryItems: state.groceryItems.filter(
          (item) => item.key !== payload.key
        ),
      };

    case ADD_TO_CART:
      const { itemId, quantity } = payload;
      const newCart = { ...state.cart };

      if (newCart[itemId]) {
        newCart[itemId] += quantity;
      } else {
        newCart[itemId] = quantity;
      }

      return {
        ...state,
        cart: { ...newCart },
      };

    case REMOVE_FROM_CART:
      const updatedCart = { ...state.cart };
      const { itemId: removeItemId, quantity: removeQuantity } = payload;
      if (updatedCart[removeItemId]) {
        if (updatedCart[removeItemId] > removeQuantity) {
          updatedCart[removeItemId] -= removeQuantity;
        } else {
          delete updatedCart[removeItemId];
        }
      }
      return {
        ...state,
        cart: updatedCart,
      };

      case CLEAR_FROM_CART:
        return {
          ...state,
          cart: {}, // Reset the cart state to an empty object
        };
  
      default:
        return state;
    }
};

export default groceryReducer;
