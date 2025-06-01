import { Prisma, Tag } from '@generated/prisma';

// Type for creating a item (without id and relations)
export type TagCreate = Prisma.TagCreateInput;

// Type for updating a item (all fields optional except id)
export type TagUpdate = Prisma.TagUpdateInput;

// Type for default item (with id and no relations)
export type TagGet = Tag;

// Type for fetched item with relations
export type TagRelations = Prisma.TagGetPayload<{
  include: {
    _count: { select: { posts: true } };

    posts: {
      include: {
        _count: { select: { comments: true } };

        category: true;
        tags: true;
        profile: true;
        comments: true;
      };
    };
  };
}>;
