import { cleanupDatabase } from './setup';

// Clean up database before each test file
beforeEach(async () => {
  await cleanupDatabase();
});

// Mock Clerk auth module
jest.mock('@clerk/nextjs/server', () => ({
  auth: jest.fn(),
}));

// Mock console to reduce noise in tests
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

beforeAll(() => {
  console.error = jest.fn();
  console.warn = jest.fn();
});

afterAll(() => {
  console.error = originalConsoleError;
  console.warn = originalConsoleWarn;
});
