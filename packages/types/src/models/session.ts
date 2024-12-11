import { Session, Prisma } from '@repo/schemas/node_modules/@prisma/client';

// Type for creating a session (without id and relations)
export type SessionCreate = Prisma.SessionCreateInput;

// Type for updating a session (all fields optional except id)
export type SessionUpdate = Prisma.SessionUpdateInput;

// Type for default session (with id and no relations)
export type SessionGet = Session;

// Type for fetched session with relations
export type SessionRelations = Prisma.SessionGetPayload<{
  include: { user: true };
}>;
