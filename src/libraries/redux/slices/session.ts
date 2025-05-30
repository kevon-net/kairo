import { createSlice } from '@reduxjs/toolkit';
import { User } from '@supabase/supabase-js';

export const sliceSession = createSlice({
  name: 'session',
  initialState: {
    value: null as User | null satisfies User | null,
  },
  reducers: {
    updateSession: (state, action) => {
      state.value = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { updateSession } = sliceSession.actions;

const reducerSession = sliceSession.reducer;

export default reducerSession;
