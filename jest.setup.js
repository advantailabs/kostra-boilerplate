// Mock environment variables for testing
process.env.POSTGRES_URL =
  'postgresql://postgres:postgres@127.0.0.1:5433/kostra_test?schema=public';
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-jwt-secret-key-for-testing-only';
process.env.JWT_KEY = 'auth-token';

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  }),
  useSearchParams: () => ({
    get: jest.fn(),
  }),
  usePathname: () => '/test',
}));

// Global test utilities
global.console = {
  ...console,
  // Suppress console.error during tests unless explicitly needed
  error: jest.fn(),
  warn: jest.fn(),
};
