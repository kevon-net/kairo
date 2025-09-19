import { INDEXED_DB } from '@/data/constants';
import { CategoryGet } from '@/types/models/category';
import { SyncStatus } from '@generated/prisma';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type Omitted = Omit<CategoryGet, 'sync_status' | 'created_at' | 'updated_at'>;

export const sliceCategories = createSlice({
  name: INDEXED_DB.CATEGORIES,
  initialState: {
    value: null satisfies CategoryGet[] | null as CategoryGet[] | null,
    deleted: [] as CategoryGet[],
  },
  reducers: {
    setCategories: (state, action: PayloadAction<CategoryGet[]>) => {
      state.value = action.payload;
    },
    clearCategories: (state) => {
      state.value = [];
    },
    setDeletedCategories: (state, action: PayloadAction<CategoryGet[]>) => {
      state.deleted = action.payload;
    },
    clearDeletedCategories: (state) => {
      state.deleted = [];
    },
    addCategory: (state, action: PayloadAction<Omitted>) => {
      if (!state.value) {
        state.value = [action.payload] as CategoryGet[];
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
    updateCategory: (state, action: PayloadAction<Omitted>) => {
      if (!state.value) return;

      const index = state.value.findIndex((n) => n.id === action.payload.id);

      if (index !== -1) {
        state.value[index] = {
          ...action.payload,
          sync_status: SyncStatus.PENDING,
          updated_at: new Date().toISOString() as any,
        } as CategoryGet;
      }
    },
    deleteCategory: (state, action: PayloadAction<Omitted>) => {
      if (!state.value) return;

      state.deleted.push({
        ...action.payload,
        sync_status: SyncStatus.DELETED,
        updated_at: new Date().toISOString() as any,
      } as CategoryGet);

      state.value = state.value.filter((n) => n.id !== action.payload.id);
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  setCategories,
  clearCategories,
  setDeletedCategories,
  clearDeletedCategories,
  addCategory,
  updateCategory,
  deleteCategory,
} = sliceCategories.actions;

const reducerCategories = sliceCategories.reducer;
export default reducerCategories;
