import { UserRole } from '@/lib/prisma/generated/enums';
import { createTestUserWithPassword, getAdminUserCookie } from '@/test/helpers/auth';
import {
  createDefaultPackageAndReturnId,
  createPackage,
  createPackagesInPrisma,
  updatePackage,
} from '@/test/helpers/packages';
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

    it('should fail to create new package if unauthenticated', async () => {
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
      const packageId = await createDefaultPackageAndReturnId(appUrl, authCookie);

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

    it('should fail with HTTP 500 when attempting to delete a non-existing package', async () => {
      const response = await request(appUrl)
        .delete(`/api/packages/123456`)
        .set('Cookie', authCookie);

      expect(response.status).toEqual(500);
    });

    it('should fail to delete package if unauthenticated', async () => {
      const packageId = createDefaultPackageAndReturnId(appUrl, authCookie);

      const response = await request(appUrl).delete(`/api/packages/${packageId}`);

      expect(response.status).toEqual(401);

      const responseData = response.body;
      expect(responseData.success).toBe(false);
      expect(responseData.message).toContain('Authentication required');
    });
  });

  describe('PATCH /api/packages/:id', () => {
    const updatedPkgData = {
      title: 'Updated Test Title',
      description: 'Changed Test Description',
      price: 4.99,
      currencySymbol: '$',
    };

    it('should update an existing package', async () => {
      const packageId = await createDefaultPackageAndReturnId(appUrl, authCookie);

      const response = await updatePackage(appUrl, authCookie, packageId, updatedPkgData);

      expect(response.status).toEqual(200);

      // Confirm if Package is Updated in DB
      const findDeletedPackage = await testPrisma.package.findUnique({
        where: {
          id: packageId,
        },
      });
      expect(findDeletedPackage?.title).toEqual(updatedPkgData.title);
      expect(findDeletedPackage?.description).toEqual(updatedPkgData.description);
      // Response price is a string so convert it to number before checks
      expect(Number(findDeletedPackage?.price)).toStrictEqual(updatedPkgData.price);
    });

    it('should fail with HTTP 500 when attempting to update a non-existing package', async () => {
      const response = await updatePackage(appUrl, authCookie, 123456, updatedPkgData);

      expect(response.status).toEqual(500);
    });

    it('should fail to update package if required fields are missing or of incorrect type', async () => {
      const packageId = await createDefaultPackageAndReturnId(appUrl, authCookie);

      const ValidationFailingPkgData = {
        title: 'Updated Test Title',
        price: 'some-price-string',
      };

      const response = await updatePackage(appUrl, authCookie, packageId, ValidationFailingPkgData);

      expect(response.status).toEqual(400);

      const responseData = response.body;
      expect(responseData.success).toBe(false);
      expect(responseData.message).toContain('Validation failed');
      expect(responseData.errors).toBeDefined();
      expect(responseData.errors).toEqual([
        { field: 'description', message: 'Required' },
        { field: 'price', message: 'Expected number, received string' },
        { field: 'currencySymbol', message: 'Required' },
      ]);
    });
    it('should fail to delete package if unauthenticated', async () => {
      const packageId = await createDefaultPackageAndReturnId(appUrl, authCookie);

      const response = await updatePackage(appUrl, '', packageId, updatedPkgData);

      expect(response.status).toEqual(401);

      const responseData = response.body;
      expect(responseData.success).toBe(false);
      expect(responseData.message).toContain('Authentication required');
    });
  });

  describe('GET /api/packages', () => {
    it('should get a list of packages', async () => {
      const testPackageList = await createPackagesInPrisma();

      const response = await request(appUrl).get('/api/packages').set('Cookie', authCookie);

      expect(response.status).toEqual(200);

      expect(response.body.data.data).toHaveLength(3);

      // Compares API response to Prisma output
      expect(response.body.data.data).toEqual(
        testPackageList.map(pkg => {
          return {
            ...pkg,
            price: String(pkg.price),
            createdAt: pkg.createdAt.toISOString(), // prisma returns JS Date object
            updatedAt: pkg.updatedAt.toISOString(), // while API returns
          };
        })
      );
    });

    it('should get a single package in a list matching the Title filter', async () => {
      const testPackageList = await createPackagesInPrisma();

      // Title is "Second Package" but this test should succeeed with partial match "Second"
      const response = await request(appUrl)
        .get(`/api/packages?title=Second`)
        .set('Cookie', authCookie);

      expect(response.status).toEqual(200);
      expect(response.body.data.data).toHaveLength(1);

      // Compares API response to Prisma output
      const compareObj = {
        ...testPackageList[1],
        price: String(testPackageList[1].price),
        createdAt: testPackageList[1].createdAt.toISOString(),
        updatedAt: testPackageList[1].updatedAt.toISOString(),
      };

      expect(response.body.data.data[0]).toEqual(compareObj);
    });

    it('should get a list of packages matching the isFeatured filter', async () => {
      await createPackagesInPrisma();
      const response = await request(appUrl)
        .get(`/api/packages?isFeatured=true`)
        .set('Cookie', authCookie);

      expect(response.status).toEqual(200);

      // Checks if API response array contains only featured packages
      expect(response.body.data.data).toEqual(
        expect.arrayContaining([expect.objectContaining({ isFeatured: true })])
      );
    });

    it('should return an empty list when filter matches no packages', async () => {
      await createPackagesInPrisma();
      const response = await request(appUrl)
        .get(`/api/packages?title=NonExistingTitle`)
        .set('Cookie', authCookie);

      expect(response.status).toEqual(200);
      expect(response.body.data.data).toEqual([]);
    });

    it('should return an error with invalid filter', async () => {
      await createPackagesInPrisma();
      const response = await request(appUrl)
        .get(`/api/packages?InvalidFilter=SomeValue`)
        .set('Cookie', authCookie);

      expect(response.status).toEqual(400);
      expect(response.body.success).toBe(false);
      expect(response.body.errors).toBeDefined();
      expect(response.body.errors).toEqual([
        { field: '', message: "Unrecognized key(s) in object: 'InvalidFilter'" },
      ]);
    });
    it('should fail to get a list of packages if unauthenticated', async () => {
      await createPackagesInPrisma();
      const response = await request(appUrl).get(`/api/packages`);

      expect(response.status).toEqual(401);

      const responseData = response.body;
      expect(responseData.success).toBe(false);
      expect(responseData.message).toContain('Authentication required');
    });
  });

  describe('GET /api/packages/:id', () => {
    it('should get a specific package by ID', async () => {
      const packageId = await createDefaultPackageAndReturnId(appUrl, authCookie);

      const response = await request(appUrl)
        .get(`/api/packages/${packageId}`)
        .set('Cookie', authCookie);

      expect(response.status).toEqual(200);

      const responseData = response.body.data;
      // Confirm if Package is in DB
      const findPackage = await testPrisma.package.findUnique({
        where: {
          id: packageId,
        },
      });
      expect(findPackage?.title).toEqual(responseData.title);
      expect(findPackage?.description).toEqual(responseData.description);
      // Response price is a string so convert it to number before checks
      expect(Number(findPackage?.price)).toStrictEqual(Number(responseData.price));
    });

    it('should fail with HTTP 404 when attempting to get a non-existing package', async () => {
      const response = await request(appUrl).get(`/api/packages/123456`).set('Cookie', authCookie);

      expect(response.status).toEqual(404);
    });

    it('should fail with validation error when sending an invalid package id', async () => {
      const response = await request(appUrl)
        .get(`/api/packages/1AbC@xyz`)
        .set('Cookie', authCookie);

      expect(response.status).toEqual(400);
    });

    it('should fail to delete package if unauthenticated', async () => {
      const packageId = await createDefaultPackageAndReturnId(appUrl, authCookie);

      const response = await request(appUrl).get(`/api/packages/${packageId}`);

      expect(response.status).toEqual(401);

      const responseData = response.body;
      expect(responseData.success).toBe(false);
      expect(responseData.message).toContain('Authentication required');
    });
  });
});
