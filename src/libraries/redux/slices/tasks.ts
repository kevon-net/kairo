import { INDEXED_DB } from '@/data/constants';
import { TaskGet } from '@/types/models/task';
import { SyncStatus } from '@generated/prisma';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type Omitted = Omit<TaskGet, 'sync_status' | 'created_at' | 'updated_at'>;

export const sliceTasks = createSlice({
  name: INDEXED_DB.TASKS,
  initialState: {
    value: null satisfies TaskGet[] | null as TaskGet[] | null,
    deleted: [] as TaskGet[],
  },
  reducers: {
    setTasks: (state, action: PayloadAction<TaskGet[]>) => {
      state.value = action.payload;
    },
    clearTasks: (state) => {
      state.value = [];
    },
    setDeletedTasks: (state, action: PayloadAction<TaskGet[]>) => {
      state.deleted = action.payload;
    },
    clearDeletedTasks: (state) => {
      state.deleted = [];
    },
    addTask: (state, action: PayloadAction<Omitted>) => {
      if (!state.value) {
        state.value = [action.payload] as TaskGet[];
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
    updateTask: (state, action: PayloadAction<Omitted>) => {
      if (!state.value) return;

      const index = state.value.findIndex((n) => n.id === action.payload.id);

      if (index !== -1) {
        state.value[index] = {
          ...action.payload,
          sync_status: SyncStatus.PENDING,
          updated_at: new Date().toISOString() as any,
        } as TaskGet;
      }
    },
    deleteTask: (state, action: PayloadAction<Omitted>) => {
      if (!state.value) return;

      state.deleted.push({
        ...action.payload,
        sync_status: SyncStatus.DELETED,
        updated_at: new Date().toISOString() as any,
      } as TaskGet);

      state.value = state.value.filter((n) => n.id !== action.payload.id);
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  setTasks,
  clearTasks,
  setDeletedTasks,
  clearDeletedTasks,
  addTask,
  updateTask,
  deleteTask,
} = sliceTasks.actions;

const reducerTasks = sliceTasks.reducer;
export default reducerTasks;
