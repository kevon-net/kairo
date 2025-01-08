import { Category, Prisma } from '@prisma/client';

// Type for creating a category (without id and relations)
export type CategoryCreate = Prisma.CategoryCreateInput;

// Type for updating a category (all fields optional except id)
export type CategoryUpdate = Prisma.CategoryUpdateInput;

// Type for default category (with id and no relations)
export type CategoryGet = Category;

// Type for fetched category with relations
export type CategoryRelations = Prisma.CategoryGetPayload<{
  include: {
    _count: { select: { posts: true } };

    posts: {
      include: {
        _count: { select: { comments: true } };

        category: { select: { id: true; title: true } };

        tags: { select: { id: true; title: true } };

        profile: {
          select: { id: true; firstName: true; lastName: true; avatar: true };
        };

        comments: {
          select: {
            id: true;
            name: true;
            content: true;
            createdAt: true;
            postId: true;

            _count: { select: { replies: true } };

            profile: {
              select: { firstName: true; lastName: true; avatar: true };
            };

            replies: {
              select: {
                id: true;
                name: true;
                content: true;
                createdAt: true;
                commentId: true;

                profile: {
                  select: { firstName: true; lastName: true; avatar: true };
                };
              };
            };
          };
        };
      };
    };
  };
}>;
