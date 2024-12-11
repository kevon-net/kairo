import { Account, Prisma } from '@repo/schemas/node_modules/@prisma/client';

// Type for creating an account (without id and relations)
export type AccountCreate = Prisma.AccountCreateInput;

// Type for updating an account (all fields optional except id)
export type AccountUpdate = Prisma.AccountUpdateInput;

// Type for default account (with id and no relations)
export type AccountGet = Account;

// Type for fetched category with relations
export type AccountRelations = Prisma.AccountGetPayload<{
  include: { user: true };
}>;
