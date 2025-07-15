import { INDEXED_DB } from '@/data/constants';
import { SessionRelations } from '@/types/models/session';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export const sliceSessions = createSlice({
  name: INDEXED_DB.SESSIONS,
  initialState: {
    value: null satisfies SessionRelations[] | null as
      | SessionRelations[]
      | null,
    selectedSession: null as SessionRelations | null,
    deleted: [] as string[],
  },
  reducers: {
    updateSessions: (state, action) => {
      state.value = action.payload;
    },
    updateSelectedSession: (
      state,
      action: PayloadAction<SessionRelations | null>
    ) => {
      state.selectedSession = action.payload;
    },
    updateDeletedSessions: (state, action) => {
      state.deleted = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { updateSessions, updateSelectedSession, updateDeletedSessions } =
  sliceSessions.actions;

const reducerSessions = sliceSessions.reducer;
export default reducerSessions;
