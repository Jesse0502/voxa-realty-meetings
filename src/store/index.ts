import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import assistantReducer from "./assistantSlice";
import callsReducer from "./callsSlice";
import profileReducer from "./profileSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    assistant: assistantReducer,
    calls: callsReducer,
    profile: profileReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
