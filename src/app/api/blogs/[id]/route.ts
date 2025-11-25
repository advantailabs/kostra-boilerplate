import {
  formatZodError,
  internalServerErrorResponse,
  notFoundResponse,
  successResponse,
  validationErrorResponse,
} from '@/lib/utils';
import { blogIdSchema, UpdateBlogInput, updateBlogSchema } from '@/schemas/blog.schema';
import { deleteBlogById, getBlogById, updateBlogById } from '@/services/repositories/blogs';
import { NextRequest } from 'next/server';

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

export async function GET(_request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
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

export async function PATCH(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
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

    // Parse JSON body
    const blogData = await request.json();

    // Validate data using the schema
    const updateValidationResult = updateBlogSchema.safeParse(blogData);

    if (!updateValidationResult.success) {
      return validationErrorResponse(
        'Validation failed',
        formatZodError(updateValidationResult.error)
      );
    }

    const validatedData = updateValidationResult.data;

    // Prepare data for database
    const finalUpdateData: UpdateBlogInput = {
      ...validatedData,
      blogImageUrl: validatedData.blogImageUrl?.trim() || undefined,
    };

    // Update blog with validated data
    const updatedBlog = await updateBlogById(id, finalUpdateData);

    return successResponse(updatedBlog);
  } catch (error) {
    console.error('Error updating blog:', error);
    return internalServerErrorResponse('Failed to update blog');
  }
}

export async function DELETE(_request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
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
