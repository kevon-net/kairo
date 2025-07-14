import { INDEXED_DB } from '@/data/constants';
import { CategoryGet } from '@/types/models/category';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const stateItems = null satisfies CategoryGet[] | null as CategoryGet[] | null;

export const sliceCategories = createSlice({
  name: INDEXED_DB.CATEGORIES,
  initialState: {
    value: stateItems,
    deleted: stateItems,
    selectedCategory: null as CategoryGet | null,
  },
  reducers: {
    updateCategories: (state, action) => {
      state.value = action.payload;
    },
    updateDeletedCategories: (state, action) => {
      state.deleted = action.payload;
    },
    updateSelectedCategory: (
      state,
      action: PayloadAction<CategoryGet | null>
    ) => {
      state.selectedCategory = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  updateCategories,
  updateDeletedCategories,
  updateSelectedCategory,
} = sliceCategories.actions;

const reducerCategories = sliceCategories.reducer;
export default reducerCategories;
