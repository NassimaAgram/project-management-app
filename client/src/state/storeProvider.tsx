import { useRef } from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistStore } from "redux-persist";
import { setupListeners } from "@reduxjs/toolkit/query";
import { AppStore } from "@/state/store";
import { makeStore } from '@/state/store';


export default function StoreProvider({ children }: { children: React.ReactNode }) {
  // Use the correct type for the ref
  const storeRef = useRef<AppStore>();

  if (!storeRef.current) {
    storeRef.current = makeStore();
    setupListeners(storeRef.current.dispatch);
  }
  // Create persistor using the store reference
  const persistor = persistStore(storeRef.current);

  return (
    <Provider store={storeRef.current}> {/* Provide the store to the app */}
      <PersistGate loading={null} persistor={persistor}> {/* Handle persistence */}
        {children}
      </PersistGate>
    </Provider>
  );
}
