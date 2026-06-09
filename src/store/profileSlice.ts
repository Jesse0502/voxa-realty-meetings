import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { RootState } from "./index";

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

type BillingProfile = {
  isSubscriptionActive: boolean;
  subscriptionStatus: string;
  subscriptionType?: string;
  cancelAtPeriodEnd: boolean;
  stripeSubscriptionId?: string | null;
  nextPaymentDueDate?: string | null;
  currency: string;
  remainingMins?: number | null;
  overageCostPerMin?: number;
};

type BillingResponse = {
  success: boolean;
  message?: string;
  invoiceId?: string;
  profile: BillingProfile;
};

type ProfileState = {
  profile: BillingProfile | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  actionStatus: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
};

const initialState: ProfileState = {
  profile: null,
  status: "idle",
  actionStatus: "idle",
  error: null,
};

const getErrorMessage = async (response: Response) => {
  try {
    const data = (await response.json()) as {
      message?: string;
      error?: string;
      detail?: string;
    };
    return data.message ?? data.error ?? data.detail ?? "Request failed";
  } catch {
    return "Request failed";
  }
};

export const fetchBillingProfile = createAsyncThunk<
  BillingResponse,
  void,
  { rejectValue: string; state: RootState }
>("profile/fetchBillingProfile", async (_, { getState, rejectWithValue }) => {
  const token = getState().auth.token;
  if (!token) {
    return rejectWithValue("No authentication token found");
  }

  const response = await fetch(`${SERVER_URL}/auth/subscription/profile`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    return rejectWithValue(await getErrorMessage(response));
  }

  return (await response.json()) as BillingResponse;
});

export const createCreditsCheckout = createAsyncThunk<
  { success: boolean; checkout_url: string },
  { mins_to_add: number },
  { rejectValue: string; state: RootState }
>(
  "profile/createCreditsCheckout",
  async (payload, { getState, rejectWithValue }) => {
    const token = getState().auth.token;
    if (!token) return rejectWithValue("No authentication token found");

    const response = await fetch(
      `${SERVER_URL}/auth/subscription/create-credits-checkout`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      },
    );

    if (!response.ok) return rejectWithValue(await getErrorMessage(response));
    return (await response.json()) as { success: boolean; checkout_url: string };
  },
);

export const cancelSubscription = createAsyncThunk<
  BillingResponse,
  void,
  { rejectValue: string; state: RootState }
>("profile/cancelSubscription", async (_, { getState, rejectWithValue }) => {
  const token = getState().auth.token;
  if (!token) {
    return rejectWithValue("No authentication token found");
  }

  const response = await fetch(`${SERVER_URL}/auth/subscription/cancel`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    return rejectWithValue(await getErrorMessage(response));
  }

  return (await response.json()) as BillingResponse;
});

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    clearProfile(state) {
      state.profile = null;
      state.status = "idle";
      state.actionStatus = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBillingProfile.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchBillingProfile.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.profile = action.payload.profile;
      })
      .addCase(fetchBillingProfile.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "Failed to fetch billing profile";
      })
      .addCase(createCreditsCheckout.pending, (state) => {
        state.actionStatus = "loading";
        state.error = null;
      })
      .addCase(createCreditsCheckout.fulfilled, (state) => {
        state.actionStatus = "succeeded";
      })
      .addCase(createCreditsCheckout.rejected, (state, action) => {
        state.actionStatus = "failed";
        state.error = action.payload ?? "Failed to create credits checkout";
      })
      .addCase(cancelSubscription.pending, (state) => {
        state.actionStatus = "loading";
        state.error = null;
      })
      .addCase(cancelSubscription.fulfilled, (state, action) => {
        state.actionStatus = "succeeded";
        state.profile = action.payload.profile;
      })
      .addCase(cancelSubscription.rejected, (state, action) => {
        state.actionStatus = "failed";
        state.error = action.payload ?? "Failed to cancel subscription";
      })
      ;
  },
});

export const { clearProfile } = profileSlice.actions;
export default profileSlice.reducer;
