import { AppShell } from '@/types/components/app-shell';
import { createSlice } from '@reduxjs/toolkit';

export const sliceAppShell = createSlice({
  name: 'app-shell',
  initialState: {
    value: null satisfies AppShell | null as AppShell | null,
  },
  reducers: {
    update: (state, action) => {
      state.value = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { update: updateAppShell } = sliceAppShell.actions;

const reducerAppShell = sliceAppShell.reducer;
export default reducerAppShell;
