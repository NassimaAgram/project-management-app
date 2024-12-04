// state/index.ts (or wherever your rootReducer is combined)
import { combineReducers } from "redux";
import globalReducer from "@/state/slices/globalSlice";
import { api } from "@/state/api";
import authReducer from "@/state/slices/authSlice"; 

const rootReducer = combineReducers({
  global: globalReducer,
  auth: authReducer,
  [api.reducerPath]: api.reducer,
});

export default rootReducer;
