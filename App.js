
import { Provider } from "react-redux";
import { PersistGate } from 'redux-persist/integration/react';
import { persistor, store } from './store';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppToast from './components/AppToast';
import AppLoader from './components/AppLoader';
import Routes from './routes/routes';
import { QueryClient } from "@tanstack/react-query"
import { MedusaProvider } from "medusa-react"
export default function App() {
  const queryClient = new QueryClient()
  return (
    <SafeAreaProvider>
      <MedusaProvider
        queryClientProviderProps={{ client: queryClient }}
        baseUrl="https://pizza.al-mizan.store"
      >
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <Routes />
            <AppToast />
            <AppLoader />
          </PersistGate>
        </Provider>
      </MedusaProvider>
    </SafeAreaProvider>
  );
}
