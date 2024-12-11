import { Tag, Prisma } from '@repo/schemas/node_modules/@prisma/client';

// Type for creating a tag (without id and relations)
export type TagCreate = Prisma.TagCreateInput;

// Type for updating a tag (all fields optional except id)
export type TagUpdate = Prisma.TagUpdateInput;

// Type for default tag (with id and no relations)
export type TagGet = Tag;

// Type for fetched tag with relations
export type TagRelations = Prisma.TagGetPayload<{
  include: {
    _count: { select: { posts: true } };

    posts: {
      include: {
        _count: { select: { comments: true } };

        category: { select: { id: true; title: true } };

        tags: { select: { id: true; title: true } };

        user: {
          select: { id: true };
          include: { profile: { select: { name: true; avatar: true } } };
        };

        comments: {
          select: {
            id: true;
            name: true;
            content: true;
            createdAt: true;
            postId: true;

            _count: { select: { replies: true } };

            user: {
              include: { profile: { select: { name: true; avatar: true } } };
            };

            replies: {
              select: {
                id: true;
                name: true;
                content: true;
                createdAt: true;
                commentId: true;

                user: {
                  include: {
                    profile: { select: { name: true; avatar: true } };
                  };
                };
              };
            };
          };
        };
      };
    };
  };
}>;
