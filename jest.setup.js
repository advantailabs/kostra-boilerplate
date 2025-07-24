// Mock environment variables for testing
process.env.POSTGRES_URL = 'postgresql://test:test@localhost:5432/test';
process.env.NODE_ENV = 'test';

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
