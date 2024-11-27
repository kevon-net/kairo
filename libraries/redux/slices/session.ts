import { Session } from '@/types/redux';
import { createSlice } from '@reduxjs/toolkit';

export const sliceSession = createSlice({
  name: 'session',
  initialState: {
    value: null satisfies Session as Session,
  },
  reducers: {
    update: (state, action) => {
      state.value = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { update: updateSession } = sliceSession.actions;

const reducerSession = sliceSession.reducer;
export default reducerSession;
