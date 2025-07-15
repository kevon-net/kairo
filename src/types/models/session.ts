import { Session, Prisma } from '@generated/prisma';

// Type for creating an item (without id and relations)
export type SessionCreate = Prisma.SessionCreateInput;

// Type for updating an item (all fields optional except id)
export type SessionUpdate = Prisma.SessionUpdateInput;

// Type for default item (with id and no relations)
export type SessionGet = Session;

// Type for fetched item with relations
export type SessionRelations = Prisma.SessionGetPayload<{
  include: {
    profile: true;
    category: true;
    task: true;
  };
}>;
