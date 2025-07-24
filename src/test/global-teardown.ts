import { disconnectTestDatabase } from './setup';

export default async function globalTeardown() {
  console.log('🧹 Cleaning up test database...');

  try {
    await disconnectTestDatabase();
    console.log('✅ Test database cleanup complete');
  } catch (error) {
    console.error('❌ Failed to cleanup test database:', error);
  }
}
