import { Post, Prisma } from '@prisma/client';

// Type for creating a post (without id and relations)
export type PostCreate = Prisma.PostCreateInput;

// Type for updating a post (all fields optional except id)
export type PostUpdate = Prisma.PostUpdateInput;

// Type for default post (with id and no relations)
export type PostGet = Post;

// Type for fetched post with relations
export type PostRelations = Prisma.PostGetPayload<{
  include: {
    _count: { select: { comments: true } };
    category: { select: { id: true; title: true } };
    tags: { select: { id: true; title: true } };
    user: {
      select: { id: true };
      include: { profile: { select: { name: true; avatar: true } } };
    };
  };
}>;
