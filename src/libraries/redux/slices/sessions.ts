import { INDEXED_DB } from '@/data/constants';
import { SessionGet } from '@/types/models/session';
import { SyncStatus } from '@generated/prisma';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type Omitted = Omit<SessionGet, 'sync_status' | 'created_at' | 'updated_at'>;

export const sliceSessions = createSlice({
  name: INDEXED_DB.SESSIONS,
  initialState: {
    value: null satisfies SessionGet[] | null as SessionGet[] | null,
    deleted: [] as SessionGet[],
  },
  reducers: {
    setSessions: (state, action: PayloadAction<SessionGet[]>) => {
      state.value = action.payload;
    },
    clearSessions: (state) => {
      state.value = [];
    },
    setDeletedSessions: (state, action: PayloadAction<SessionGet[]>) => {
      state.deleted = action.payload;
    },
    clearDeletedSessions: (state) => {
      state.deleted = [];
    },
    addSession: (state, action: PayloadAction<Omitted>) => {
      if (!state.value) {
        state.value = [action.payload] as SessionGet[];
      } else {
        const now = new Date();

        state.value.push({
          ...action.payload,
          sync_status: SyncStatus.PENDING,
          created_at: now.toISOString() as any,
          updated_at: now.toISOString() as any,
        });
      }
    },
    updateSession: (state, action: PayloadAction<Omitted>) => {
      if (!state.value) return;

      const index = state.value.findIndex((n) => n.id === action.payload.id);

      if (index !== -1) {
        state.value[index] = {
          ...action.payload,
          sync_status: SyncStatus.PENDING,
          updated_at: new Date().toISOString() as any,
        } as SessionGet;
      }
    },
    deleteSession: (state, action: PayloadAction<Omitted>) => {
      if (!state.value) return;

      state.deleted.push({
        ...action.payload,
        sync_status: SyncStatus.DELETED,
        updated_at: new Date().toISOString() as any,
      } as SessionGet);

      state.value = state.value.filter((n) => n.id !== action.payload.id);
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  setSessions,
  clearSessions,
  setDeletedSessions,
  clearDeletedSessions,
  addSession,
  updateSession,
  deleteSession,
} = sliceSessions.actions;

const reducerSessions = sliceSessions.reducer;
export default reducerSessions;
