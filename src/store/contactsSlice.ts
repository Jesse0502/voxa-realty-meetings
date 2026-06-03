import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "./index";

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

type ContactCallHistoryItem = {
  id: string;
  createdAt?: string;
  durationSeconds: number;
  endedReason: string;
  direction: string;
  summary: string;
};

export type Contact = {
  id: string;
  name: string;
  phoneNumber: string;
  about?: string;
  callHistory: ContactCallHistoryItem[];
  lastCallAt?: string;
};

type ContactsResponse = {
  success?: boolean;
  contacts: Contact[];
};

type ContactResponse = {
  success?: boolean;
  contact: Contact;
};

type CreateContactRequest = {
  name: string;
  phoneNumber: string;
  about?: string;
};

type UpdateContactRequest = {
  id: string;
  name: string;
  about?: string;
};

type ContactsState = {
  contacts: Contact[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  selectedContactId: string | null;
  selectedContactStatus: "idle" | "loading" | "succeeded" | "failed";
  selectedContactError: string | null;
  currentPage: number;
  pageSize: number;
};

const initialState: ContactsState = {
  contacts: [],
  status: "idle",
  error: null,
  selectedContactId: null,
  selectedContactStatus: "idle",
  selectedContactError: null,
  currentPage: 1,
  pageSize: 10,
};

const parseContact = (raw: Partial<Contact> & { _id?: string; id?: string; context?: string }): Contact => {
  const id = String(raw.id ?? raw._id ?? "").trim();
  return {
    id,
    name: String(raw.name ?? "Unknown Contact"),
    phoneNumber: String(raw.phoneNumber ?? ""),
    about: typeof raw.about === "string" ? raw.about : undefined,
    callHistory: Array.isArray(raw.callHistory)
      ? raw.callHistory.map((item) => ({
          id: String(item.id ?? ""),
          createdAt: item.createdAt,
          durationSeconds: Number(item.durationSeconds ?? 0),
          endedReason: String(item.endedReason ?? ""),
          direction: String(item.direction ?? ""),
          summary: String(item.summary ?? ""),
        }))
      : [],
    lastCallAt: raw.lastCallAt,
  };
};

const upsertContact = (contacts: Contact[], nextContact: Contact) => {
  const existingIndex = contacts.findIndex((item) => item.id === nextContact.id);
  if (existingIndex >= 0) {
    const next = [...contacts];
    next[existingIndex] = nextContact;
    return next;
  }
  return [nextContact, ...contacts];
};

const getErrorMessage = async (response: Response) => {
  try {
    const data = (await response.json()) as {
      message?: string;
      error?: string;
      detail?: string;
    };
    return data.message ?? data.error ?? data.detail ?? "Failed to fetch contacts";
  } catch {
    return "Failed to fetch contacts";
  }
};

export const fetchContacts = createAsyncThunk<
  ContactsResponse,
  void,
  { rejectValue: string; state: RootState }
>("contacts/fetchContacts", async (_, { getState, rejectWithValue }) => {
  const token = getState().auth.token;
  if (!token) {
    return rejectWithValue("No authentication token found");
  }

  try {
    const response = await fetch(`${SERVER_URL}/contacts`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      return rejectWithValue(await getErrorMessage(response));
    }

    return (await response.json()) as ContactsResponse;
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : "Failed to fetch contacts",
    );
  }
});

export const createContact = createAsyncThunk<
  ContactResponse,
  CreateContactRequest,
  { rejectValue: string; state: RootState }
>("contacts/createContact", async (payload, { getState, rejectWithValue }) => {
  const token = getState().auth.token;
  if (!token) {
    return rejectWithValue("No authentication token found");
  }

  try {
    const response = await fetch(`${SERVER_URL}/contacts`, {
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

    return (await response.json()) as CreateContactResponse;
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : "Failed to create contact",
    );
  }
});

export const fetchContactDetail = createAsyncThunk<
  ContactResponse,
  string,
  { rejectValue: string; state: RootState }
>("contacts/fetchContactDetail", async (contactId, { getState, rejectWithValue }) => {
  const token = getState().auth.token;
  if (!token) {
    return rejectWithValue("No authentication token found");
  }

  try {
    const response = await fetch(`${SERVER_URL}/contacts/${contactId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      return rejectWithValue(await getErrorMessage(response));
    }

    return (await response.json()) as ContactResponse;
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : "Failed to fetch contact details",
    );
  }
});

export const updateContact = createAsyncThunk<
  ContactResponse,
  UpdateContactRequest,
  { rejectValue: string; state: RootState }
>("contacts/updateContact", async (payload, { getState, rejectWithValue }) => {
  const token = getState().auth.token;
  if (!token) {
    return rejectWithValue("No authentication token found");
  }

  try {
    const response = await fetch(`${SERVER_URL}/contacts/${payload.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: payload.name,
        about: payload.about,
      }),
    });

    if (!response.ok) {
      return rejectWithValue(await getErrorMessage(response));
    }

    return (await response.json()) as ContactResponse;
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : "Failed to update contact",
    );
  }
});

const contactsSlice = createSlice({
  name: "contacts",
  initialState,
  reducers: {
    setContacts(state, action: PayloadAction<Contact[]>) {
      state.contacts = action.payload.map((contact) => parseContact(contact));
      state.status = "succeeded";
      state.error = null;
    },
    setCurrentPage(state, action: PayloadAction<number>) {
      state.currentPage = Math.max(1, action.payload);
    },
    setSelectedContactId(state, action: PayloadAction<string | null>) {
      state.selectedContactId = action.payload;
      state.selectedContactError = null;
      if (!action.payload) {
        state.selectedContactStatus = "idle";
      }
    },
    clearSelectedContact(state) {
      state.selectedContactId = null;
      state.selectedContactStatus = "idle";
      state.selectedContactError = null;
    },
    clearContacts(state) {
      state.contacts = [];
      state.status = "idle";
      state.error = null;
      state.selectedContactId = null;
      state.selectedContactStatus = "idle";
      state.selectedContactError = null;
      state.currentPage = 1;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchContacts.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchContacts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.contacts = (action.payload.contacts || []).map((contact) => parseContact(contact));
        const totalPages = Math.max(1, Math.ceil(state.contacts.length / state.pageSize));
        state.currentPage = Math.min(state.currentPage, totalPages);
        state.error = null;
      })
      .addCase(fetchContacts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "Failed to fetch contacts";
      })
      .addCase(createContact.fulfilled, (state, action) => {
        const created = parseContact(action.payload.contact);
        state.contacts = upsertContact(
          state.contacts.filter((item) => item.phoneNumber !== created.phoneNumber),
          created,
        );
        state.currentPage = 1;
        state.error = null;
      })
      .addCase(createContact.rejected, (state, action) => {
        state.error = action.payload ?? "Failed to create contact";
      })
      .addCase(fetchContactDetail.pending, (state, action) => {
        state.selectedContactId = action.meta.arg;
        state.selectedContactStatus = "loading";
        state.selectedContactError = null;
      })
      .addCase(fetchContactDetail.fulfilled, (state, action) => {
        const detail = parseContact(action.payload.contact);
        state.contacts = upsertContact(state.contacts, detail);
        state.selectedContactId = detail.id;
        state.selectedContactStatus = "succeeded";
        state.selectedContactError = null;
      })
      .addCase(fetchContactDetail.rejected, (state, action) => {
        state.selectedContactStatus = "failed";
        state.selectedContactError = action.payload ?? "Failed to fetch contact details";
      })
      .addCase(updateContact.pending, (state) => {
        state.selectedContactStatus = "loading";
        state.selectedContactError = null;
      })
      .addCase(updateContact.fulfilled, (state, action) => {
        const updated = parseContact(action.payload.contact);
        state.contacts = upsertContact(state.contacts, updated);
        state.selectedContactId = updated.id;
        state.selectedContactStatus = "succeeded";
        state.selectedContactError = null;
      })
      .addCase(updateContact.rejected, (state, action) => {
        state.selectedContactStatus = "failed";
        state.selectedContactError = action.payload ?? "Failed to update contact";
      });
  },
});

export const { setContacts, setCurrentPage, setSelectedContactId, clearSelectedContact, clearContacts } = contactsSlice.actions;
export default contactsSlice.reducer;
