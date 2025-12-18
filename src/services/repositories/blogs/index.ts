import { prisma } from '@/lib/prisma';
import { CreateBlogInput, UpdateBlogInput } from '@/schemas/blog.schema';

export const getBlogBySlug = async (slug: string) => {
  return prisma.blog.findUnique({
    where: { slug },
    include: {
      categories: {
        include: {
          category: true,
        },
      },
      author: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });
};
// Helper function to generate a unique slug
const generateUniqueSlug = async (title: string, currentSlug?: string): Promise<string> => {
  const baseSlug =
    currentSlug ||
    title
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .split(/\s+/)
      .join('-');

  // Generate full epoch timestamp for uniqueness
  const timestamp = Date.now();
  return `${baseSlug}-${timestamp}`;
};

export const createNewBlog = async (blogData: CreateBlogInput & { authorId: number }) => {
  // Check if the provided slug already exists
  const existingBlog = await getBlogBySlug(blogData.slug);

  // If slug exists, generate a unique one by adding timestamp
  const slug = existingBlog
    ? await generateUniqueSlug(blogData.title, blogData.slug)
    : blogData.slug;

  const newBlog = await prisma.blog.create({
    data: {
      title: blogData.title,
      published: blogData.published,
      slug,
      content: blogData.content,
      tags: Array.isArray(blogData.tags) ? blogData.tags : [],
      authorId: blogData.authorId,
      categories: {
        create: blogData.categories.map(categoryId => ({
          category: {
            connect: {
              id: parseInt(categoryId, 10),
            },
          },
        })),
      },
      blogImageUrl: blogData?.blogImageUrl,
    },
    include: {
      categories: {
        include: {
          category: true,
        },
      },
      author: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  return newBlog;
};

export const getAllBlogs = async (filters?: {
  title?: string;
  published?: boolean;
  categoryId?: number;
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
      ...(filters?.published !== undefined && {
        published: filters.published,
      }),
      ...(filters?.categoryId && {
        categories: {
          some: {
            categoryId: filters.categoryId,
          },
        },
      }),
    };

    // Parse pagination parameters
    const page = filters?.page || 1;
    const limit = filters?.limit || 10;
    const offset = (page - 1) * limit;

    // Get total count for pagination metadata
    const totalCount = await prisma.blog.count({ where });

    // Get paginated results
    const blogs = await prisma.blog.findMany({
      where,
      include: {
        categories: {
          include: {
            category: true,
          },
        },
        author: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip: offset,
      take: limit,
    });

    // Calculate pagination metadata
    const totalPages = Math.ceil(totalCount / limit);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;

    return {
      data: blogs,
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
    console.error('Error in getAllBlogs:', error);
    throw error;
  }
};

export const updateBlogById = async (id: number, data: UpdateBlogInput) => {
  const existingBlog = await prisma.blog.findUnique({
    where: { id },
    include: {
      categories: true,
    },
  });

  if (!existingBlog) {
    throw new Error(`Blog with ID ${id} not found`);
  }

  // Check if slug has changed or if the new slug already exists
  let slug = existingBlog.slug;

  if (data.slug !== existingBlog.slug) {
    const existingBlogWithNewSlug = await getBlogBySlug(data.slug);
    slug = existingBlogWithNewSlug ? await generateUniqueSlug(data.title, data.slug) : data.slug;
  }

  // Update the blog with proper category handling
  return prisma.blog.update({
    where: { id },
    data: {
      title: data.title,
      slug,
      content: data.content,
      published: data.published,
      tags: data.tags,
      blogImageUrl: data.blogImageUrl,
      categories: {
        // First delete all existing category relationships
        deleteMany: {},
        // Then create new ones
        create: data.categories.map(categoryId => ({
          category: {
            connect: { id: parseInt(categoryId, 10) },
          },
        })),
      },
    },
    // Include categories in the response
    include: {
      categories: {
        include: {
          category: true,
        },
      },
      author: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });
};

export const deleteBlogById = async (id: number) => {
  // First delete all related category associations
  await prisma.blogCategory.deleteMany({
    where: { blogId: id },
  });

  // Then delete the blog
  return prisma.blog.delete({
    where: { id },
  });
};

export const getBlogById = async (id: number) => {
  // Find the blog with the given ID
  const blog = await prisma.blog.findUnique({
    where: { id },
    include: {
      categories: {
        include: {
          category: true,
        },
      },
      author: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  // Return null if blog doesn't exist
  return blog;
};

export const updateBlogImageUrl = async (blogId: number, blogImageUrl: string) => {
  return prisma.blog.update({
    where: { id: blogId },
    data: {
      blogImageUrl,
    },
  });
};
