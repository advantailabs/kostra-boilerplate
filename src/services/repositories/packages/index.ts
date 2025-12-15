import { prisma } from '@/lib/prisma';
import { Prisma } from '@/lib/prisma/generated/client';
import { CreatePackageInput, UpdatePackageInput } from '@/schemas/package.schema';

export const createNewPackage = async (packageData: CreatePackageInput) => {
  const newPackage = await prisma.package.create({
    data: {
      title: packageData.title,
      description: packageData.description,
      isFeatured: packageData.isFeatured || false,
      price: new Prisma.Decimal(packageData.price),
      currencySymbol: packageData.currencySymbol,
      features: packageData.features,
    },
  });

  return newPackage;
};

export const getAllPackages = async (filters?: {
  title?: string;
  isFeatured?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}) => {
  try {
    const where = {
      ...(filters?.title && {
        title: {
          contains: filters.title,
          mode: 'insensitive' as const,
        },
      }),
      ...(filters?.isFeatured !== undefined && {
        isFeatured: filters.isFeatured,
      }),
    };

    // Parse pagination parameters
    const page = filters?.page || 1;
    const limit = filters?.limit || 10;
    const offset = (page - 1) * limit;

    // Get total count for pagination metadata
    const totalCount = await prisma.package.count({ where });

    // Get paginated results
    const packages = await prisma.package.findMany({
      where,
      orderBy: {
        [filters?.sortBy || 'createdAt']: filters?.sortOrder || 'desc',
      },
      skip: offset,
      take: limit,
    });

    // Calculate pagination metadata
    const totalPages = Math.ceil(totalCount / limit);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;

    return {
      data: packages,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages,
        hasNextPage,
        hasPreviousPage,
      },
    };
  } catch (error) {
    console.error('Error in getAllPackages:', error);
    throw error;
  }
};

export const updatePackageById = async (id: number, data: UpdatePackageInput) => {
  const existingPackage = await prisma.package.findUnique({
    where: { id },
  });

  if (!existingPackage) {
    throw new Error(`Package with ID ${id} not found`);
  }

  return prisma.package.update({
    where: { id },
    data: {
      title: data.title,
      description: data.description,
      isFeatured: data.isFeatured,
      price: data.price ? new Prisma.Decimal(data.price) : undefined,
      currencySymbol: data.currencySymbol,
      features: data.features,
    },
  });
};

export const deletePackageById = async (id: number) => {
  return prisma.package.delete({
    where: { id },
  });
};

export const getPackageById = async (id: number) => {
  return prisma.package.findUnique({
    where: { id },
  });
};
