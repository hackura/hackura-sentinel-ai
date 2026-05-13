'use client';

/**
 * Utility functions for handling scan errors and network resilience
 * Provides retry logic, exponential backoff, and graceful fallbacks
 */

export interface RetryConfig {
  maxRetries: number;
  initialDelayMs: number;
  maxDelayMs: number;
  backoffMultiplier: number;
}

export const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxRetries: 5,
  initialDelayMs: 500,
  maxDelayMs: 10000,
  backoffMultiplier: 1.5,
};

/**
 * Exponential backoff delay calculation
 */
export function calculateBackoffDelay(
  attempt: number,
  config: RetryConfig = DEFAULT_RETRY_CONFIG
): number {
  const delay = Math.min(
    config.initialDelayMs * Math.pow(config.backoffMultiplier, attempt),
    config.maxDelayMs
  );
  // Add jitter (±20%)
  const jitter = delay * (0.8 + Math.random() * 0.4);
  return Math.floor(jitter);
}

/**
 * Classify error types for better handling
 */
export type ErrorType = 
  | 'network'
  | 'timeout'
  | 'auth'
  | 'not_found'
  | 'server'
  | 'validation'
  | 'unknown';

export function classifyError(error: any): ErrorType {
  if (!error) return 'unknown';

  // Network errors
  if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND' || error.message?.includes('Network')) {
    return 'network';
  }

  // Timeout errors
  if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
    return 'timeout';
  }

  // HTTP status code errors
  if (error.response) {
    const status = error.response.status;
    if (status === 401 || status === 403) return 'auth';
    if (status === 404) return 'not_found';
    if (status >= 500) return 'server';
    if (status >= 400) return 'validation';
  }

  return 'unknown';
}

/**
 * Get user-friendly error message
 */
export function getErrorMessage(error: any): string {
  const errorType = classifyError(error);

  const messages: Record<ErrorType, string> = {
    network: 'Network connection failed. Please check your internet connection and try again.',
    timeout: 'Request timed out. The server is not responding. Please try again in a moment.',
    auth: 'Authentication failed. Please log in again.',
    not_found: 'The requested resource was not found.',
    server: 'Server error. The threat engine is experiencing issues. Please try again later.',
    validation: 'Invalid input. Please check your request and try again.',
    unknown: error?.message || 'An unexpected error occurred.',
  };

  return messages[errorType];
}

/**
 * Determine if an error is retryable
 */
export function isRetryableError(error: any): boolean {
  const errorType = classifyError(error);
  // Network, timeout, and server errors are retryable
  return ['network', 'timeout', 'server'].includes(errorType);
}

/**
 * Check if error is likely a temporary/transient issue
 */
export function isTemporaryError(error: any): boolean {
  const errorType = classifyError(error);
  return ['network', 'timeout'].includes(errorType);
}

/**
 * Safely parse error response
 */
export function parseErrorResponse(error: any): { message: string; code?: string; details?: any } {
  return {
    message: getErrorMessage(error),
    code: error?.code,
    details: error?.response?.data,
  };
}

/**
 * Network resilience check
 */
export async function checkNetworkResilience(): Promise<boolean> {
  try {
    // Use fetch instead of axios to avoid import issues
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const response = await fetch('/api/health', {
      method: 'HEAD',
      mode: 'no-cors',
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    return response.ok || response.type === 'opaque';
  } catch {
    return false;
  }
}

/**
 * Retry wrapper function
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  config: RetryConfig = DEFAULT_RETRY_CONFIG
): Promise<T> {
  let lastError: any;

  for (let attempt = 0; attempt <= config.maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      // Don't retry if error is not retryable
      if (!isRetryableError(error)) {
        throw error;
      }

      // Don't retry on last attempt
      if (attempt === config.maxRetries) {
        throw error;
      }

      // Wait before retrying
      const delay = calculateBackoffDelay(attempt, config);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw lastError;
}
