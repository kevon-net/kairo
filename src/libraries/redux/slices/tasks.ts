import { INDEXED_DB } from '@/data/constants';
import { TaskRelations } from '@/types/models/task';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export const sliceTasks = createSlice({
  name: INDEXED_DB.TASKS,
  initialState: {
    value: null satisfies TaskRelations[] | null as TaskRelations[] | null,
    selectedTask: null as TaskRelations | null,
    deleted: [] as string[],
  },
  reducers: {
    updateTasks: (state, action) => {
      state.value = action.payload;
    },
    updateSelectedTask: (
      state,
      action: PayloadAction<TaskRelations | null>
    ) => {
      state.selectedTask = action.payload;
    },
    updateDeletedTasks: (state, action) => {
      state.deleted = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { updateTasks, updateSelectedTask, updateDeletedTasks } =
  sliceTasks.actions;

const reducerTasks = sliceTasks.reducer;
export default reducerTasks;
