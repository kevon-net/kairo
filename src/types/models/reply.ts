import { Reply, Prisma } from '@prisma/client';

// Type for creating a reply_comment (without id and relations)
export type ReplyCreate = Prisma.ReplyCreateInput;

// Type for updating a reply_comment (all fields optional except id)
export type ReplyUpdate = Prisma.ReplyUpdateInput;

// Type for default reply_comment (with id and no relations)
export type ReplyGet = Reply;

// Type for fetched reply_comment with relations
export type ReplyRelations = Prisma.ReplyGetPayload<{
  select: {
    id: true;
    name: true;
    content: true;
    createdAt: true;
    commentId: true;
    replyId: true;
  };

  include: {
    profile: {
      select: { firstName: true; lastName: true; avatar: true };
    };
  };
}>;
