import { INDEXED_DB } from '@/data/constants';
import { NotificationGet } from '@/types/models/notification';
import { SyncStatus } from '@generated/prisma';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type Omitted = Omit<
  NotificationGet,
  'sync_status' | 'created_at' | 'updated_at'
>;

export const sliceNotifications = createSlice({
  name: INDEXED_DB.NOTIFICATIONS,
  initialState: {
    value: null satisfies NotificationGet[] | null as NotificationGet[] | null,
    deleted: [] as NotificationGet[],
  },
  reducers: {
    setNotifications: (state, action: PayloadAction<NotificationGet[]>) => {
      state.value = action.payload;
    },
    clearNotifications: (state) => {
      state.value = [];
    },
    setDeletedNotifications: (
      state,
      action: PayloadAction<NotificationGet[]>
    ) => {
      state.deleted = action.payload;
    },
    clearDeletedNotifications: (state) => {
      state.deleted = [];
    },
    addNotification: (state, action: PayloadAction<Omitted>) => {
      if (!state.value) {
        state.value = [action.payload] as NotificationGet[];
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
    updateNotification: (state, action: PayloadAction<Omitted>) => {
      if (!state.value) return;

      const index = state.value.findIndex((n) => n.id === action.payload.id);

      if (index !== -1) {
        state.value[index] = {
          ...action.payload,
          sync_status: SyncStatus.PENDING,
          updated_at: new Date().toISOString() as any,
        } as NotificationGet;
      }
    },
    deleteNotification: (state, action: PayloadAction<Omitted>) => {
      if (!state.value) return;

      state.deleted.push({
        ...action.payload,
        sync_status: SyncStatus.DELETED,
        updated_at: new Date().toISOString() as any,
      } as NotificationGet);

      state.value = state.value.filter((n) => n.id !== action.payload.id);
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  setNotifications,
  clearNotifications,
  setDeletedNotifications,
  clearDeletedNotifications,
  addNotification,
  updateNotification,
  deleteNotification,
} = sliceNotifications.actions;

const reducerNotifications = sliceNotifications.reducer;
export default reducerNotifications;
