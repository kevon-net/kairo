import { Comment, Prisma } from '@prisma/client';

// Type for creating a comment (without id and relations)
export type CommentCreate = Prisma.CommentCreateInput;

// Type for updating a comment (all fields optional except id)
export type CommentUpdate = Prisma.CommentUpdateInput;

// Type for default comment (with id and no relations)
export type CommentGet = Comment;

// Type for fetched comment with relations
export type CommentRelations = Prisma.CommentGetPayload<{
  include: {
    post: true;

    _count: { select: { replies: true } };

    profile: true;
    replies: {
      include: {
        _count: { select: { replies: true } };

        profile: true;
      };
    };
  };
}>;
