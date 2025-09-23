import { createSlice } from '@reduxjs/toolkit';

export type TimerMode = {
  mode: 'stopwatch' | 'timer';
};

export const sliceTimerMode = createSlice({
  name: 'timer-mode',
  initialState: {
    value: null satisfies TimerMode | null as TimerMode | null,
  },
  reducers: {
    update: (state, action) => {
      state.value = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { update: updateTimerMode } = sliceTimerMode.actions;

const reducerTimerMode = sliceTimerMode.reducer;
export default reducerTimerMode;
