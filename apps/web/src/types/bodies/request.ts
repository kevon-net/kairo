import { CommentCreate as typeCommentCreate, ReplyCreate } from '@repo/types';

export type CommentCreate = Omit<typeCommentCreate, 'id' | 'post'> & {
  postId: string;
  userId?: string;
};

export type ReplyCommentCreate = Omit<ReplyCreate, 'id'> & {
  userId?: string;
  commentId: string;
};

export type ReplyReplyCreate = Omit<ReplyCreate, 'id'> & {
  userId?: string;
  replyId: string;
};
