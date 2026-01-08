import { Package } from '@/lib/prisma/generated/client';
import request from 'supertest';

export const createPackage = async (appUrl: string, authCookie: string, packageData: unknown) => {
  return request(appUrl)
    .post('/api/packages')
    .set('Cookie', authCookie)
    .send(packageData as Package);
};

export const createPackageForUpdate = async (appUrl: string, authCookie: string) => {
  const response = await createPackage(appUrl, authCookie, {
    title: 'Test Title',
    description: 'Test Description',
    price: 8.99,
    currencySymbol: '$',
  });

  return response.body.data.id;
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
