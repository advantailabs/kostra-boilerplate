import { getUserIdFromHeaders } from '@/lib/auth/jwt';
import {
  errorResponse,
  internalServerErrorResponse,
  successResponse,
  validationErrorResponse,
} from '@/lib/utils/response';
import { formatZodError } from '@/lib/utils/validation';
import { blogFiltersSchema, createBlogSchema } from '@/schemas/blog.schema';
import { createNewBlog, getAllBlogs } from '@/services/repositories/blogs';
import { getUserById } from '@/services/repositories/user';
import { NextRequest } from 'next/server';

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const userId = getUserIdFromHeaders(request);
    const user = await getUserById(userId);

    let formData: FormData;
    try {
      formData = await request.formData();
    } catch (error) {
      console.error('Error parsing FormData:', error);
      return errorResponse('Invalid form data format');
    }

    // Extract blog data from form data
    const blogData: Record<string, any> = {};
    formData.forEach((value, key) => {
      blogData[key] = value;
    });

    // Validate FormData using the schema
    const validationResult = createBlogSchema.safeParse(blogData);

    if (!validationResult.success) {
      return validationErrorResponse('Validation failed', formatZodError(validationResult.error));
    }

    const validatedData = validationResult.data;

    // Transform validated data for database
    const finalBlogData = {
      title: validatedData.title,
      content: validatedData.content,
      tags: JSON.parse(validatedData.tags),
      categories: JSON.parse(validatedData.categories),
      blogImageUrl: validatedData.blogImageUrl?.trim() || undefined,
      published: validatedData.published === 'true',
      authorId: user.id,
    };

    // Create new blog with validated data (including blogImageUrl if provided)
    const newBlog = await createNewBlog(finalBlogData as any & { authorId: number });

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
    const filters = Array.from(searchParams).reduce((acc: Record<string, any>, [key, value]) => {
      acc[key] = value;
      return acc;
    }, {});

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
