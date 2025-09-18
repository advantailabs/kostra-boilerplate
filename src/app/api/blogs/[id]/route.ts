import {
  internalServerErrorResponse,
  notFoundResponse,
  successResponse,
  validationErrorResponse,
} from '@/lib/utils/response';
import { formatZodError } from '@/lib/utils/validation';
import { blogIdSchema, updateBlogSchema } from '@/schemas/blog.schema';
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

    // Parse the request as FormData
    const formData = await request.formData();

    // Extract blog data from form data
    const blogData: Record<string, any> = {};
    formData.forEach((value, key) => {
      blogData[key] = value;
    });

    // Validate FormData using the schema
    const updateValidationResult = updateBlogSchema.safeParse(blogData);

    if (!updateValidationResult.success) {
      return validationErrorResponse(
        'Validation failed',
        formatZodError(updateValidationResult.error)
      );
    }

    const validatedData = updateValidationResult.data;

    // Transform validated data for database
    const finalUpdateData = {
      title: validatedData.title,
      content: validatedData.content,
      tags: JSON.parse(validatedData.tags),
      categories: JSON.parse(validatedData.categories),
      blogImageUrl: validatedData.blogImageUrl?.trim() || undefined,
      published: validatedData.published === 'true',
      authorId: validatedData.authorId ? parseInt(validatedData.authorId, 10) : undefined,
    };

    // Update blog with validated data (including blogImageUrl if provided)
    const updatedBlog = await updateBlogById(id, finalUpdateData as any);

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
