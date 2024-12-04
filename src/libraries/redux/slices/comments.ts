import { PostComment } from '@/types/static';
import { createSlice } from '@reduxjs/toolkit';

export const sliceComments = createSlice({
  name: 'comments',
  initialState: {
    value: [] satisfies PostComment[] as PostComment[],
  },
  reducers: {
    update: (state, action) => {
      state.value = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { update: updateComments } = sliceComments.actions;

const reducerComments = sliceComments.reducer;
export default reducerComments;
