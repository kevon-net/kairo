import { INDEXED_DB } from '@/data/constants';
import { CommentGet } from '@/types/models/comment';
import { SyncStatus } from '@generated/prisma';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type Omitted = Omit<CommentGet, 'sync_status' | 'created_at' | 'updated_at'>;

export const sliceComments = createSlice({
  name: INDEXED_DB.COMMENTS,
  initialState: {
    value: null satisfies CommentGet[] | null as CommentGet[] | null,
    deleted: [] as CommentGet[],
  },
  reducers: {
    setComments: (state, action: PayloadAction<CommentGet[]>) => {
      state.value = action.payload;
    },
    clearComments: (state) => {
      state.value = [];
    },
    setDeletedComments: (state, action: PayloadAction<CommentGet[]>) => {
      state.deleted = action.payload;
    },
    clearDeletedComments: (state) => {
      state.deleted = [];
    },
    addComment: (state, action: PayloadAction<Omitted>) => {
      if (!state.value) {
        state.value = [action.payload] as CommentGet[];
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
    updateComment: (state, action: PayloadAction<Omitted>) => {
      if (!state.value) return;

      const index = state.value.findIndex((n) => n.id === action.payload.id);

      if (index !== -1) {
        state.value[index] = {
          ...action.payload,
          sync_status: SyncStatus.PENDING,
          updated_at: new Date().toISOString() as any,
        } as CommentGet;
      }
    },
    deleteComment: (state, action: PayloadAction<Omitted>) => {
      if (!state.value) return;

      state.deleted.push({
        ...action.payload,
        sync_status: SyncStatus.DELETED,
        updated_at: new Date().toISOString() as any,
      } as CommentGet);

      state.value = state.value.filter((n) => n.id !== action.payload.id);
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  setComments,
  clearComments,
  setDeletedComments,
  clearDeletedComments,
  addComment,
  updateComment,
  deleteComment,
} = sliceComments.actions;

const reducerComments = sliceComments.reducer;
export default reducerComments;
