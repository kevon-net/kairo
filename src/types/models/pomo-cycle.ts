import { Prisma, PomoCycle } from '@generated/prisma';

// Type for creating a item (without id and relations)
export type PomoCycleCreate = Prisma.PomoCycleCreateInput;

// Type for updating a item (all fields optional except id)
export type PomoCycleUpdate = Prisma.PomoCycleUpdateInput;

// Type for default item (with id and no relations)
export type PomoCycleGet = PomoCycle;

// Type for fetched item with relations
export type PomoCycleRelations = Prisma.PomoCycleGetPayload<{
  include: {
    _count: { select: { sessions: true } };
    sessions: true;
  };
}>;
