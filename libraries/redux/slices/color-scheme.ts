import { createSlice } from '@reduxjs/toolkit';

export const sliceColorScheme = createSlice({
  name: 'color-scheme',
  initialState: {
    value: 'light',
  },
  reducers: {
    update: (state, action) => {
      state.value = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { update: updateColorScheme } = sliceColorScheme.actions;

const reducerColorScheme = sliceColorScheme.reducer;
export default reducerColorScheme;
