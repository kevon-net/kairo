import { INDEXED_DB } from '@/data/constants';
import { ViewGet } from '@/types/models/view';
import { SyncStatus } from '@generated/prisma';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type Omitted = Omit<ViewGet, 'sync_status' | 'created_at' | 'updated_at'>;

export const sliceViews = createSlice({
  name: INDEXED_DB.VIEWS,
  initialState: {
    value: null satisfies ViewGet[] | null as ViewGet[] | null,
    deleted: [] as ViewGet[],
  },
  reducers: {
    setViews: (state, action: PayloadAction<ViewGet[]>) => {
      state.value = action.payload;
    },
    clearViews: (state) => {
      state.value = [];
    },
    setDeletedViews: (state, action: PayloadAction<ViewGet[]>) => {
      state.deleted = action.payload;
    },
    clearDeletedViews: (state) => {
      state.deleted = [];
    },
    addView: (state, action: PayloadAction<Omitted>) => {
      if (!state.value) {
        state.value = [action.payload] as ViewGet[];
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
    updateView: (state, action: PayloadAction<Omitted>) => {
      if (!state.value) return;

      const index = state.value.findIndex((n) => n.id === action.payload.id);

      if (index !== -1) {
        state.value[index] = {
          ...action.payload,
          sync_status: SyncStatus.PENDING,
          updated_at: new Date().toISOString() as any,
        } as ViewGet;
      }
    },
    deleteView: (state, action: PayloadAction<Omitted>) => {
      if (!state.value) return;

      state.deleted.push({
        ...action.payload,
        sync_status: SyncStatus.DELETED,
        updated_at: new Date().toISOString() as any,
      } as ViewGet);

      state.value = state.value.filter((n) => n.id !== action.payload.id);
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  setViews,
  clearViews,
  setDeletedViews,
  clearDeletedViews,
  addView,
  updateView,
  deleteView,
} = sliceViews.actions;

const reducerViews = sliceViews.reducer;
export default reducerViews;
