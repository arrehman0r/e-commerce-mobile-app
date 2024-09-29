import { USER_ADDRESS, SET_SHIPPING_CHARGES, SET_USER_COORDINATES } from "./types";

export const setUserAddress = (address) => {
  return {
    type: USER_ADDRESS,
    payload: address,
  };
};

export const setShippingCharges = (charges) => {
  return {
    type: SET_SHIPPING_CHARGES,
    payload: charges,
  };
};

export const setUserCoordinates = (userCoordinates) => {
  return {
    type: SET_USER_COORDINATES,
    payload: userCoordinates,
  };
};
