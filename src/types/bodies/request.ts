import { CommentCreate as typeCommentCreate } from '../models/comment';
import { ReplyCreate } from '../models/reply';

export type CommentCreate = Omit<typeCommentCreate, 'id' | 'post'> & {
  postId: string;
  profileId?: string;
};

export type ReplyCommentCreate = Omit<ReplyCreate, 'id'> & {
  profileId?: string;
  commentId: string;
};

export type ReplyReplyCreate = Omit<ReplyCreate, 'id'> & {
  profileId?: string;
  replyId: string;
};
