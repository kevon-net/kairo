import { INDEXED_DB } from '@/data/constants';
import { PomoCycleGet } from '@/types/models/pomo-cycle';
import { SyncStatus } from '@generated/prisma';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type Omitted = Omit<PomoCycleGet, 'sync_status' | 'created_at' | 'updated_at'>;

export const slicePomoCycles = createSlice({
  name: INDEXED_DB.POMO_CYCLES,
  initialState: {
    value: null satisfies PomoCycleGet[] | null as PomoCycleGet[] | null,
    deleted: [] as PomoCycleGet[],
  },
  reducers: {
    setPomoCycles: (state, action: PayloadAction<PomoCycleGet[]>) => {
      state.value = action.payload;
    },
    clearPomoCycles: (state) => {
      state.value = [];
    },
    setDeletedPomoCycles: (state, action: PayloadAction<PomoCycleGet[]>) => {
      state.deleted = action.payload;
    },
    clearDeletedPomoCycles: (state) => {
      state.deleted = [];
    },
    addPomoCycle: (state, action: PayloadAction<Omitted>) => {
      if (!state.value) {
        state.value = [action.payload] as PomoCycleGet[];
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
    updatePomoCycle: (state, action: PayloadAction<Omitted>) => {
      if (!state.value) return;

      const index = state.value.findIndex((n) => n.id === action.payload.id);

      if (index !== -1) {
        state.value[index] = {
          ...action.payload,
          sync_status: SyncStatus.PENDING,
          updated_at: new Date().toISOString() as any,
        } as PomoCycleGet;
      }
    },
    deletePomoCycle: (state, action: PayloadAction<Omitted>) => {
      if (!state.value) return;

      state.deleted.push({
        ...action.payload,
        sync_status: SyncStatus.DELETED,
        updated_at: new Date().toISOString() as any,
      } as PomoCycleGet);

      state.value = state.value.filter((n) => n.id !== action.payload.id);
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  setPomoCycles,
  clearPomoCycles,
  setDeletedPomoCycles,
  clearDeletedPomoCycles,
  addPomoCycle,
  updatePomoCycle,
  deletePomoCycle,
} = slicePomoCycles.actions;

const reducerPomoCycles = slicePomoCycles.reducer;
export default reducerPomoCycles;
