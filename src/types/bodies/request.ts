import { Provider } from '@prisma/client';
import { Credentials } from '../auth';
import { CommentCreate as typeCommentCreate } from '../models/comment';
import { ReplyCreate } from '../models/reply';
import { SessionUpdate as typeSessionUpdate } from '../models/session';
import { UserUpdate as typeUserUpdate } from '../models/user';

export type SignUp = {
  name: string;
  email: string;
  password: { initial: string };
};

export type SignIn = {
  provider?: Provider;
  credentials?: Credentials;
};

export type Verify = {
  otp: string;
  token: string | null;
  options?: { verified?: boolean; userId?: string };
};

export type VerifyResend = {
  userId: string;
  token: string | null;
  options?: { verified?: boolean; email?: string };
};

export type CommentCreate = Omit<typeCommentCreate, 'id'> & {
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

export type SessionUpdate = {
  session: typeSessionUpdate;
  options: { create?: boolean; userId: string };
};

export type UserUpdate = {
  user: typeUserUpdate;
  options?: { password?: string; token?: string; email?: string };
};

export type UserDelete = {
  userId: string;
  password?: string;
  options?: { trigger?: boolean };
};
