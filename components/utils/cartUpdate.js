import { showToast } from "../../store/actions/toast";

const prepareOrderItems = (cart) => {
    return Object.keys(cart).map((variantId) => ({
      variant_id: variantId,
      quantity: cart[variantId],
    }));
  };
  
  const prepareAddress = (userAddress, formData, userCoordinates) => {
    return {
      address_1: userAddress.address_1,
      country_code: "pk",
      first_name: formData.name,
      last_name: "",
      phone: formData.phone,
      metadata: { user_coordinates: userCoordinates },
    };
  };
  
  const prepareRequestBody = (userDetails, userAddress, formData, userCoordinates, redeemCode, isRedeemed) => {
    return {
      email: userDetails?.email || "guest@yahoo.com",
      customer_id: userDetails?.id || "",
      shipping_address: prepareAddress(userAddress, formData, userCoordinates),
      billing_address: prepareAddress(userAddress, formData, userCoordinates),
      ...(isRedeemed && {
        gift_cards: [{ code: redeemCode }]
      })
    };
  };
  
  export const handleCartUpdate = async (cartId, userDetails, userAddress, shippingId, cart, formData, userCoordinates, redeemCode, dispatch, isRedeemed) => {
    if (!cartId || !userAddress || !shippingId) {
      return;
    }
  
    const orderItems = prepareOrderItems(cart);
  
    try {
      dispatch(setLoading(true));
  
      const getDeliveryChargesBody = { option_id: shippingId };
      const body = prepareRequestBody(userDetails, userAddress, formData, userCoordinates, redeemCode, isRedeemed);
  
      await Promise.all(orderItems.map(item => addLineItem(cartId, item)));
      await getDeliveryCharges(cartId, getDeliveryChargesBody);
      const res = await updateCartAPI(cartId, body);
      dispatch(setLoading(false));
      return res; // Return response data
    } catch (error) {
      console.error("Error updating cart:", error);
      dispatch(setLoading(false));
      dispatch(showToast("Error updating cart"));
      return null; // Return null in case of error
    }
  };
  