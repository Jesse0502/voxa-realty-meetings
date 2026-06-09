import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { setAssistant, clearAssistant } from "./assistantSlice";
import { setCalls, setCallStats, clearCalls } from "./callsSlice";
import { setContacts, clearContacts } from "./contactsSlice";
import type { RootState } from "./index";
import type { Call, CallStats } from "./callsSlice";
import type { Contact } from "./contactsSlice";

type AuthMode = "login" | "register";
type AuthStatus = "idle" | "loading" | "succeeded" | "failed";

type AuthPayload = {
  phoneNumber: string;
  password: string;
};

type AuthResponse = {
  message?: string;
  token?: string;
  user?: unknown;
};

type AuthUserPayload = {
  assistant?: unknown;
  calls?: Call[];
  callStats?: CallStats;
  contacts?: Contact[];
  [key: string]: unknown;
};

type AuthState = {
  status: AuthStatus;
  error: string | null;
  user: unknown | null;
  token: string | null;
  lastAction: AuthMode | null;
  hasLoadedCurrentUser: boolean;
};

const initialToken = localStorage.getItem("voxa_token") || null;

const initialState: AuthState = {
  status: "idle",
  error: null,
  user: null,
  token: initialToken,
  lastAction: null,
  hasLoadedCurrentUser: false,
};

const getErrorMessage = async (response: Response) => {
  try {
    const data = (await response.json()) as {
      message?: string;
      error?: string;
      detail?: string;
    };
    return data.message ?? data.error ?? data.detail ?? "Authentication failed";
  } catch {
    return "Authentication failed";
  }
};

const hasDashboardPayload = (payload?: AuthUserPayload | null) =>
  Boolean(
    payload &&
      ("assistant" in payload ||
        "calls" in payload ||
        "callStats" in payload ||
        "contacts" in payload),
  );

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

const authenticate = async (
  mode: AuthMode,
  payload: AuthPayload,
): Promise<AuthResponse> => {
  const url = `${SERVER_URL}/auth/${mode}`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      phone_number: payload.phoneNumber,
      password: payload.password,
    }),
  });

  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }

  try {
    return (await response.json()) as AuthResponse;
  } catch {
    return {};
  }
};

export const login = createAsyncThunk<
  AuthResponse,
  AuthPayload,
  { rejectValue: string }
>("auth/login", async (payload, { dispatch, rejectWithValue }) => {
  try {
    const response = await authenticate("login", payload);
    // Dispatch actions to sync other slices
    if (response.user) {
      const { assistant, calls, callStats, contacts } =
        response.user as AuthUserPayload;
      dispatch(setAssistant(assistant || null));
      dispatch(setCalls(calls || []));
      if (callStats) dispatch(setCallStats(callStats));
      dispatch(setContacts(contacts || []));
    }
    return response;
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : "Authentication failed",
    );
  }
});

export const register = createAsyncThunk<
  AuthResponse,
  AuthPayload,
  { rejectValue: string }
>("auth/register", async (payload, { dispatch, rejectWithValue }) => {
  try {
    const response = await authenticate("register", payload);
    // Dispatch actions to sync other slices
    if (response.user) {
      const { assistant, calls, callStats, contacts } =
        response.user as AuthUserPayload;
      dispatch(setAssistant(assistant || null));
      dispatch(setCalls(calls || []));
      if (callStats) dispatch(setCallStats(callStats));
      dispatch(setContacts(contacts || []));
    }
    return response;
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : "Authentication failed",
    );
  }
});

export const fetchCurrentUser = createAsyncThunk<
  AuthUserPayload,
  void,
  { rejectValue: string; state: RootState }
>("auth/me", async (_, { getState, rejectWithValue, dispatch }) => {
  const state = getState();
  const token = state.auth.token;
  if (!token) return rejectWithValue("No token");

  try {
    const response = await fetch(`${SERVER_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      if (response.status === 401) {
        dispatch(authSlice.actions.logout());
        dispatch(clearAssistant());
        dispatch(clearCalls());
        dispatch(clearContacts());
      }
      throw new Error(await getErrorMessage(response));
    }
    const data = await response.json();

    dispatch(setAssistant(data.assistant || null));
    dispatch(setCalls(data.calls || []));
    if (data.callStats) dispatch(setCallStats(data.callStats));
    dispatch(setContacts(data.contacts || []));

    return data;
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : "Fetch user failed",
    );
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearAuthError(state) {
      state.error = null;
      if (state.status === "failed") {
        state.status = "idle";
      }
    },
    setAuthFromOnboarding(
      state,
      action: PayloadAction<{ token: string; user: unknown }>,
    ) {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.status = "succeeded";
      state.error = null;
      state.hasLoadedCurrentUser = false;
      localStorage.setItem("voxa_token", action.payload.token);
    },
    logout(state) {
      state.user = null;
      state.token = null;
      state.status = "idle";
      state.hasLoadedCurrentUser = false;
      localStorage.removeItem("voxa_token");
      // Note: we handle clearing other slices in the thunks or components
    },
    resetAuthState() {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = "loading";
        state.error = null;
        state.lastAction = "login";
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.error = null;
        state.lastAction = "login";

        const userPayload = action.payload.user as AuthUserPayload;
        state.hasLoadedCurrentUser = hasDashboardPayload(userPayload);
        if (userPayload) {
          const { assistant, calls, callStats, contacts, ...userData } = userPayload;
          state.user = userData;
        } else {
          state.user = null;
        }

        state.token = action.payload.token ?? null;

        if (action.payload.token) {
          localStorage.setItem("voxa_token", action.payload.token);
        }
      })
      .addCase(login.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          action.payload ?? action.error.message ?? "Authentication failed";
        state.lastAction = "login";
      })
      .addCase(register.pending, (state) => {
        state.status = "loading";
        state.error = null;
        state.lastAction = "register";
      })
      .addCase(register.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.error = null;
        state.lastAction = "register";

        const userPayload = action.payload.user as AuthUserPayload;
        state.hasLoadedCurrentUser = hasDashboardPayload(userPayload);
        if (userPayload) {
          const { assistant, calls, callStats, contacts, ...userData } = userPayload;
          state.user = userData;
        } else {
          state.user = null;
        }

        state.token = action.payload.token ?? null;

        if (action.payload.token) {
          localStorage.setItem("voxa_token", action.payload.token);
        }
      })
      .addCase(register.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          action.payload ?? action.error.message ?? "Authentication failed";
        state.lastAction = "register";
      })
      .addCase(fetchCurrentUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        const { assistant, calls, callStats, contacts, ...userData } = action.payload;
        state.user = userData;
        state.error = null;
        state.hasLoadedCurrentUser = true;
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "Failed to fetch user";
      });
  },
});

export const { clearAuthError, logout, resetAuthState, setAuthFromOnboarding } = authSlice.actions;
export default authSlice.reducer;
