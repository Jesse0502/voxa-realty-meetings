import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import assistantReducer from "./assistantSlice";
import callsReducer from "./callsSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    assistant: assistantReducer,
    calls: callsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
