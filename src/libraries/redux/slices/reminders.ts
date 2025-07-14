import { INDEXED_DB } from '@/data/constants';
import { ReminderGet } from '@/types/models/reminder';
import { createSlice } from '@reduxjs/toolkit';

export const sliceReminders = createSlice({
  name: INDEXED_DB.REMINDERS,
  initialState: {
    value: [] satisfies ReminderGet[] as ReminderGet[],
    deleted: [] as string[],
  },
  reducers: {
    updateReminders: (state, action) => {
      state.value = action.payload;
    },
    updateDeletedReminders: (state, action) => {
      state.deleted = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { updateReminders, updateDeletedReminders } =
  sliceReminders.actions;

const reducerReminders = sliceReminders.reducer;
export default reducerReminders;
