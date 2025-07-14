import { INDEXED_DB } from '@/data/constants';
import { ViewGet } from '@/types/models/views';
import { createSlice } from '@reduxjs/toolkit';

export const sliceViews = createSlice({
  name: INDEXED_DB.VIEWS,
  initialState: {
    value: null satisfies ViewGet[] | null as ViewGet[] | null,
    deleted: [] as string[],
  },
  reducers: {
    updateViews: (state, action) => {
      state.value = action.payload;
    },
    updateDeletedViews: (state, action) => {
      state.deleted = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { updateViews, updateDeletedViews } = sliceViews.actions;

const reducerViews = sliceViews.reducer;
export default reducerViews;
