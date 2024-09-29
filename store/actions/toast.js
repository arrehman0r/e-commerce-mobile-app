import { HIDE_TOAST, SHOW_TOAST } from "./types";

export const showToast = (message) => ({
    type: SHOW_TOAST,
    payload: message,
  });
  
  export const hideToast = () => ({
    type: HIDE_TOAST,
  });
  
 