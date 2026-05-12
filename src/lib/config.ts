/**
 * Environment Configuration
 * 
 * This module manages environment-specific configuration for the frontend.
 * It ensures proper API endpoint resolution and handles different deployment scenarios.
 */

interface EnvironmentConfig {
  apiUrl: string;
  supabaseUrl: string;
  supabaseAnonKey: string;
  environment: 'development' | 'production' | 'staging';
  isDevelopment: boolean;
  isProduction: boolean;
}

/**
 * Get the API URL based on environment
 */
function getApiUrl(): string {
  // Check environment variable first
  const envApiUrl = process.env.NEXT_PUBLIC_API_URL;
  
  if (envApiUrl) {
    return envApiUrl;
  }

  // Fallback based on environment
  if (typeof window !== 'undefined') {
    // Browser environment - use production default
    return 'https://api.hackura.app';
  }

  // Server environment - use production default
  return 'https://api.hackura.app';
}

/**
 * Get the full environment configuration
 */
export function getConfig(): EnvironmentConfig {
  const apiUrl = getApiUrl();
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  const env = process.env.NEXT_PUBLIC_ENVIRONMENT as 'development' | 'production' | 'staging' | undefined || 'production';

  return {
    apiUrl,
    supabaseUrl,
    supabaseAnonKey,
    environment: env,
    isDevelopment: env === 'development',
    isProduction: env === 'production',
  };
}

/**
 * Check if API is reachable
 */
export async function isApiAvailable(): Promise<boolean> {
  try {
    const config = getConfig();
    const response = await fetch(`${config.apiUrl}/health`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      signal: AbortSignal.timeout(5000),
    });
    return response.ok;
  } catch {
    return false;
  }
}

/**
 * Log configuration (development only)
 */
export function logConfig(): void {
  const config = getConfig();
  if (config.isDevelopment && typeof window !== 'undefined') {
    console.log('🔧 Frontend Configuration:', {
      environment: config.environment,
      apiUrl: config.apiUrl,
      supabaseConfigured: !!config.supabaseUrl,
    });
  }
}

export default getConfig;
