import { Provider } from '@repo/schemas/node_modules/@prisma/client';
import {
  UserUpdate as typeUserUpdate,
  SessionUpdate as typeSessionUpdate,
  Credentials,
  CommentCreate as typeCommentCreate,
  ReplyCreate,
} from '@repo/types';

export type SignUp = {
  name: string;
  email: string;
  password: { initial: string };
};

export type SignIn = {
  provider: Provider;
  credentials: Credentials;
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
