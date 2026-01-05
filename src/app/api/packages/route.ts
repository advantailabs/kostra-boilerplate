import {
  ERRORS,
  errorResponse,
  formatZodError,
  successResponse,
  validationErrorResponse,
} from '@/lib/utils';
import { createPackageSchema, packageFiltersSchema } from '@/schemas/package.schema';
import { createNewPackage, getAllPackages } from '@/services/repositories/packages';
import { PackageFilters } from '@/types/package';
import { NextRequest } from 'next/server';

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

/**
 * GET /api/packages
 * Get all packages with optional filtering and pagination
 */
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
    const validationResult = packageFiltersSchema.safeParse(filters);

    if (!validationResult.success) {
      return validationErrorResponse('Validation failed', formatZodError(validationResult.error));
    }

    const validatedFilters = validationResult.data;

    // Convert string values to appropriate types
    let featuredStatus;
    if (validatedFilters.isFeatured === 'true') {
      featuredStatus = true;
    } else if (validatedFilters.isFeatured === 'false') {
      featuredStatus = false;
    } else {
      featuredStatus = undefined;
    }

    const processedFilters: PackageFilters = {
      ...validatedFilters,
      isFeatured: featuredStatus,
      sortBy: validatedFilters.sortBy || 'createdAt',
      sortOrder: (validatedFilters.sortOrder as 'asc' | 'desc') || 'desc',
      page: validatedFilters.page ? parseInt(validatedFilters.page, 10) : undefined,
      limit: validatedFilters.limit ? parseInt(validatedFilters.limit, 10) : undefined,
    };

    // Get all packages with pagination
    const result = await getAllPackages(processedFilters);

    // Return success response
    return successResponse(result);
  } catch (error) {
    console.error('Error fetching packages:', error);
    return errorResponse(ERRORS.GENERIC_INTERNAL_ERROR);
  }
}

/**
 * POST /api/packages
 * Create a new package
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate data using the schema
    const validationResult = createPackageSchema.safeParse(body);

    if (!validationResult.success) {
      return validationErrorResponse('Validation failed', formatZodError(validationResult.error));
    }

    const validatedData = validationResult.data;

    // Create package
    const packageData = await createNewPackage(validatedData);

    return successResponse(packageData);
  } catch (error) {
    console.error('Error creating package:', error);
    return errorResponse(ERRORS.PACKAGE_CREATION_FAILED);
  }
}
