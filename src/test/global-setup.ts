import { execSync } from 'child_process';

export default async function globalSetup() {
  console.log('🔧 Setting up test database...');

  try {
    if (process.env.SKIP_DB_SETUP === '1') {
      console.log('⏭️  SKIP_DB_SETUP=1 set, skipping database setup for tests');
      return;
    }
    // Set test database URL
    const testDatabaseUrl = 'postgresql://postgres:postgres@127.0.0.1:5432/test';
    process.env.POSTGRES_URL = testDatabaseUrl;

    console.log(`📂 Using test database: ${testDatabaseUrl}`);

    console.log('🗄️ Deploying database schema...');
    // Use db push instead of migrate for testing
    execSync('npx prisma db push --force-reset', {
      stdio: 'inherit',
      env: { ...process.env },
    });

    console.log('✅ Test database setup complete');
  } catch (error) {
    console.error('❌ Failed to setup test database:', error);
    throw error;
  }
}
