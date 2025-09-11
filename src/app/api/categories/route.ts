import {
  internalServerErrorResponse,
  successResponse,
  validationErrorResponse,
} from '@/lib/utils/response';
import {
  categoryFiltersSchema,
  createCategorySchema,
  type CreateCategoryInput,
} from '@/schemas/category.schema';
import { createNewCategory, getAllCategories } from '@/services/repositories/categories';
import { NextRequest, NextResponse } from 'next/server';

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Extract pagination parameters
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const offset = (page - 1) * limit;

    // Create filters object from searchParams (excluding pagination params)
    const filters = Array.from(searchParams).reduce((acc: Record<string, string>, [key, value]) => {
      if (key !== 'page' && key !== 'limit') {
        acc[key] = value;
      }
      return acc;
    }, {});

    // Add pagination to filters
    filters.page = page.toString();
    filters.limit = limit.toString();
    filters.offset = offset.toString();

    // Validate filters using Zod
    const validationResult = categoryFiltersSchema.safeParse(filters);

    if (!validationResult.success) {
      const errors = validationResult.error.issues.map((err: any) => ({
        field: err.path.join('.'),
        message: err.message,
      }));
      return validationErrorResponse('Invalid query parameters', errors);
    }

    // Get categories with validated filters and pagination
    const result = await getAllCategories(validationResult.data);
    return successResponse(result);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return internalServerErrorResponse('Failed to fetch categories');
  }
}

export async function POST(request: NextRequest) {
  try {
    const categoryData = await request.json();

    // Validate category data using Zod
    const validationResult = createCategorySchema.safeParse(categoryData);

    if (!validationResult.success) {
      const errors = validationResult.error.issues.map((err: any) => ({
        field: err.path.join('.'),
        message: err.message,
      }));
      return validationErrorResponse('Invalid input data', errors);
    }

    // Create new category with validated data
    const newCategory = await createNewCategory(validationResult.data as CreateCategoryInput);

    return NextResponse.json({ success: true, data: newCategory }, { status: 201 });
  } catch (error) {
    console.error('Error creating category:', error);
    return internalServerErrorResponse('Failed to create category');
  }
}
