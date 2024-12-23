import { PrismaClient } from '@repo/schemas/node_modules/@prisma/client';
import { isProduction } from '@repo/utils/helpers';

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({ log: ['info', 'warn', 'error'] });

if (!isProduction()) globalForPrisma.prisma = prisma;

export default prisma;
