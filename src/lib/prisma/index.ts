/* eslint-env node */
 
 
 
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from './generated/client';
declare global {
   
   
  var prisma: PrismaClient | undefined;
   
  var prismaListenersRegistered: boolean | undefined;
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

  // Currently because of a bug, prefer is equal to require
  // and will cause a connection error in development
  // Ref:- https://github.com/prisma/prisma/issues/27611
  // During build time, check if we should disable SSL for databases that don't support it
  const isBuilding = process.env.NEXT_PHASE === 'phase-production-build';
  const disableSSL = process.env.DISABLE_DB_SSL === 'true' || isBuilding;

  if (process.env.NODE_ENV === 'production' && process.env.TEST_MODE !== 'true' && !disableSSL) {
    url.searchParams.set('sslmode', 'disable');
  } else {
    url.searchParams.set('sslmode', 'disable');
  }

  return url.toString();
};

const adapter = new PrismaPg({ connectionString: createDatabaseUrl() });

export const prisma: PrismaClient =
  globalThis.prisma ||
  new PrismaClient({
    adapter,
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

// Register process event listeners only once to prevent memory leaks
// Using globalThis to survive HMR (Hot Module Replacement) in development
if (!globalThis.prismaListenersRegistered) {
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

  // Mark listeners as registered
  globalThis.prismaListenersRegistered = true;

  // Note: uncaughtException and unhandledRejection handlers removed
  // as Sentry already handles these globally
}
