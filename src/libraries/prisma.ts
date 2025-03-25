import { PrismaClient } from '@prisma/client';
import { isProduction } from '@/utilities/helpers/environment';

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({ log: ['info', 'warn', 'error'] });

if (!isProduction()) globalForPrisma.prisma = prisma;

export default prisma;
