import { INDEXED_DB } from '@/data/constants';
import { NotificationGet } from '@/types/models/notification';
import { createSlice } from '@reduxjs/toolkit';

export const sliceNotifications = createSlice({
  name: INDEXED_DB.NOTIFICATIONS,
  initialState: {
    value: null satisfies NotificationGet[] | null as NotificationGet[] | null,
    deleted: [] as string[],
  },
  reducers: {
    updateNotifications: (state, action) => {
      state.value = action.payload;
    },
    updateDeletedNotifications: (state, action) => {
      state.deleted = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { updateNotifications, updateDeletedNotifications } =
  sliceNotifications.actions;

const reducerNotifications = sliceNotifications.reducer;
export default reducerNotifications;
