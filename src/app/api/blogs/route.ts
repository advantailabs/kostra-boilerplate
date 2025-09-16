import { getUserIdFromHeaders } from '@/lib/auth/jwt';
import {
  errorResponse,
  internalServerErrorResponse,
  successResponse,
  validationErrorResponse,
} from '@/lib/utils/response';
import { formatZodError } from '@/lib/utils/validation';
import { blogFiltersSchema, CreateBlogInput, createBlogSchema } from '@/schemas/blog.schema';
import { createNewBlog, getAllBlogs, updateBlogImageUrl } from '@/services/repositories/blogs';
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

    const blogImageFile = formData.get('imageFile') as File | null;

    // Extract blog data from form data
    const blogData: Record<string, any> = {};
    formData.forEach((value, key) => {
      if (key !== 'imageFile') {
        blogData[key] = value;
      }
    });

    // Prepare data for validation
    // Convert empty strings to undefined for optional fields
    const cleanedData = {
      ...blogData,
      // Handle optional URL fields - convert empty strings to undefined
      blogImageUrl: blogData.blogImageUrl?.trim() || undefined,
      // Handle array fields if they exist as strings
      tags: blogData.tags ? JSON.parse(blogData.tags as string) : [],
      categories: blogData.categories ? JSON.parse(blogData.categories as string) : [],
      // Handle boolean fields
      published: blogData.published === 'true',
      // Add the authenticated user's ID
    };

    // Validate blog data using Zod
    const validationResult = createBlogSchema.safeParse(cleanedData);

    if (!validationResult.success) {
      return validationErrorResponse('Validation failed', formatZodError(validationResult.error));
    }

    const finalBlogData = {
      ...validationResult.data,
      authorId: user.id,
    };

    // Create new blog with validated data
    const newBlog = await createNewBlog(finalBlogData as CreateBlogInput & { authorId: number });

    // Handle image upload with Cloudflare R2
    if (blogImageFile && newBlog.id) {
      try {
        // For now, we'll use the blogImageUrl from the form data if it was uploaded via the frontend
        // The frontend should handle the upload and provide the URL
        if (finalBlogData.blogImageUrl) {
          // Update the blog with the image URL using the dedicated repository method
          await updateBlogImageUrl(newBlog.id, finalBlogData.blogImageUrl);
          newBlog.blogImageUrl = finalBlogData.blogImageUrl;
        }
      } catch (uploadError) {
        console.error('Error updating blog image URL:', uploadError);
        // Continue with blog creation even if image URL update fails
      }
    }

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
