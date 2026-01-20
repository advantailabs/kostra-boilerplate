import { Package } from '@/lib/prisma/generated/client';
import { PackageCreateManyInput } from '@/lib/prisma/generated/models';
import request from 'supertest';
import { testPrisma } from '../setup';

export const createPackage = async (appUrl: string, authCookie: string, packageData: unknown) => {
  return request(appUrl)
    .post('/api/packages')
    .set('Cookie', authCookie)
    .send(packageData as Package);
};

export const createDefaultPackageAndReturnId = async (appUrl: string, authCookie: string) => {
  const response = await createPackage(appUrl, authCookie, {
    title: 'Test Title',
    description: 'Test Description',
    price: 8.99,
    currencySymbol: '$',
  });

  return response.body.data.id;
};

// Creates multiple packages in the database with 3 as default
export const createPackagesInPrisma = async (
  packageData: unknown = [
    {
      title: 'First Package',
      description: 'Test Description',
      price: 1.99,
      currencySymbol: '$',
      isFeatured: true,
      features: [],
    },
    {
      title: 'Second Package',
      description: 'Test Description',
      price: 2,
      currencySymbol: '$',
      features: [],
    },
    {
      title: 'Third Package',
      description: 'Test Description',
      price: 3,
      currencySymbol: '$',
      features: [],
      isFeatured: true,
    },
  ]
) => {
  return await testPrisma.package.createManyAndReturn({
    data: packageData as PackageCreateManyInput[],
  });
};

export const updatePackage = async (
  appUrl: string,
  authCookie: string,
  packageId: number,
  packageData: unknown
) => {
  return request(appUrl)
    .patch(`/api/packages/${packageId}`)
    .set('Cookie', authCookie)
    .send(packageData as Package);
};
