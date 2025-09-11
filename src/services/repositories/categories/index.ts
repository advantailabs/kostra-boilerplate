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

    console.log('Creating category with name:', normalizedName, 'and slug:', normalizedSlug);

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

    console.log('Existing category by name:', existingCategoryByName);
    console.log('Existing category by slug:', existingCategoryBySlug);

    // Resolve conflicts by appending a unique suffix
    let finalName = normalizedName;
    let finalSlug = normalizedSlug;

    if (existingCategoryByName) {
      const uniqueSuffix = generateUniqueSuffix();
      finalName = `${normalizedName}-${uniqueSuffix}`;
      console.log('Name conflict resolved, new name:', finalName);
    }

    if (existingCategoryBySlug) {
      const uniqueSuffix = generateUniqueSuffix();
      finalSlug = `${normalizedSlug}-${uniqueSuffix}`;
      console.log('Slug conflict resolved, new slug:', finalSlug);
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

    console.log('Category created successfully:', newCategory);
    return newCategory;
  } catch (error) {
    console.error('Error in createNewCategory:', error);
    throw error;
  }
};

export const getAllCategories = async (filters?: {
  name?: string;
  slug?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
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
        [filters?.sortBy || 'name']: filters?.sortOrder || 'asc',
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

    console.log(
      'Updating category with ID:',
      id,
      'new name:',
      normalizedName,
      'new slug:',
      normalizedSlug
    );

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
        console.log('Name conflict resolved, new name:', finalName);
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
        console.log('Slug conflict resolved, new slug:', finalSlug);
      }
    }

    // Prepare the update data with resolved conflicts
    const updateData: Partial<UpdateCategoryInput> = {};
    if (finalName !== undefined) updateData.name = finalName;
    if (finalSlug !== undefined) updateData.slug = finalSlug;

    console.log('Final update data:', updateData);

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
