import { Prisma, Profile } from '@generated/prisma';

// Type for creating a item (without id and relations)
export type ProfileCreate = Prisma.ProfileCreateInput;

// Type for updating a item (all fields optional except id)
export type ProfileUpdate = Prisma.ProfileUpdateInput;

// Type for default item (with id and no relations)
export type ProfileGet = Profile;

// Type for fetched item with relations
export type ProfileRelations = Prisma.ProfileGetPayload<{
  include: {
    addresses: true;
    posts: true;
    comments: true;
    replies: true;
  };
}>;
