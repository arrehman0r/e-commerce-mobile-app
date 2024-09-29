import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Home from './screens/Home';
import CategoryProducts from './screens/CategoryProducts';
import ProductDetails from './screens/ProductDetails';
import { Provider } from "react-redux";
import { PersistGate } from 'redux-persist/integration/react';
import { persistor, store } from './store';
import AppToast from './components/AppToast';
import { SafeAreaProvider } from 'react-native-safe-area-context'; // Import SafeAreaProvider
import { SafeAreaView } from 'react-native';

const Stack = createStackNavigator();

export default function App() {
  return (

    <SafeAreaProvider>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
       {/* Wrap NavigationContainer with SafeAreaProvider */}
          <NavigationContainer>
            <Stack.Navigator initialRouteName="Home">
              <Stack.Screen name="Home" component={Home} />
              <Stack.Screen name="CategoryProducts" component={CategoryProducts} />
              <Stack.Screen name="ProductDetails" component={ProductDetails} />
            </Stack.Navigator>
            <StatusBar style="auto" />
          </NavigationContainer>
          <AppToast /> 
        
      </PersistGate>
    </Provider>
    </SafeAreaProvider>
  );
}
