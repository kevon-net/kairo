import { Task, Prisma } from '@generated/prisma';

// Type for creating an item (without id and relations)
export type TaskCreate = Prisma.TaskCreateInput;

// Type for updating an item (all fields optional except id)
export type TaskUpdate = Prisma.TaskUpdateInput;

// Type for default item (with id and no relations)
export type TaskGet = Task;

// Type for fetched item with relations
export type TaskRelations = Prisma.TaskGetPayload<{
  include: {
    profile: true;
    tags: true;
    recurring_rule: true;
    reminders: true;
  };
}>;
