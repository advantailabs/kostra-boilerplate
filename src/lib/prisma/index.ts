/* eslint-env node */
/* eslint-disable vars-on-top */
/* eslint-disable no-undef */
/* eslint-disable no-var */
import { PrismaClient } from '@prisma/client';

declare global {
  // eslint-disable-next-line no-var
  // eslint-disable-next-line no-unused-vars
  var prisma: PrismaClient | undefined;
}

// Create database URL with connection pooling parameters
const createDatabaseUrl = () => {
  const baseUrl = process.env.POSTGRES_URL;
  if (!baseUrl) {
    throw new Error('POSTGRES_URL environment variable is not set');
  }

  // Add connection pooling parameters to the URL
  const url = new URL(baseUrl);
  url.searchParams.set('connection_limit', '5');
  url.searchParams.set('pool_timeout', '20');
  url.searchParams.set('sslmode', 'prefer');

  return url.toString();
};

export const prisma: PrismaClient =
  globalThis.prisma ||
  new PrismaClient({
    datasources: {
      db: {
        url: createDatabaseUrl(),
      },
    },
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = prisma;
}

// Enhanced cleanup functions
const cleanup = async () => {
  try {
    await prisma.$disconnect();
    console.log('✅ Prisma client disconnected successfully');
  } catch (error) {
    console.error('❌ Error disconnecting Prisma client:', error);
  }
};

// Graceful shutdown handlers
process.on('beforeExit', cleanup);
process.on('SIGINT', async () => {
  await cleanup();
  process.exit(0);
});
process.on('SIGTERM', async () => {
  await cleanup();
  process.exit(0);
});

// Handle uncaught exceptions and promise rejections
process.on('uncaughtException', async error => {
  console.error('Uncaught Exception:', error);
  await cleanup();
  process.exit(1);
});

process.on('unhandledRejection', async (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  await cleanup();
  process.exit(1);
});
