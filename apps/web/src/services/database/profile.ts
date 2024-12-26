'use server';

import prisma from '@/libraries/prisma';
import { ProfileCreate, ProfileUpdate } from '@repo/types';

export const profileCreate = async (params: ProfileCreate) => {
  try {
    await prisma.$transaction(async (prisma) => {
      const profile = await prisma.profile.findUnique({
        where: { id: params.id },
      });

      if (profile) {
        throw new Error('Profile already exists');
      }

      await prisma.profile.create({ data: params });
    });
  } catch (error) {
    console.error('---> service error - (create profile):', error);
  }
};

export const profileUpdate = async (params: ProfileUpdate) => {
  try {
    await prisma.$transaction(async (prisma) => {
      const profile = await prisma.profile.findUnique({
        where: { id: params.id as string },
      });

      if (profile) {
        throw new Error('Profile already exists');
      }

      await prisma.profile.update({
        where: { id: params.id as string },
        data: params,
      });
    });
  } catch (error) {
    console.error('---> service error - (create profile):', error);
  }
};
