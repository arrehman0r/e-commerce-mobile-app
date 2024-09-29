import { combineReducers } from "@reduxjs/toolkit";

import groceryReducer from "./groceryReducer";
import flagsReducer from "./flagsReducer";
import countReducer from "./countReducer";
import userReducer from "./userReducer";
import loaderReducer from "./loaderReducer";
import toastReducer from "./toastReducer";
import addressReducer from "./addressReducer";

const reducer = combineReducers({
  groceryState: groceryReducer,
  countState: countReducer,
  flagsState: flagsReducer,
  user: userReducer,
  loading: loaderReducer,
  toast: toastReducer,
  address: addressReducer
});

export default reducer;
