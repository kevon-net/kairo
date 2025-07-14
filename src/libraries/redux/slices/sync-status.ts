import { SyncStatus } from '@generated/prisma';
import { createSlice } from '@reduxjs/toolkit';

export const sliceSyncStatus = createSlice({
  name: 'sync-status',
  initialState: {
    value: SyncStatus.SYNCED as SyncStatus satisfies SyncStatus,
  },
  reducers: {
    update: (state, action) => {
      state.value = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { update: updateSyncStatus } = sliceSyncStatus.actions;

const reducerSyncStatus = sliceSyncStatus.reducer;
export default reducerSyncStatus;
