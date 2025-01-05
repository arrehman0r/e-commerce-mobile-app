// store.js
import { configureStore } from '@reduxjs/toolkit';
import { persistReducer, persistStore, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from "redux-persist";
import AsyncStorage from '@react-native-async-storage/async-storage';
import rootReducer from './reducers'; // Make sure this path is correct

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
};

// Create a persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure store with default middleware
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
      immutableCheck: process.env.NODE_ENV !== "development", // Disable immutable state checks in development
    }),
 
  devTools: process.env.NODE_ENV !== 'production', // Enable Redux DevTools in development
});

// Create a persistor
const persistor = persistStore(store);

export { store, persistor };
