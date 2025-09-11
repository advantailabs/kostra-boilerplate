import { prisma } from '@/lib/prisma';
import { CreateBlogInput, UpdateBlogInput } from '@/schemas/blog.schema';

export const createNewBlog = async (blogData: CreateBlogInput & { authorId: number }) => {
  const slug = blogData.title.trim().toLowerCase().split(' ').join('-');

  const newBlog = await prisma.blog.create({
    data: {
      title: blogData.title,
      published: blogData.published,
      slug: slug,
      content: blogData.content,
      tags: Array.isArray(blogData.tags) ? blogData.tags : [],
      authorId: blogData.authorId,
      categories: {
        create: blogData.categories.map(categoryId => ({
          category: {
            connect: {
              id: parseInt(categoryId),
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
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}) => {
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

  return prisma.blog.findMany({
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
      [filters?.sortBy || 'createdAt']: filters?.sortOrder || 'desc',
    },
  });
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

  // Generate a new slug if the title has changed
  const slug =
    data.title !== existingBlog.title
      ? data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')
      : existingBlog.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');

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
            connect: { id: parseInt(categoryId) },
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

