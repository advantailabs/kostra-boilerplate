const nextJest = require('next/jest');

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files
  dir: './',
});

// Add any custom config to be passed to Jest
const customJestConfig = {
  displayName: 'e2e-api-tests',
  testEnvironment: 'node',
  testMatch: ['<rootDir>/src/**/*.e2e.test.{js,ts}'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  collectCoverageFrom: [
    'src/app/api/**/*.{js,ts}',
    'src/services/**/*.{js,ts}',
    '!**/*.d.ts',
    '!**/*.test.{js,ts}',
    '!**/__tests__/**',
  ],
  coverageDirectory: 'coverage-e2e',
  coverageReporters: ['text', 'lcov', 'html'],
  setupFilesAfterEnv: ['<rootDir>/src/test/e2e-setup.ts'],
  testTimeout: 30000, // 30 seconds for database operations
  maxWorkers: 1, // Run tests serially to avoid database conflicts
  // Global setup and teardown
  globalSetup: '<rootDir>/src/test/global-setup.ts',
  globalTeardown: '<rootDir>/src/test/global-teardown.ts',
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig);
