import { execSync } from 'child_process';

export default async function globalSetup() {
  console.log('🔧 Setting up test database...');

  try {
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
