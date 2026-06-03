import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import assistantReducer from "./assistantSlice";
import callsReducer from "./callsSlice";
import profileReducer from "./profileSlice";
import contactsReducer from "./contactsSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    assistant: assistantReducer,
    calls: callsReducer,
    profile: profileReducer,
    contacts: contactsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
