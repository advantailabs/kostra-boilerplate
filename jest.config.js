const nextJest = require('next/jest');

const createJestConfig = nextJest({
  // Path to your Next.js app
  dir: './',
});

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'node',

  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.{js,jsx,ts,tsx}',
    '<rootDir>/src/**/*.{test,spec}.{js,jsx,ts,tsx}',
    '<rootDir>/src/**/*.e2e.test.{js,ts}',
  ],

  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },

  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.{js,jsx,ts,tsx}',
    '!src/**/index.{js,jsx,ts,tsx}',
    '!src/**/*.test.{js,jsx,ts,tsx}',
    '!src/**/*.e2e.test.{js,ts}',
    '!src/**/__tests__/**',
  ],

  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],

  testTimeout: 30000, // e2e tests may take longer
  maxWorkers: 1, // serial to avoid conflicts
  verbose: true,
  silent: false,
  cache: false,
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/', // default ignored
    '<rootDir>/.next/', // default ignored
    '<rootDir>/lib/prisma/generated/', // generated files
  ],
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', { presets: ['next/babel'] }],
  },
  transformIgnorePatterns: [
    'node_modules/(?!(jose|@panva|prisma|@prisma/client|@prisma/adapter-pg|.pnpm)/)',
  ],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],

  // Global setup and teardown for e2e tests
  globalSetup: '<rootDir>/src/test/global-setup.ts',
  globalTeardown: '<rootDir>/src/test/global-teardown.ts',
};

module.exports = createJestConfig(customJestConfig);
