import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "./index";

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

type KnowledgeBase = {
  id: string;
  name: string;
  type: string;
  spreadsheetId?: string;
  phoneColumnName?: string;
};

type SpreadsheetItem = {
  id: string;
  name: string;
};

type SheetColumn = {
  id: string;
  name: string;
};

type Assistant = {
  id?: string;
  _id?: string;
  name?: string;
  prompt?: string;
  openingLine?: string;
  firstLine?: string;
  userId?: string;
  remainingMins?: number;
  credentials?: any;
  knowledge_bases?: KnowledgeBase[];
};

type AssistantState = {
  assistant: Assistant | null;
  selectedSpreadsheetId: string;
  selectedSheetId: string;
  selectedPhoneColumnName: string;
  lastFetchedSpreadsheetId: string;
  lastFetchedSheetId: string;
  lastFetchedColumnsSpreadsheetId: string;
  lastFetchedColumnsSheetId: string;
  availableSpreadsheets: SpreadsheetItem[];
  availableSpreadsheetsStatus: "idle" | "loading" | "succeeded" | "failed";
  availableSpreadsheetsError: string | null;
  availableSheetTabs: KnowledgeBase[];
  availableSheetTabsStatus: "idle" | "loading" | "succeeded" | "failed";
  availableSheetTabsError: string | null;
  availableSheetColumns: SheetColumn[];
  availableSheetColumnsStatus: "idle" | "loading" | "succeeded" | "failed";
  availableSheetColumnsError: string | null;
  saveKnowledgeBasesStatus: "idle" | "loading" | "succeeded" | "failed";
  saveKnowledgeBasesError: string | null;
  updateStatus: "idle" | "loading" | "succeeded" | "failed";
  updateError: string | null;
};

const initialState: AssistantState = {
  assistant: null,
  selectedSpreadsheetId: "",
  selectedSheetId: "",
  selectedPhoneColumnName: "",
  lastFetchedSpreadsheetId: "",
  lastFetchedSheetId: "",
  lastFetchedColumnsSpreadsheetId: "",
  lastFetchedColumnsSheetId: "",
  availableSpreadsheets: [],
  availableSpreadsheetsStatus: "idle",
  availableSpreadsheetsError: null,
  availableSheetTabs: [],
  availableSheetTabsStatus: "idle",
  availableSheetTabsError: null,
  availableSheetColumns: [],
  availableSheetColumnsStatus: "idle",
  availableSheetColumnsError: null,
  saveKnowledgeBasesStatus: "idle",
  saveKnowledgeBasesError: null,
  updateStatus: "idle",
  updateError: null,
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

export const fetchAvailableSheets = createAsyncThunk<
  SpreadsheetItem[],
  void,
  { rejectValue: string; state: RootState }
>(
  "assistant/fetchAvailableSheets",
  async (_, { getState, rejectWithValue }) => {
    const token = getState().auth.token;
    if (!token) {
      return rejectWithValue("No authentication token found");
    }

    const response = await fetch(`${SERVER_URL}/auth/google-sheets/available`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      return rejectWithValue(await getErrorMessage(response));
    }

    const data = (await response.json()) as { sheets?: SpreadsheetItem[] };
    return data.sheets ?? [];
  },
);

export const fetchSpreadsheetSheets = createAsyncThunk<
  KnowledgeBase[],
  string,
  { rejectValue: string; state: RootState }
>(
  "assistant/fetchSpreadsheetSheets",
  async (spreadsheetId, { getState, rejectWithValue }) => {
    const token = getState().auth.token;
    if (!token) {
      return rejectWithValue("No authentication token found");
    }

    const response = await fetch(
      `${SERVER_URL}/auth/google-sheets/${spreadsheetId}/sheets`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!response.ok) {
      return rejectWithValue(await getErrorMessage(response));
    }

    const data = (await response.json()) as { sheets?: KnowledgeBase[] };
    return data.sheets ?? [];
  },
);

export const fetchSheetColumns = createAsyncThunk<
  SheetColumn[],
  { spreadsheetId: string; sheetId: string },
  { rejectValue: string; state: RootState }
>(
  "assistant/fetchSheetColumns",
  async (payload, { getState, rejectWithValue }) => {
    const token = getState().auth.token;
    if (!token) {
      return rejectWithValue("No authentication token found");
    }

    const response = await fetch(
      `${SERVER_URL}/auth/google-sheets/${payload.spreadsheetId}/sheets/${payload.sheetId}/columns`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!response.ok) {
      return rejectWithValue(await getErrorMessage(response));
    }

    const data = (await response.json()) as { columns?: SheetColumn[] };
    return data.columns ?? [];
  },
);

export const connectGoogleSheets = createAsyncThunk<
  { success: boolean; message?: string },
  { code: string; sheetUrl: string },
  { rejectValue: string; state: RootState }
>(
  "assistant/connectGoogleSheets",
  async (payload, { getState, rejectWithValue }) => {
    const token = getState().auth.token;
    if (!token) {
      return rejectWithValue("No authentication token found");
    }

    const response = await fetch(`${SERVER_URL}/auth/google/callback`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      return rejectWithValue(await getErrorMessage(response));
    }

    return (await response.json()) as { success: boolean; message?: string };
  },
);

export const disconnectGoogleSheets = createAsyncThunk<
  { success: boolean; message?: string },
  void,
  { rejectValue: string; state: RootState }
>(
  "assistant/disconnectGoogleSheets",
  async (_, { getState, rejectWithValue }) => {
    const token = getState().auth.token;
    if (!token) {
      return rejectWithValue("No authentication token found");
    }

    const response = await fetch(
      `${SERVER_URL}/auth/google-sheets/connection`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!response.ok) {
      return rejectWithValue(await getErrorMessage(response));
    }

    return (await response.json()) as { success: boolean; message?: string };
  },
);

export const saveKnowledgeBases = createAsyncThunk<
  KnowledgeBase[],
  KnowledgeBase[],
  { rejectValue: string; state: RootState }
>(
  "assistant/saveKnowledgeBases",
  async (knowledgeBases, { getState, rejectWithValue }) => {
    const token = getState().auth.token;
    if (!token) {
      return rejectWithValue("No authentication token found");
    }

    const response = await fetch(
      `${SERVER_URL}/auth/assistant/knowledge-bases`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ knowledge_bases: knowledgeBases }),
      },
    );

    if (!response.ok) {
      return rejectWithValue(await getErrorMessage(response));
    }

    return knowledgeBases;
  },
);

export const updateAssistant = createAsyncThunk<
  Assistant,
  { prompt: string; openingLine: string },
  { rejectValue: string }
>("assistant/update", async (data, thunkAPI) => {
  const token = localStorage.getItem("voxa_token");
  if (!token) {
    return thunkAPI.rejectWithValue("No authentication token found");
  }

  const response = await fetch(`${SERVER_URL}/auth/assistant`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      prompt: data.prompt,
      openingLine: data.openingLine,
    }),
  });

  if (!response.ok) {
    let errMessage = "Update failed";
    try {
      const errData = await response.json();
      errMessage = errData.detail || errMessage;
    } catch {}
    return thunkAPI.rejectWithValue(errMessage);
  }

  const updatedAssistant = await response.json();
  return updatedAssistant;
});

const assistantSlice = createSlice({
  name: "assistant",
  initialState,
  reducers: {
    setAssistant(state, action: PayloadAction<Assistant | null>) {
      state.assistant = action.payload;
    },
    clearAssistant(state) {
      state.assistant = null;
    },
    setSelectedSpreadsheetId(state, action: PayloadAction<string>) {
      state.selectedSpreadsheetId = action.payload;
    },
    setSelectedSheetId(state, action: PayloadAction<string>) {
      state.selectedSheetId = action.payload;
    },
    setSelectedPhoneColumnName(state, action: PayloadAction<string>) {
      state.selectedPhoneColumnName = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAvailableSheets.pending, (state) => {
        state.availableSpreadsheetsStatus = "loading";
        state.availableSpreadsheetsError = null;
      })
      .addCase(fetchAvailableSheets.fulfilled, (state, action) => {
        state.availableSpreadsheetsStatus = "succeeded";
        state.availableSpreadsheets = action.payload;
      })
      .addCase(fetchAvailableSheets.rejected, (state, action) => {
        state.availableSpreadsheetsStatus = "failed";
        state.availableSpreadsheetsError =
          action.payload ?? "Failed to load spreadsheets";
      })
      .addCase(fetchSpreadsheetSheets.pending, (state) => {
        state.availableSheetTabsStatus = "loading";
        state.availableSheetTabsError = null;
      })
      .addCase(fetchSpreadsheetSheets.fulfilled, (state, action) => {
        state.availableSheetTabsStatus = "succeeded";
        state.availableSheetTabs = action.payload;
        state.lastFetchedSpreadsheetId = action.meta.arg;
      })
      .addCase(fetchSpreadsheetSheets.rejected, (state, action) => {
        state.availableSheetTabsStatus = "failed";
        state.availableSheetTabsError =
          action.payload ?? "Failed to load spreadsheet sheets";
      })
      .addCase(fetchSheetColumns.pending, (state) => {
        state.availableSheetColumnsStatus = "loading";
        state.availableSheetColumnsError = null;
      })
      .addCase(fetchSheetColumns.fulfilled, (state, action) => {
        state.availableSheetColumnsStatus = "succeeded";
        state.availableSheetColumns = action.payload;
        state.lastFetchedColumnsSpreadsheetId = action.meta.arg.spreadsheetId;
        state.lastFetchedColumnsSheetId = action.meta.arg.sheetId;
      })
      .addCase(fetchSheetColumns.rejected, (state, action) => {
        state.availableSheetColumnsStatus = "failed";
        state.availableSheetColumnsError =
          action.payload ?? "Failed to load sheet columns";
      })
      .addCase(saveKnowledgeBases.pending, (state) => {
        state.saveKnowledgeBasesStatus = "loading";
        state.saveKnowledgeBasesError = null;
      })
      .addCase(saveKnowledgeBases.fulfilled, (state, action) => {
        state.saveKnowledgeBasesStatus = "succeeded";
        if (state.assistant) {
          state.assistant.knowledge_bases = action.payload;
        }
      })
      .addCase(saveKnowledgeBases.rejected, (state, action) => {
        state.saveKnowledgeBasesStatus = "failed";
        state.saveKnowledgeBasesError =
          action.payload ?? "Failed to save knowledge bases";
      })
      .addCase(updateAssistant.pending, (state) => {
        state.updateStatus = "loading";
        state.updateError = null;
      })
      .addCase(updateAssistant.fulfilled, (state, action) => {
        state.updateStatus = "succeeded";
        state.assistant = action.payload;
      })
      .addCase(updateAssistant.rejected, (state, action) => {
        state.updateStatus = "failed";
        state.updateError = action.payload || "Failed to update assistant";
      });
  },
});

export const {
  setAssistant,
  clearAssistant,
  setSelectedSpreadsheetId,
  setSelectedSheetId,
  setSelectedPhoneColumnName,
} = assistantSlice.actions;
export default assistantSlice.reducer;
