import { getAuthUser } from '@/lib/auth/jwt';
import {
  formatZodError,
  internalServerErrorResponse,
  notFoundResponse,
  successResponse,
  validationErrorResponse,
} from '@/lib/utils';
import { blogFiltersSchema, CreateBlogInput, createBlogSchema } from '@/schemas/blog.schema';
import { createNewBlog, getAllBlogs } from '@/services/repositories/blogs';
import { getUserById } from '@/services/repositories/user';
import { NextRequest } from 'next/server';

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { userId } = (await getAuthUser(request)) || {};

    const user = await getUserById(userId);

    if (!user) {
      return notFoundResponse('User not found');
    }

    // Parse JSON body
    const blogData = await request.json();

    // Validate data using the schema
    const validationResult = createBlogSchema.safeParse(blogData);

    if (!validationResult.success) {
      return validationErrorResponse('Validation failed', formatZodError(validationResult.error));
    }

    const validatedData = validationResult.data;

    // Prepare data for database
    const finalBlogData: CreateBlogInput & { authorId: number } = {
      ...validatedData,
      blogImageUrl: validatedData.blogImageUrl?.trim() || undefined,
      authorId: user.id,
    };

    // Create new blog with validated data
    const newBlog = await createNewBlog(finalBlogData);

    // Return success response with 201 status
    return successResponse({ data: newBlog }, 201);
  } catch (error) {
    console.error('Error creating blog:', error);
    return internalServerErrorResponse('Failed to create blog');
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Create filters object from searchParams
    const filters = Array.from(searchParams).reduce(
      (acc: Record<string, unknown>, [key, value]) => {
        acc[key] = value;
        return acc;
      },
      {}
    );

    // Validate filters using Zod
    const validationResult = blogFiltersSchema.safeParse(filters);

    if (!validationResult.success) {
      return validationErrorResponse('Validation failed', formatZodError(validationResult.error));
    }

    const validatedFilters = validationResult.data;
    let publishedStatus;
    if (validatedFilters.published === 'true') {
      publishedStatus = true;
    } else if (validatedFilters.published === 'false') {
      publishedStatus = false;
    } else {
      publishedStatus = undefined;
    }

    // Convert string values to appropriate types
    const processedFilters = {
      ...validatedFilters,
      published: publishedStatus,
      categoryId: validatedFilters.categoryId
        ? parseInt(validatedFilters.categoryId, 10)
        : undefined,
      page: validatedFilters.page ? parseInt(validatedFilters.page, 10) : undefined,
      limit: validatedFilters.limit ? parseInt(validatedFilters.limit, 10) : undefined,
    };

    // Get all blogs with pagination
    const result = await getAllBlogs(processedFilters);

    // Return success response
    return successResponse(result);
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return internalServerErrorResponse('Failed to fetch blogs');
  }
}
