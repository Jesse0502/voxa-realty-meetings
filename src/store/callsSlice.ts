import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type Call = {
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

type CallStats = {
  totalCalls: number;
  totalDurationSecs: number;
  averageDurationSecs: number;
};

type CallsState = {
  calls: Call[];
  callStats: CallStats;
};

const initialState: CallsState = {
  calls: [],
  callStats: {
    totalCalls: 0,
    totalDurationSecs: 0,
    averageDurationSecs: 0,
  },
};

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
    },
  },
});

export const { setCalls, setCallStats, clearCalls } = callsSlice.actions;
export default callsSlice.reducer;
