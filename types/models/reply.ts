import { ReplyComment, ReplyReply, Prisma } from "@prisma/client";

// Type for creating a reply_comment (without id and relations)
export type ReplyCommentCreate = Prisma.ReplyCommentCreateInput;

// Type for updating a reply_comment (all fields optional except id)
export type ReplyCommentUpdate = Prisma.ReplyCommentUpdateInput;

// Type for default reply_comment (with id and no relations)
export type ReplyCommentGet = ReplyComment;

// Type for fetched reply_comment with relations
export type ReplyCommentRelations = Prisma.ReplyCommentGetPayload<{ include: { replies: true; user: true } }>;

// reply to replies

// Type for creating a reply_reply (without id and relations)
export type ReplyReplyCreate = Prisma.ReplyReplyCreateInput;

// Type for updating a reply_reply (all fields optional except id)
export type ReplyReplyUpdate = Prisma.ReplyReplyUpdateInput;

// Type for default reply_reply (with id and no relations)
export type ReplyReplyGet = ReplyReply;

// Type for fetched reply_reply with relations
export type ReplyReplyRelations = Prisma.ReplyReplyGetPayload<{ include: { user: true } }>;
