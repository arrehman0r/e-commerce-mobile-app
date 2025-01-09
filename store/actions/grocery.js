import {
  ADD_TO_CART,
  ADD_GROCERY_ITEM,
  CLEAR_FROM_CART,
  REMOVE_FROM_CART,
  REMOVE_GROCERY_ITEM,
} from "./types";

export const addGroceryItem = (product) => ({
  type: ADD_GROCERY_ITEM,
  payload: product
});

export const removeGroceryItem = (productId) => ({
  type: REMOVE_GROCERY_ITEM,
  payload: { id: productId }
});

export const addToCart = (variantId, quantity = 1) => ({
  type: ADD_TO_CART,
  payload: { variantId, quantity }
});

export const removeFromCart = (variantId, quantity = 1) => ({
  type: REMOVE_FROM_CART,
  payload: { variantId, quantity }
});

export const clearCart = () => ({
  type: CLEAR_FROM_CART
});