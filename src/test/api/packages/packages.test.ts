import { UserRole } from '@/lib/prisma/generated/enums';
import { createTestUserWithPassword, getAdminUserCookie } from '@/test/helpers/auth';
import { createPackage } from '@/test/helpers/packages';
import { cleanupDatabase, testPrisma } from '@/test/setup';
import request from 'supertest';

// Mock JWT functions to avoid actual token generation in tests
jest.mock('@/lib/auth/jwt', () => ({
  generateJWT: jest.fn().mockImplementation(async payload => {
    // Create a mock JWT token for testing
    const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64');
    const body = Buffer.from(JSON.stringify(payload)).toString('base64');
    const signature = 'mock-signature';
    return `${header}.${body}.${signature}`;
  }),
  setAuthCookie: jest.fn(),
  JWT_KEY: 'auth-token',
}));

// Mock Next.js cookies
jest.mock('next/headers', () => ({
  cookies: jest.fn(() => ({
    set: jest.fn(),
    get: jest.fn(),
    delete: jest.fn(),
  })),
}));

describe('Packages API Endpoints - Integration Tests', () => {
  const appUrl = process.env.TEST_APP_URL || 'http://localhost:3001';
  let authCookie = '';

  beforeAll(async () => {
    // Ensure database is clean before starting tests
    await cleanupDatabase();

    // Create Admin User
    await createTestUserWithPassword({
      email: 'admin@example.com',
      password: 'AdminPassword123!',
      name: 'Admin User',
      role: UserRole.ADMIN,
    });

    // Log in with Admin User, only Admin has access to Packages API
    authCookie = await getAdminUserCookie(appUrl);
  });

  beforeEach(async () => {
    // Clean up package table before each test
    await testPrisma.package.deleteMany({});
  });

  afterEach(async () => {
    // Clean up after each test
    await cleanupDatabase();
  });

  afterAll(async () => {
    // Final cleanup
    await cleanupDatabase();
    await testPrisma.$disconnect();
  });

  describe('POST /api/packages', () => {
    it('should create a new package', async () => {
      // Only Admin has access to Packages API
      const packageData = {
        title: 'Test Title',
        description: 'Test Description',
        price: 8.99,
        currencySymbol: '$',
      };

      const response = await createPackage(appUrl, authCookie, packageData);

      expect(response.status).toEqual(200);

      const responseData = response.body;
      expect(responseData.success).toBe(true);
      expect(responseData.data.title).toBe(packageData.title);
      expect(responseData.data.description).toBe(packageData.description);
      expect(responseData.data.price).toBe(String(packageData.price));
      expect(responseData.data.currencySymbol).toBe('$');
    });

    it('should fail to create new package if required fields are missing', async () => {
      // Missing description field
      const packageData = {
        title: 'Test Title',
        price: 8.99,
        currencySymbol: '$',
      };

      const response = await createPackage(appUrl, authCookie, packageData);

      expect(response.status).toEqual(400);

      const responseData = response.body;
      expect(responseData.success).toBe(false);
      expect(responseData.message).toContain('Validation failed');
      expect(responseData.errors).toBeDefined();
      expect(responseData.errors).toEqual([{ field: 'description', message: 'Required' }]);
    });

    it('should fail to create new package if unauthorized', async () => {
      // Missing description field
      const packageData = {
        title: 'Test Title',
        description: 'Test Description',
        price: 8.99,
        currencySymbol: '$',
      };

      const response = await createPackage(appUrl, '', packageData);

      expect(response.status).toEqual(401);

      const responseData = response.body;
      expect(responseData.success).toBe(false);
      expect(responseData.message).toContain('Authentication required');
    });
  });

  describe('DELETE /api/packages/:id', () => {
    it('should delete an existing package', async () => {
      const createPackageRes = await createPackage(appUrl, authCookie, {
        title: 'Test Title',
        description: 'Test Description',
        price: 8.99,
        currencySymbol: '$',
      });

      const packageId = createPackageRes.body.data.id;

      const response = await request(appUrl)
        .delete(`/api/packages/${packageId}`)
        .set('Cookie', authCookie);

      expect(response.status).toEqual(200);

      // Confirm if Package is deleted from DB
      const findDeletedPackage = await testPrisma.package.findUnique({
        where: {
          id: packageId,
        },
      });
      expect(findDeletedPackage).toBeNull();
    });

    it('should fail with HTTP 404 when attempting to delete a non-existing package', async () => {
      const response = await request(appUrl)
        .delete(`/api/v1/todo/123456`)
        .set('Cookie', authCookie);

      expect(response.status).toEqual(404);
    });
  });
});
