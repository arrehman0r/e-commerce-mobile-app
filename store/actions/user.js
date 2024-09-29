// userActions.js
import { SET_USER, CLEAR_USER, SET_TOKEN, CART_ID, REDEEM_CODE } from "./types";

export const setUser = (user) => ({
  type: SET_USER,
  payload: user
});

export const clearUser = () => ({
  type: CLEAR_USER
});

export const setToken = (token) => ({
  type: SET_TOKEN,
  payload: token
})

export const setCartId = (cartId) => ({
  type: CART_ID,
  payload: cartId
})

export const setRedeemCode = (code) => ({
  type: REDEEM_CODE,
  payload: code
})