import {
  internalServerErrorResponse,
  notFoundResponse,
  successResponse,
  validationErrorResponse,
} from '@/lib/utils/response';
import { formatZodError } from '@/lib/utils/validation';
import { UpdateBlogInput, blogIdSchema, updateBlogSchema } from '@/schemas/blog.schema';
import { deleteBlogById, getBlogById, updateBlogById } from '@/services/repositories/blogs';
import { NextRequest } from 'next/server';

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Validate blog ID using Zod
    const validationResult = blogIdSchema.safeParse({
      id: params.id,
    });

    if (!validationResult.success) {
      return validationErrorResponse('Validation failed', formatZodError(validationResult.error));
    }

    const { id } = validationResult.data;
    const blog = await getBlogById(id);

    if (!blog) {
      return notFoundResponse('Blog not found');
    }

    return successResponse(blog);
  } catch (error) {
    console.error('Error fetching blog:', error);
    return internalServerErrorResponse('Failed to fetch blog');
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Validate blog ID using Zod
    const validationResult = blogIdSchema.safeParse({
      id: params.id,
    });

    if (!validationResult.success) {
      return validationErrorResponse('Validation failed', formatZodError(validationResult.error));
    }

    const { id } = validationResult.data;

    // Check if blog exists
    const existingBlog = await getBlogById(id);
    if (!existingBlog) {
      return notFoundResponse('Blog not found');
    }

    // We'll try to parse the request as FormData regardless of the Content-Type
    // and handle any errors in the catch block
    const formData = await request.formData();
    const blogImageFile = formData.get('blogImageFile') as File | null;

    // Extract blog data from form data
    const blogData: Record<string, any> = {};
    formData.forEach((value, key) => {
      if (key !== 'blogImageFile') {
        blogData[key] = value;
      }
    });

    let publishedStatus;

    if (blogData.published === 'true') {
      publishedStatus = true;
    } else if (blogData.published === 'false') {
      publishedStatus = false;
    } else {
      publishedStatus = undefined;
    }
    // Prepare data for validation
    const cleanedData = {
      ...blogData,
      // Handle optional URL fields - convert empty strings to undefined
      blogImageUrl: blogData.blogImageUrl?.trim() || undefined,
      // Handle array fields if they exist as strings
      tags: blogData.tags ? JSON.parse(blogData.tags as string) : undefined,
      categories: blogData.categories ? JSON.parse(blogData.categories as string) : undefined,
      // Handle boolean fields
      published: publishedStatus,
      // Handle authorId - ensure it's a number
      authorId: blogData.authorId ? parseInt(blogData.authorId, 10) : undefined,
    };

    // Validate blog data using Zod
    const updateValidationResult = updateBlogSchema.safeParse(cleanedData);

    if (!updateValidationResult.success) {
      return validationErrorResponse(
        'Validation failed',
        formatZodError(updateValidationResult.error)
      );
    }

    // Handle image upload with Cloudflare R2
    if (blogImageFile) {
      try {
        // For now, we'll use the blogImageUrl from the form data if it was uploaded via the frontend
        // The frontend should handle the upload and provide the URL
        if (updateValidationResult.data?.blogImageUrl) {
          // The image URL is already in the validated data, so it will be updated with the blog
          console.log('Blog image URL updated:', updateValidationResult.data.blogImageUrl);
        }
      } catch (uploadError) {
        console.error('Error handling blog image:', uploadError);
        // Continue with blog update even if image handling fails
      }
    }

    // Update blog with validated data
    const updatedBlog = await updateBlogById(id, updateValidationResult.data as UpdateBlogInput);

    return successResponse(updatedBlog);
  } catch (error) {
    console.error('Error updating blog:', error);
    return internalServerErrorResponse('Failed to update blog');
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Parse and validate the blog ID
    const validationResult = blogIdSchema.safeParse({
      id: params.id,
    });

    if (!validationResult.success) {
      return validationErrorResponse('Validation failed', formatZodError(validationResult.error));
    }

    const { id } = validationResult.data;

    // Check if the blog exists
    const existingBlog = await getBlogById(id);
    if (!existingBlog) {
      return notFoundResponse('Blog not found');
    }

    // Delete the blog record
    await deleteBlogById(id);

    // Return a success message
    return successResponse({ message: 'Blog deleted successfully' });
  } catch (error) {
    console.error('Error deleting blog:', error);
    return internalServerErrorResponse('Failed to delete blog');
  }
}
