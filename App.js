import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Home from "./screens/Home";
import ProductDetails from "./screens/ProductDetails";
import Cart from "./screens/Cart";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistor, store } from "./store";
import AppToast from "./components/common/AppToast";
import CartButton from "./components/common/CartButton";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from "@expo-google-fonts/poppins";
import {
  PlayfairDisplay_400Regular,
  PlayfairDisplay_500Medium,
  PlayfairDisplay_700Bold,
} from "@expo-google-fonts/playfair-display";
import { PaperProvider } from "react-native-paper";
import { theme } from "./theme";

const Stack = createStackNavigator();

export default function App() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 30,
        cacheTime: 1000 * 60 * 30,
        retry: 2,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
      },
    },
  });

  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
    PlayfairDisplay_400Regular,
    PlayfairDisplay_500Medium,
    PlayfairDisplay_700Bold,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <PaperProvider theme={theme}>
          <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
              <NavigationContainer>
                <Stack.Navigator
                  initialRouteName="Home"
                  screenOptions={{
                    headerStyle: {
                      backgroundColor: theme.colors.primary,
                    },
                    headerTintColor: theme.colors.onPrimary,
                    headerTitleStyle: {
                      fontFamily: 'Poppins_600SemiBold',
                    },
                    headerRight: () => <CartButton />,
                  }}
                >
                  <Stack.Screen 
                    name="Home" 
                    component={Home}
                  />
                  <Stack.Screen
                    name="ProductDetails"
                    component={ProductDetails}
                    options={{
                      title: "Product Details"
                    }}
                  />
                  <Stack.Screen
                    name="Cart"
                    component={Cart}
                    options={{
                      headerRight: null // Remove cart button from cart screen
                    }}
                  />
                </Stack.Navigator>
                <StatusBar style="light" />
                <AppToast />
              </NavigationContainer>
            </PersistGate>
          </Provider>
        </PaperProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}