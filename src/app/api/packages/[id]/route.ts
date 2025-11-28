import {
  ERRORS,
  errorResponse,
  formatZodError,
  notFoundResponse,
  successResponse,
  validationErrorResponse,
} from '@/lib/utils';
import { packageIdSchema, updatePackageSchema } from '@/schemas/package.schema';
import {
  deletePackageById,
  getPackageById,
  updatePackageById,
} from '@/services/repositories/packages';
import { NextRequest } from 'next/server';

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

/**
 * GET /api/packages/[id]
 * Get a specific package by ID
 */
export async function GET(_request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    // Validate ID parameter using schema
    const validationResult = packageIdSchema.safeParse({ id: params.id });

    if (!validationResult.success) {
      return validationErrorResponse('Validation failed', formatZodError(validationResult.error));
    }

    const packageId = validationResult.data.id;

    const packageData = await getPackageById(packageId);

    if (!packageData) {
      return notFoundResponse('Package not found');
    }

    return successResponse(packageData);
  } catch (error) {
    console.error('Error fetching package:', error);
    return errorResponse(ERRORS.GENERIC_INTERNAL_ERROR);
  }
}

/**
 * PATCH /api/packages/[id]
 * Update a specific package by ID (partial update)
 */
export async function PATCH(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    // Validate ID parameter using schema
    const idValidationResult = packageIdSchema.safeParse({ id: params.id });

    if (!idValidationResult.success) {
      return validationErrorResponse('Validation failed', formatZodError(idValidationResult.error));
    }

    const packageId = idValidationResult.data.id;

    const body = await request.json();

    // Validate update data using schema
    const validationResult = updatePackageSchema.safeParse(body);

    if (!validationResult.success) {
      return validationErrorResponse('Validation failed', formatZodError(validationResult.error));
    }

    const validatedData = validationResult.data;

    // Update package
    const updatedPackage = await updatePackageById(packageId, validatedData);

    return successResponse(updatedPackage);
  } catch (error) {
    console.error('Error updating package:', error);
    return errorResponse(ERRORS.PACKAGE_UPDATE_FAILED);
  }
}

/**
 * DELETE /api/packages/[id]
 * Delete a specific package by ID
 */
export async function DELETE(_request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    // Validate ID parameter using schema
    const validationResult = packageIdSchema.safeParse({ id: params.id });

    if (!validationResult.success) {
      return validationErrorResponse('Validation failed', formatZodError(validationResult.error));
    }

    const packageId = validationResult.data.id;

    // Delete package
    await deletePackageById(packageId);

    return successResponse(null);
  } catch (error) {
    console.error('Error deleting package:', error);
    return errorResponse(ERRORS.PACKAGE_DELETE_FAILED);
  }
}
