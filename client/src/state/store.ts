import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { api } from "@/state/api";
import globalReducer from "@/state/slices/globalSlice";
import {
  TypedUseSelectorHook,
  useDispatch,
  useSelector,
} from "react-redux";
import authReducer from "@/state/slices/authSlice";
import {
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import createWebStorage from "redux-persist/lib/storage/createWebStorage";

// Handle storage for SSR environments
const createNoopStorage = () => ({
  getItem: () => Promise.resolve(null),
  setItem: (_key: any, value: any) => Promise.resolve(value),
  removeItem: (_key: any) => Promise.resolve(),
});

const storage =
  typeof window === "undefined" ? createNoopStorage() : createWebStorage("local");

// Persist configuration
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["global", "auth"],
};

// Root reducer combining all reducers
const rootReducer = combineReducers({
  global: globalReducer,
  auth: authReducer,
  [api.reducerPath]: api.reducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

// Store configuration
export const makeStore = () =>
  configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
          ignoredPaths: ["api.queries.getAuthUser.data"],
        },
      }).concat(api.middleware),
  });

// Type definitions
export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
