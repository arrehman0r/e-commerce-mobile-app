import {
  ADD_TO_CART,
  CLEAR_FROM_CART,
  ADD_GROCERY_ITEM,
  REMOVE_FROM_CART,
  REMOVE_GROCERY_ITEM,
} from "../actions/types";

export const addGroceryItem = (groceryItem) => {
  return {
    type: ADD_GROCERY_ITEM,
    payload: groceryItem,
  };
};

export const addToCart = (itemId, quantity) => {
  return {
    type: ADD_TO_CART,
    payload: {
      itemId,
      quantity,
    },
  };
};

export const removeGroceryItem = (groceryItem) => {
  return {
    type: REMOVE_GROCERY_ITEM,
    payload: groceryItem,
  };
};

export const removeFromCart = (itemId, quantity) => {
  return {
    type: REMOVE_FROM_CART,
    payload: {
      itemId,
      quantity,
    },
  };
};

export const clearFromCart = (groceryItem) => {
  return {
    type: CLEAR_FROM_CART,
    payload: groceryItem,
  };
};
