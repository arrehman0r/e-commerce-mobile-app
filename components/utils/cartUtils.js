import { REGIOD_ID } from "../../env";
import {  getShippingMethod } from "../../server/api";


export const fetchDeliveryCharges = async (dispatch, setShippingId, setShippingCharges) => {
    const regionId = REGIOD_ID;
    try {
      const response = await getShippingMethod(regionId);
      const selectedShipping = response.shipping_options.find(
        (option) => option.metadata && option.metadata.apply === "true"
      );
      if (selectedShipping) {
        setShippingId(selectedShipping.id);
        dispatch(setShippingCharges(selectedShipping.amount));
      }
    } catch (error) {
      console.log("Error in getting shipping id or charges", error);
      dispatch(showToast("Something went wrong"));
    }
  };
  


 