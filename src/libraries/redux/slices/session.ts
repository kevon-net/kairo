import { createSlice } from '@reduxjs/toolkit';

export const sliceSession = createSlice({
  name: 'session',
  initialState: {
    value: null as any satisfies any,
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
