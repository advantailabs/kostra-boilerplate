import {
  UpdateCategoryInput,
  categoryIdSchema,
  updateCategorySchema,
} from '@/schemas/category.schema';
import {
  deleteCategoryById,
  getCategoryById,
  updateCategoryById,
} from '@/services/repositories/categories';
import {
  internalServerErrorResponse,
  notFoundResponse,
  successResponse,
  validationErrorResponse,
} from '@/lib/utils/response';
import { NextRequest } from 'next/server';

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Validate category ID using Zod
    const validationResult = categoryIdSchema.safeParse({
      id: params.id,
    });

    if (!validationResult.success) {
      const errors = validationResult.error.issues.map((err: any) => ({
        field: err.path.join('.'),
        message: err.message,
      }));
      return validationErrorResponse('Invalid category ID', errors);
    }

    const id = validationResult.data.id;
    const category = await getCategoryById(id);

    if (!category) {
      return notFoundResponse('Category not found');
    }

    return successResponse(category);
  } catch (error) {
    console.error('Error fetching category:', error);
    return internalServerErrorResponse('Failed to fetch category');
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Validate category ID using Zod
    const validationResult = categoryIdSchema.safeParse({
      id: params.id,
    });

    if (!validationResult.success) {
      const errors = validationResult.error.issues.map((err: any) => ({
        field: err.path.join('.'),
        message: err.message,
      }));
      return validationErrorResponse('Invalid category ID', errors);
    }

    const id = validationResult.data.id;

    // Check if category exists
    const existingCategory = await getCategoryById(id);
    if (!existingCategory) {
      return notFoundResponse('Category not found');
    }

    const categoryData = await request.json();

    // Validate category data using Zod
    const updateValidationResult = updateCategorySchema.safeParse(categoryData);

    if (!updateValidationResult.success) {
      const errors = updateValidationResult.error.issues.map((err: any) => ({
        field: err.path.join('.'),
        message: err.message,
      }));
      return validationErrorResponse('Invalid input data', errors);
    }

    // Update category with validated data
    const updatedCategory = await updateCategoryById(
      id,
      updateValidationResult.data as UpdateCategoryInput
    );

    return successResponse(updatedCategory);
  } catch (error) {
    console.error('Error updating category:', error);
    return internalServerErrorResponse('Failed to update category');
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Parse and validate the category ID
    const validationResult = categoryIdSchema.safeParse({
      id: params.id,
    });

    if (!validationResult.success) {
      const errors = validationResult.error.issues.map((err: any) => ({
        field: err.path.join('.'),
        message: err.message,
      }));
      return validationErrorResponse('Invalid category ID', errors);
    }

    const id = validationResult.data.id;

    // Check if the category exists
    const existingCategory = await getCategoryById(id);
    if (!existingCategory) {
      return notFoundResponse('Category not found');
    }

    // Delete the category record
    await deleteCategoryById(id);

    // Return a success message
    return successResponse({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Error deleting category:', error);
    return internalServerErrorResponse('Failed to delete category');
  }
}
