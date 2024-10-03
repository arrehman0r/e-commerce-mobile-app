import { handleCartUpdate } from "./cartUpdate";

export const handlePlaceOrder = async (cartId, userDetails, userAddress, shippingId, cart, formData, userCoordinates, redeemCode, dispatch, navigation,isRedeemed) => {
    if (!formData?.name || !userAddress || !formData?.phone || !userCoordinates) {
      Alert.alert("Error", "Please fill all required fields");
      return;
    }
  
    const phoneRegex = /^(\+92|0)?[0-9]{10}$/;
    if (!phoneRegex.test(formData?.phone)) {
      Alert.alert("Error", "Please enter a valid phone number");
      return;
    }
  
    try {
      await handleCartUpdate(cartId, userDetails, userAddress, shippingId, cart, formData, userCoordinates, redeemCode, dispatch, isRedeemed);
  
      const orderConfirmation = await new Promise((resolve) => {
        Alert.alert(
          "Confirm Order",
          "Are you sure you want to place this order?",
          [
            { text: "Cancel", style: "cancel", onPress: () => resolve(false) },
            { text: "Yes", onPress: () => resolve(true) },
          ]
        );
      });
  
      if (!orderConfirmation) return;
  
      dispatch(setLoading(true));
      await createCheckOut(cartId);
      const confirmOrderRes = await confirmOrder(cartId);
      dispatch(clearFromCart());
      dispatch(setCartId(null));
      dispatch(setLoading(false));
      navigation.navigate("OrderSuccess", { orderId: confirmOrderRes.data.id });
  
    } catch (error) {
      dispatch(setLoading(false));
      dispatch(setCartId(null));
      console.error("Error placing order:", error);
      Alert.alert(
        "Error",
        "Something went wrong while placing your order. Please try again."
      );
    }
  };
  