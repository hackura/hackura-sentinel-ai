import { ZodError } from 'zod';

/**
 * Base application error with structured metadata
 */
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly details?: Record<string, any>;

  constructor(
    message: string,
    statusCode: number = 500,
    code: string = 'INTERNAL_ERROR',
    details?: Record<string, any>,
  ) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string, id?: string) {
    super(
      id
        ? `${resource} with id "${id}" not found`
        : `${resource} not found`,
      404,
      'NOT_FOUND',
    );
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'Forbidden: insufficient permissions') {
    super(message, 403, 'FORBIDDEN');
  }
}

export class BadRequestError extends AppError {
  constructor(message: string, details?: Record<string, any>) {
    super(message, 400, 'BAD_REQUEST', details);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized') {
    super(message, 401, 'UNAUTHORIZED');
  }
}

export class RateLimitError extends AppError {
  constructor() {
    super('Too many requests. Please try again later.', 429, 'RATE_LIMITED');
  }
}

/**
 * Format Zod validation errors into a readable string
 */
export function formatZodError(error: ZodError): string {
  return error.errors
    .map((e) => `${e.path.join('.')}: ${e.message}`)
    .join('; ');
}

/**
 * Centralized error handler for Express
 */
export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: Function,
): Response {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { logger } = require('../config/logger');

  if (err instanceof AppError) {
    logger.warn({ err }, `AppError ${err.statusCode}: ${err.message}`);
    return Response.json(
      {
        success: false,
        error: err.message,
        ...(err.details && { details: err.details }),
      },
      { status: err.statusCode },
    );
  }

  if (err instanceof ZodError) {
    const message = formatZodError(err);
    logger.warn({ err }, `Validation error: ${message}`);
    return Response.json(
      { success: false, error: 'Validation failed', details: { issues: err.errors } },
      { status: 400 },
    );
  }

  logger.error({ err }, `Unhandled error: ${err.message}`);
  return Response.json(
    {
      success: false,
      error: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message,
    },
    { status: 500 },
  );
}