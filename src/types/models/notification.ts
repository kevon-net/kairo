import { Prisma, Notification } from '@generated/prisma';

// Type for creating a item (without id and relations)
export type NotificationCreate = Prisma.NotificationCreateInput;

// Type for updating a item (all fields optional except id)
export type NotificationUpdate = Prisma.NotificationUpdateInput;

// Type for default item (with id and no relations)
export type NotificationGet = Notification;

// Type for fetched item with relations
export type NotificationRelations = Prisma.NotificationGetPayload<{
  include: {
    profile: true;
  };
}>;
