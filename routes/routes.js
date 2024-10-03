import { StatusBar } from 'expo-status-bar';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons'; 
import Home from './../screens/Home';
import CategoryProducts from './../screens/CategoryProducts';
import ProductDetails from './../screens/ProductDetails';
import Cart from '../screens/Cart';
import { useDispatch, useSelector } from 'react-redux';
import { createCart } from '../server/api';
import { REGIOD_ID, SALES_CHANNEL_ID } from '../env';
import { setCartId } from '../store/actions/user';
import { useEffect } from 'react';
import Checkout from '../screens/Checkout';

const Routes = () => {

  const Stack = createStackNavigator();

  const { cart } = useSelector((state) => state.groceryState);
  const totalCartCount = Object.values(cart).reduce((a, b) => a + b, 0);


  const cartId = useSelector((state) => state.user.cartId);
  const dispatch = useDispatch();
  const createCartId = async () => {
    const body = {
      region_id: REGIOD_ID,
      sales_channel_id: SALES_CHANNEL_ID,
      country_code: "pk",
      context: {},
    };
    try{ 
    const res = await createCart(body);
    const newCartId = res.cart.id;
    dispatch(setCartId(newCartId));}
    catch(error){
        console.log("error creating cart id",error)
        dispatch(showToast("Something went wrong"))
    }
  };

  useEffect(() => {
    if (totalCartCount > 0 && !cartId) {
      createCartId();
      
    }

  }, [totalCartCount, cartId]);

console.log("cart id is ", cartId)

  const CartIconWithBadge = ({ navigation }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('Cart')}
      style={{ marginRight: 10 }}
    >
      <View style={{ position: 'relative' }}>
        <MaterialIcons name="shopping-cart" size={30} color="#7845ac" />
        {totalCartCount > 0 && (
          <View style={styles.badgeContainer}>
            <Text style={styles.badgeText}>{totalCartCount}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={Home}
          options={({ navigation }) => ({
            title: "Welcome Home",
            headerRight: () => <CartIconWithBadge navigation={navigation} />
          })}
        />
        <Stack.Screen
          name="CategoryProducts"
          component={CategoryProducts}
          options={({ navigation }) => ({
            title: "Products by Category",
            headerRight: () => <CartIconWithBadge navigation={navigation} />
          })}
        />
        <Stack.Screen
          name="ProductDetails"
          component={ProductDetails}
          options={({ navigation }) => ({
            title: "Product Details",
            headerRight: () => <CartIconWithBadge navigation={navigation} />
          })}
        />
        <Stack.Screen
          name="Cart"
          component={Cart}
          options={({ navigation }) => ({
            title: "Cart",
          })}
        />
          <Stack.Screen
          name="Checkout"
          component={Checkout}
          options={({ navigation }) => ({
            title: "Checkout",
          })}
        />
      </Stack.Navigator>
      <StatusBar style="auto" />
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  badgeContainer: {
    position: 'absolute',
    right: -8,
    top: -5,
    backgroundColor: 'red',
    borderRadius: 10,
    paddingHorizontal: 5,
    paddingVertical: 2,
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default Routes;
