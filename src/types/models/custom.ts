import { PostRelations as typePostRelations } from '@/types/models/post';
import { CommentCreate as typeCommentCreate } from '../models/comment';
import { ReplyCreate, ReplyRelations } from './reply';
import { CommentRelations } from './comment';

export interface PostCommentReply extends ReplyRelations {
  replies?: ReplyRelations[];
  _count?: { replies: number };
}

export interface PostComment extends Omit<CommentRelations, 'replies'> {
  replies?: PostCommentReply[];
}

export interface PostRelations extends Omit<typePostRelations, 'comments'> {
  comments: PostComment[];
}

export type CommentCreate = Omit<typeCommentCreate, 'id' | 'post'> & {
  postId: string;
  profile_id?: string;
};

export type ReplyCommentCreate = Omit<ReplyCreate, 'id'> & {
  profile_id?: string;
  comment_id: string;
};

export type ReplyReplyCreate = Omit<ReplyCreate, 'id'> & {
  profile_id?: string;
  reply_id: string;
};
