
import { Provider } from "react-redux";
import { PersistGate } from 'redux-persist/integration/react';
import { persistor, store } from './store';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import AppToast from './components/AppToast';
import AppLoader from './components/AppLoader';
import Routes from './routes/routes';

export default function App() {
  return (
    <SafeAreaProvider>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <Routes />
          <AppToast />
          <AppLoader />
        </PersistGate>
      </Provider>
    </SafeAreaProvider>
  );
}
