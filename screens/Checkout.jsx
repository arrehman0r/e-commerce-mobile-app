import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Button, TextInput } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import { useForm, Controller } from "react-hook-form";
import { fetchDeliveryCharges } from "../components/utils/cartUtils";
import { setShippingCharges } from "../store/actions/userAddress";
import { handlePlaceOrder } from "../components/utils/placeOrder";
import * as Location from 'expo-location';
import { showToast } from "../store/actions/toast";
const Checkout = ({ navigation }) => {
  const dispatch = useDispatch();
  const [shippingId, setShippingId] = useState("");
  const  cart  = useSelector((state) => state.groceryState);
  const cartId = useSelector((state) => state.user.cartId);
  const userAddress = useSelector((state) => state.address.userAddress);
  const userDetails = useSelector((state) => state.user.user);
  const redeemCode = useSelector((state) => state.user.redeemCode);
  const userCoordinates = useSelector((state) => state.address.userCoordinates);
  const isRedeemed = false;
  const { control, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      name: '',
      phone: '',
      address: ''
    }
  });

   const getLocation = async () => {
    dispatch(setLoading(true));
   

    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      dispatch(showToast('Permission to access location was denied'));
      setIsLocationAvailable(false);
      dispatch(setLoading(false));
      return;
    }

    try {
      let location = await Location.getCurrentPositionAsync({});
      dispatch(setUserCoordinates(location.coords));

      const response = await axios.get('https://nominatim.openstreetmap.org/reverse', {
        params: {
          lat: location.coords.latitude,
          lon: location.coords.longitude,
          format: 'json',
          addressdetails: 1,
        },
      });

      if (response.data && response.data.address) {
        const addressParts = [
          response.data.address.road,
          response.data.address.neighbourhood,
          response.data.address.subdistrict,
        ];
        const detailedAddress = addressParts.filter(part => part).join(', ');
        setAddress(detailedAddress);
        setIsLocationAvailable(true);
      } else {
        setErrorMsg('Unable to get address from location');
        setIsLocationAvailable(false);
        dispatch(showToast("something went wrong"));
      }
    } catch (error) {
      setErrorMsg('Unable to get address from location');
      setIsLocationAvailable(false);
      dispatch(showToast("something went wrong"));
      console.error(error);
    } finally {
      dispatch(setLoading(false));
    }
  };




  useEffect(() => {
    console.log("this run shipping")
    fetchDeliveryCharges(dispatch, setShippingId, (amount) => dispatch(setShippingCharges(amount)));
  }, [dispatch]);

  const handlePlaceOrderWrapper = async (formData) => {
    console.log("form data is ",formData )
    await handlePlaceOrder(cartId, userDetails, userAddress, shippingId, cart, formData, userCoordinates, redeemCode, dispatch, navigation, isRedeemed);
  };

  return (
    <View style={styles.container}>
      <Controller
        control={control}
        rules={{
          required: "Name is required"
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            label="Name"
            mode="outlined"
            style={styles.input}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            error={!!errors.name}
          />
        )}
        name="name"
      />
      {errors.name && <Text style={styles.errorText}>{errors.name.message}</Text>}

      <Controller
        control={control}
        rules={{
          required: "Phone is required",
          pattern: {
            value: /^[0-9]{11}$/,
            message: "Phone number must be 11 digits"
          }
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            label="Phone"
            mode="outlined"
            style={styles.input}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            error={!!errors.phone}
            keyboardType="numeric"
          />
        )}
        name="phone"
      />
      {errors.phone && <Text style={styles.errorText}>{errors.phone.message}</Text>}

      <Controller
        control={control}
        rules={{
          required: "Address is required"
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            label="Address"
            mode="outlined"
            style={styles.input}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            error={!!errors.address}
            multiline
          />
        )}
        name="address"
      />
      {errors.address && <Text style={styles.errorText}>{errors.address.message}</Text>}

      <Button
        mode="contained"
        onPress={handleSubmit(handlePlaceOrderWrapper)}
        style={styles.placeOrderButton}
      >
        Place Order
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff"
  },
  input: {
    marginBottom: 20,
  },
  errorText: {
    color: "red",
    marginBottom: 10
  },
  placeOrderButton: {
    marginTop: 20,
    paddingVertical: 10
  }
});

export default Checkout;
