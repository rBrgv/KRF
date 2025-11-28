/**
 * Standardized API response utilities
 */

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  code?: string;
  details?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiError {
  error: string;
  code?: string;
  details?: string;
}

/**
 * Create a successful API response
 */
export function successResponse<T>(
  data: T,
  pagination?: ApiResponse<T>['pagination']
): ApiResponse<T> {
  return {
    success: true,
    data,
    ...(pagination && { pagination }),
  };
}

/**
 * Create an error API response
 */
export function errorResponse(
  error: string,
  code?: string,
  details?: string,
  status: number = 400
): Response {
  return Response.json(
    {
      success: false,
      error,
      ...(code && { code }),
      ...(details && process.env.NODE_ENV === 'development' && { details }),
    } as ApiResponse,
    { status }
  );
}

/**
 * Create a validation error response
 */
export function validationErrorResponse(
  errors: any[],
  details?: string
): Response {
  return errorResponse(
    'Validation error',
    'VALIDATION_ERROR',
    details || JSON.stringify(errors),
    400
  );
}

/**
 * Create an unauthorized response
 */
export function unauthorizedResponse(message: string = 'Unauthorized'): Response {
  return errorResponse(message, 'UNAUTHORIZED', undefined, 401);
}

/**
 * Create a forbidden response
 */
export function forbiddenResponse(message: string = 'Forbidden'): Response {
  return errorResponse(message, 'FORBIDDEN', undefined, 403);
}

/**
 * Create a not found response
 */
export function notFoundResponse(resource: string = 'Resource'): Response {
  return errorResponse(
    `${resource} not found`,
    'NOT_FOUND',
    undefined,
    404
  );
}

/**
 * Create an internal server error response
 */
export function serverErrorResponse(
  error: string = 'Internal server error',
  details?: string
): Response {
  return errorResponse(
    error,
    'INTERNAL_SERVER_ERROR',
    details,
    500
  );
}



