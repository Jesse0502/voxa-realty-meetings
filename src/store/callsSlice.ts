import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "./index";

export type Call = {
  id?: string;
  _id?: string;
  transcript?: string;
  recordingUrl?: string;
  endedReason?: string;
  assistantId?: string;
  direction?: string;
  cost?: number;
  durationSeconds?: number;
  callerNumber?: string;
  receiverNumber?: string;
  createdAt?: string;
  structuredOutputs?: {
    "Call Intent"?: string;
    "Call Summary"?: string;
    [key: string]: string | undefined;
  };
};

export type CallStats = {
  totalCalls: number;
  totalDurationSecs: number;
  averageDurationSecs: number;
};

type CallsState = {
  calls: Call[];
  callStats: CallStats;
  fetchStatus: "idle" | "loading" | "failed";
  fetchError: string | null;
};

type FetchCallsPageResponse = {
  calls: Call[];
  page: number;
  limit: number;
  totalCalls: number;
  hasMore: boolean;
};

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

const initialState: CallsState = {
  calls: [],
  callStats: {
    totalCalls: 0,
    totalDurationSecs: 0,
    averageDurationSecs: 0,
  },
  fetchStatus: "idle",
  fetchError: null,
};

const getErrorMessage = async (response: Response) => {
  try {
    const data = (await response.json()) as {
      message?: string;
      error?: string;
      detail?: string;
    };
    return data.message ?? data.error ?? data.detail ?? "Failed to fetch calls";
  } catch {
    return "Failed to fetch calls";
  }
};

export const fetchCallsPage = createAsyncThunk<
  FetchCallsPageResponse,
  { page: number; limit?: number },
  { rejectValue: string; state: RootState }
>(
  "calls/fetchPage",
  async ({ page, limit = 50 }, { getState, rejectWithValue }) => {
    const state = getState();
    const token = state.auth?.token;

    if (!token) {
      return rejectWithValue("No token");
    }

    try {
      const response = await fetch(
        `${SERVER_URL}/auth/calls?page=${encodeURIComponent(page)}&limit=${encodeURIComponent(limit)}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error(await getErrorMessage(response));
      }

      return (await response.json()) as FetchCallsPageResponse;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to fetch calls",
      );
    }
  },
);

const callsSlice = createSlice({
  name: "calls",
  initialState,
  reducers: {
    setCalls(state, action: PayloadAction<Call[]>) {
      state.calls = action.payload;
    },
    setCallStats(state, action: PayloadAction<CallStats>) {
      state.callStats = action.payload;
    },
    clearCalls(state) {
      state.calls = [];
      state.callStats = {
        totalCalls: 0,
        totalDurationSecs: 0,
        averageDurationSecs: 0,
      };
      state.fetchStatus = "idle";
      state.fetchError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCallsPage.pending, (state) => {
        state.fetchStatus = "loading";
        state.fetchError = null;
      })
      .addCase(fetchCallsPage.fulfilled, (state, action) => {
        state.fetchStatus = "idle";
        state.fetchError = null;

        const page = action.payload.page || 1;
        const incoming = action.payload.calls || [];

        if (page <= 1) {
          state.calls = incoming;
        } else {
          const existingIds = new Set(
            state.calls.map((call) => String(call._id || call.id || "")),
          );
          for (const call of incoming) {
            const id = String(call._id || call.id || "");
            if (!id || !existingIds.has(id)) {
              state.calls.push(call);
              if (id) existingIds.add(id);
            }
          }
        }

        if (typeof action.payload.totalCalls === "number") {
          state.callStats.totalCalls = action.payload.totalCalls;
        }
      })
      .addCase(fetchCallsPage.rejected, (state, action) => {
        state.fetchStatus = "failed";
        state.fetchError = action.payload ?? "Failed to fetch calls";
      });
  },
});

export const { setCalls, setCallStats, clearCalls } = callsSlice.actions;
export default callsSlice.reducer;
