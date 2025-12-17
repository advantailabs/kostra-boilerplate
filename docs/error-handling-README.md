# Standardized Error Handling System

This document outlines the standardized error handling system implemented across the Kostra application.

## Overview

The error handling system provides:

- Consistent API response formats
- Automatic error toast notifications
- Centralized error definitions
- Easy-to-use utilities for both frontend and backend

## Backend (API Routes)

### Response Utilities

Import the response utilities in your API routes:

```typescript
import {
  successResponse,
  errorResponse,
  unauthorizedResponse,
  notFoundResponse,
  internalServerErrorResponse,
} from '@/lib/utils/response/response';
```

### Usage Examples

```typescript
// Success response
return successResponse({
  data: result,
  message: 'Operation completed successfully',
});

// Error responses
return unauthorizedResponse(); // 401
return notFoundResponse('User not found'); // 404
return errorResponse('Invalid input', 400); // Custom error
return internalServerErrorResponse(); // 500
```

### Standard Response Format

All API responses follow this format:

**Success Response:**

```json
{
  "success": true,
  "data": {
    /* response data */
  }
}
```

**Error Response:**

```json
{
  "success": false,
  "message": "Error description",
  "code": "ERROR_CODE", // optional
  "details": "Additional details" // optional
}
```

## Frontend (React Components)

### Automatic Error Handling

The axios instance automatically shows toast notifications for errors. No additional code needed for most cases.

### Custom Error Handling

For manual error handling, use the error handler utility:

```typescript
import { handleApiError, handleApiSuccess } from '@/lib/utils/error/error-handler';

try {
  const result = await apiCall();
  handleApiSuccess({ message: 'Success!' });
} catch (error) {
  handleApiError(error, 'Custom error message');
}
```

### React Query Integration

Use the `useApiMutation` hook for automatic error/success handling:

```typescript
import { useApiMutation } from '@/hooks/useApiMutation';

const createPackageMutation = useApiMutation({
  mutationFn: packagesApi.createPackage,
  successMessage: 'Package created successfully!',
  invalidateQueries: [['packages']],
});

// Usage
const handleCreate = async data => {
  try {
    await createPackageMutation.mutateAsync(data);
    // Success toast shown automatically
  } catch (error) {
    // Error toast shown automatically
  }
};
```

### Silent API Calls

For cases where you don't want automatic error toasts, the system automatically excludes certain endpoints like `/auth` and `/health`. For other cases where you need manual error handling, you can catch and handle errors manually:

```typescript
import axiosInstance from '@/lib/utils/http/axios';
import { handleApiError } from '@/lib/utils/error/error-handler';

try {
  const response = await axiosInstance.get('/api/data');
  // Handle success
} catch (error) {
  // Handle error manually (automatic toast already shown)
  // Add any custom error logic here
}
```

## Error Types and Toast Behavior

The system automatically shows different toast types based on HTTP status codes:

- **400 (Bad Request)**: Error toast with description
- **401 (Unauthorized)**: Error toast with "Sign In" action
- **403 (Forbidden)**: Error toast
- **404 (Not Found)**: Error toast
- **409 (Conflict)**: Error toast
- **422 (Validation Error)**: Error toast
- **429 (Too Many Requests)**: Error toast with retry advice
- **500+ (Server Errors)**: Error toast with "Retry" action

## Predefined Errors

Common errors are predefined in `src/lib/utils/errors.ts`:

```typescript
import { ERRORS } from '@/lib/utils/error/errors';

// Examples relevant to Kostra application
ERRORS.AUTH_REQUIRED;
ERRORS.AUTH_INSUFFICIENT_CREDITS;
ERRORS.PACKAGE_NOT_FOUND;
ERRORS.KB_NOT_FOUND;
ERRORS.FILE_UPLOAD_FAILED;
ERRORS.THREAD_NOT_FOUND;
ERRORS.SEARCH_FAILED;
ERRORS.DB_RECORD_NOT_FOUND;
ERRORS.VALIDATION_FAILED;
ERRORS.GENERIC_INTERNAL_ERROR;
```

## Best Practices

### Backend API Routes

1. **Always use response utilities** instead of raw `NextResponse.json()`
2. **Log errors** before returning error responses
3. **Use appropriate HTTP status codes**
4. **Handle Prisma errors** with the `mapPrismaError` utility

Example:

```typescript
export async function POST(request: NextRequest) {
  try {
    const { userId: clerkUserId } = await auth();

    if (!clerkUserId) {
      return unauthorizedResponse();
    }

    const user = await getUserByClerkId(clerkUserId);
    if (!user) {
      return notFoundResponse('User not found');
    }

    const result = await someService(user.id);

    if (!result.success) {
      return internalServerErrorResponse(result.error);
    }

    return successResponse({
      data: result.data,
      message: 'Operation completed successfully',
    });
  } catch (error) {
    console.error('API Error:', error);
    return internalServerErrorResponse();
  }
}
```

### Frontend Components

1. **Use `useApiMutation`** for mutations that need toast notifications
2. **Keep error handling DRY** - let the automatic system handle common cases
3. **Only use manual error handling** when you need custom behavior
4. **The system automatically handles auth redirects and error toasts** - no additional configuration needed

Example:

```typescript
export function PackageForm() {
  const createMutation = useApiMutation({
    mutationFn: packagesApi.createPackage,
    successMessage: 'Package created successfully!',
    invalidateQueries: [['packages']],
  });

  const handleSubmit = async (data) => {
    try {
      await createMutation.mutateAsync(data);
      onClose(); // Only runs on success
    } catch (error) {
      // Error toast already shown automatically
      // Handle any additional error logic here if needed
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* form content */}
      <button disabled={createMutation.isPending}>
        {createMutation.isPending ? 'Creating...' : 'Create'}
      </button>
    </form>
  );
}
```

## Migration Guide

### Migrating Existing API Routes

1. Import response utilities
2. Replace `NextResponse.json()` calls with appropriate response utilities
3. Remove manual error object construction

### Migrating Existing Frontend Code

1. Remove manual toast notifications for API errors
2. Use `useApiMutation` for mutations
3. Remove try-catch blocks that only show error toasts

## Toast Configuration

Toast notifications are configured in `src/providers/Providers.tsx` with Sonner:

```typescript
<Toaster
  position="top-right"
  richColors
  closeButton
  duration={4000}
  toastOptions={{
    style: {
      fontSize: '14px',
    },
  }}
/>
```

## Environment Considerations

- **Development**: All errors show detailed messages
- **Production**: Sensitive error details are hidden from users
- **Silent endpoints**: `/auth` and `/health` endpoints don't show automatic toasts
- **401 Unauthorized**: Automatically redirects to login page (`/`)
- **Other errors**: Show appropriate toast notifications based on error type

This system ensures consistent error handling across the application while reducing boilerplate code and improving user experience.
