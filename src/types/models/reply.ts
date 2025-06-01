import { Prisma, Reply } from '@generated/prisma';

// Type for creating a item (without id and relations)
export type ReplyCreate = Prisma.ReplyCreateInput;

// Type for updating a item (all fields optional except id)
export type ReplyUpdate = Prisma.ReplyUpdateInput;

// Type for default item (with id and no relations)
export type ReplyGet = Reply;

// Type for fetched item with relations
export type ReplyRelations = Prisma.ReplyGetPayload<{
  include: {
    profile: true;
  };
}>;
