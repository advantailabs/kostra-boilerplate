import { prisma } from '@/lib/prisma';
import { CreateCategoryInput, UpdateCategoryInput } from '@/schemas/category.schema';

// Helper function to generate a unique suffix using timestamp and random number
const generateUniqueSuffix = (): string => {
  const timestamp = Date.now().toString().slice(-6); // Last 6 digits of timestamp
  const random = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, '0'); // 3-digit random
  return `${timestamp}-${random}`;
};

export const createNewCategory = async (categoryData: CreateCategoryInput) => {
  try {
    // Normalize the input data
    const normalizedName = categoryData.name.trim();
    const normalizedSlug = categoryData.slug.trim();

    // Check for name conflicts (case-insensitive)
    const existingCategoryByName = await prisma.category.findFirst({
      where: {
        name: {
          equals: normalizedName,
          mode: 'insensitive',
        },
      },
    });

    // Check for slug conflicts
    const existingCategoryBySlug = await prisma.category.findFirst({
      where: {
        slug: normalizedSlug,
      },
    });

    // Resolve conflicts by appending a unique suffix
    let finalName = normalizedName;
    let finalSlug = normalizedSlug;

    if (existingCategoryByName) {
      const uniqueSuffix = generateUniqueSuffix();
      finalName = `${normalizedName}-${uniqueSuffix}`;
    }

    if (existingCategoryBySlug) {
      const uniqueSuffix = generateUniqueSuffix();
      finalSlug = `${normalizedSlug}-${uniqueSuffix}`;
    }

    // Create the category with resolved names/slugs
    const newCategory = await prisma.category.create({
      data: {
        name: finalName,
        slug: finalSlug,
      },
      include: {
        _count: {
          select: {
            blogs: true,
          },
        },
      },
    });

    return newCategory;
  } catch (error) {
    console.error('Error in createNewCategory:', error);
    throw error;
  }
};

export const getAllCategories = async (filters?: {
  name?: string;
  slug?: string;
  page?: string;
  limit?: string;
  offset?: string;
}) => {
  try {
    const where = {
      ...(filters?.name && {
        name: {
          contains: filters.name,
          mode: 'insensitive' as const,
        },
      }),
      ...(filters?.slug && {
        slug: {
          contains: filters.slug,
          mode: 'insensitive' as const,
        },
      }),
    };

    // Parse pagination parameters
    const page = parseInt(filters?.page || '1', 10);
    const limit = parseInt(filters?.limit || '10', 10);
    const offset = parseInt(filters?.offset || '0', 10);

    // Get total count for pagination metadata
    const totalCount = await prisma.category.count({ where });

    // Get paginated results
    const categories = await prisma.category.findMany({
      where,
      orderBy: {
        name: 'asc',
      },
      include: {
        _count: {
          select: {
            blogs: true,
          },
        },
      },
      skip: offset,
      take: limit,
    });

    // Calculate pagination metadata
    const totalPages = Math.ceil(totalCount / limit);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;

    return {
      data: categories,
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
    console.error('Error in getAllCategories:', error);
    throw error;
  }
};

export const getCategoryById = async (id: number) => {
  try {
    return prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            blogs: true,
          },
        },
      },
    });
  } catch (error) {
    console.error('Error in getCategoryById:', error);
    throw error;
  }
};

export const updateCategoryById = async (id: number, data: UpdateCategoryInput) => {
  try {
    // First check if the category exists
    const existingCategory = await prisma.category.findUnique({
      where: { id },
    });

    if (!existingCategory) {
      throw new Error(`Category with ID ${id} not found`);
    }

    // Normalize the input data
    const normalizedName = data.name?.trim();
    const normalizedSlug = data.slug?.trim();

    let finalName = normalizedName;
    let finalSlug = normalizedSlug;

    // Check for name conflicts (case-insensitive) - exclude current category
    if (normalizedName) {
      const existingCategoryByName = await prisma.category.findFirst({
        where: {
          name: {
            equals: normalizedName,
            mode: 'insensitive',
          },
          id: {
            not: id, // Exclude the current category being updated
          },
        },
      });

      if (existingCategoryByName) {
        const uniqueSuffix = generateUniqueSuffix();
        finalName = `${normalizedName}-${uniqueSuffix}`;
      }
    }

    // Check for slug conflicts - exclude current category
    if (normalizedSlug) {
      const existingCategoryBySlug = await prisma.category.findFirst({
        where: {
          slug: normalizedSlug,
          id: {
            not: id, // Exclude the current category being updated
          },
        },
      });

      if (existingCategoryBySlug) {
        const uniqueSuffix = generateUniqueSuffix();
        finalSlug = `${normalizedSlug}-${uniqueSuffix}`;
      }
    }

    // Prepare the update data with resolved conflicts
    const updateData: Partial<UpdateCategoryInput> = {};
    if (finalName !== undefined) updateData.name = finalName;
    if (finalSlug !== undefined) updateData.slug = finalSlug;

    return prisma.category.update({
      where: { id },
      data: updateData,
      include: {
        _count: {
          select: {
            blogs: true,
          },
        },
      },
    });
  } catch (error) {
    console.error('Error in updateCategoryById:', error);
    throw error;
  }
};

export const deleteCategoryById = async (id: number) => {
  try {
    // First check if the category exists
    const existingCategory = await prisma.category.findUnique({
      where: { id },
      include: {
        blogs: true,
      },
    });

    if (!existingCategory) {
      throw new Error(`Category with ID ${id} not found`);
    }

    // Check if category has any associated blogs
    if (existingCategory.blogs.length > 0) {
      throw new Error('Cannot delete category with associated blogs');
    }

    return prisma.category.delete({
      where: { id },
    });
  } catch (error) {
    console.error('Error in deleteCategoryById:', error);
    throw error;
  }
};
