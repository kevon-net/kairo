import { Reminder, Prisma } from '@generated/prisma';

// Type for creating an item (without id and relations)
export type ReminderCreate = Prisma.ReminderCreateInput;

// Type for updating an item (all fields optional except id)
export type ReminderUpdate = Prisma.ReminderUpdateInput;

// Type for default item (with id and no relations)
export type ReminderGet = Reminder;

// Type for fetched item with relations
export type ReminderRelations = Prisma.ReminderGetPayload<{
  include: { task: true };
}>;
