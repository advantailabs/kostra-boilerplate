import { toast } from '@/components/atom/Toast';
import { AxiosError } from 'axios';
import { ERRORS } from './errors';

interface ApiErrorResponse {
  success: false;
  message: string;
  code?: string;
  details?: string;
  developerNotes?: string[];
  originalError?: string;
}

interface ApiSuccessResponse {
  success: true;
  data: unknown;
  message?: string;
}

/**
 * Handles API errors consistently across the application
 * Shows appropriate toast notifications based on error type
 */
export function handleApiError(error: unknown, customMessage?: string): void {
  console.error('API Error:', error);

  // Handle Axios errors
  if (error instanceof AxiosError) {
    const { response } = error;

    if (response?.data) {
      const errorData = response.data as ApiErrorResponse;

      // Use custom message if provided, otherwise use API message
      const message = customMessage || errorData.message || 'An unexpected error occurred';

      // Normalize message for specialized handling
      const messageLower = (errorData.message || '').toLowerCase();

      // Show different toast types based on status code
      switch (response.status) {
        case 402:
          if (messageLower.includes('free plan limit')) {
            toast.error('Free Plan Limit Reached', {
              description: customMessage || errorData.message,
            });
          } else {
            toast.error('Insufficient Credits', {
              description: customMessage || errorData.message,
            });
          }
          break;
        case 400:
          toast.error(message, {
            description: errorData.details,
          });
          break;
        case 401:
          toast.error('Authentication Required', {
            description: message,
          });
          break;
        case 403:
          if (messageLower.includes('free plan limit')) {
            toast.error('Free Plan Limit Reached', {
              description: message,
            });
          } else {
            toast.error('Access Denied', {
              description: message,
            });
          }
          break;
        case 404:
          toast.error('Not Found', {
            description: message,
          });
          break;
        case 409:
          toast.error('Conflict', {
            description: message,
          });
          break;
        case 422:
          toast.error('Validation Error', {
            description: message,
          });
          break;
        case 429:
          toast.error('Too Many Requests', {
            description: 'Please wait a moment before trying again.',
          });
          break;
        case 500:
        case 502:
        case 503:
        case 504:
          toast.error('Server Error', {
            description: message,
          });
          break;
        default:
          toast.error(message);
      }
    } else if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
      toast.error('Request Timeout', {
        description: 'The request took too long to complete. Please try again.',
      });
    } else if (error.code === 'ERR_NETWORK') {
      toast.error('Network Error', {
        description: 'Please check your internet connection and try again.',
      });
    } else {
      toast.error(customMessage || 'Network error occurred');
    }
  }
  // Handle fetch errors or other types
  else if (error instanceof Error) {
    const messageLower = error.message.toLowerCase();

    // Standardize client-side insufficient credits errors to a consistent toast
    if (messageLower.includes('insufficient credit')) {
      toast.error('Insufficient Credits', {
        description: ERRORS.AUTH_INSUFFICIENT_CREDITS.message,
      });
      return;
    }

    if (messageLower.includes('failed to fetch')) {
      toast.error('Network Error', {
        description: 'Please check your internet connection and try again.',
      });
    } else {
      toast.error(customMessage || error.message || 'An unexpected error occurred');
    }
  }
  // Handle unknown errors
  else {
    toast.error(customMessage || 'An unexpected error occurred');
  }
}

/**
 * Extracts a user-friendly error message from an unknown error, with Axios support
 */
export function getApiErrorMessage(
  error: unknown,
  fallbackMessage = 'An unexpected error occurred'
) {
  if (error instanceof AxiosError) {
    // nullish coalesce operator, if the left of ?? is undefined, the right value is returned
    return error.response?.data?.message ?? fallbackMessage;
  }
  if (error instanceof Error) {
    return error.message || fallbackMessage;
  }
  return fallbackMessage;
}

/**
 * Handles API success responses
 * Shows success toast if message is provided
 */
export function handleApiSuccess(
  response: ApiSuccessResponse | { message?: string },
  customMessage?: string
): void {
  const message = customMessage || response.message;

  if (message) {
    toast.success(message);
  }
}

/**
 * Utility function to check if a response is successful
 */
export function isApiSuccessResponse(response: {
  success: boolean;
}): response is ApiSuccessResponse {
  return response && response.success === true;
}

/**
 * Utility function to check if a response is an error
 */
export function isApiErrorResponse(response: { success: boolean }): response is ApiErrorResponse {
  return response && response.success === false;
}

/**
 * Wrapper for API calls that automatically handles errors and success
 */
export async function handleApiCall<T>(
  apiCall: () => Promise<T>,
  options?: {
    successMessage?: string;
    errorMessage?: string;
    showSuccessToast?: boolean;
  }
): Promise<T | null> {
  try {
    const result = await apiCall();

    if (options?.showSuccessToast !== false && options?.successMessage) {
      toast.success(options.successMessage);
    }

    return result;
  } catch (error) {
    handleApiError(error, options?.errorMessage);
    return null;
  }
}
