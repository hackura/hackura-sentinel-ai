import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { ScanResult, GraphData } from '@/types';
import { getSession } from '@/lib/supabase';

/**
 * Hackura Sentinel AI - API Client
 * Senior Full-Stack Implementation
 */

const getApiBaseUrl = (): string => {
  if (typeof window !== 'undefined') {
    return process.env.NEXT_PUBLIC_API_URL || 'https://api.hackura.app';
  }
  return process.env.NEXT_PUBLIC_API_URL || 'https://api.hackura.app';
};

const API_BASE_URL = getApiBaseUrl();

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000, // 60 second timeout for long-running AI scans
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// --- Debugging Interceptors ---

api.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  // Add auth token
  try {
    const session = await getSession();
    if (session?.access_token) {
      config.headers.Authorization = `Bearer ${session.access_token}`;
    }
  } catch (error) {
    console.warn('[API Auth] Failed to get session:', error);
  }

  // Debug Logging
  console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`, {
    params: config.params,
    data: config.data,
  });
  
  return config;
}, (error) => {
  console.error('[API Request Error]', error);
  return Promise.reject(error);
});

api.interceptors.response.use(
  (response) => {
    console.log(`[API Response] ${response.status} ${response.config.url}`, response.data);
    return response;
  },
  (error: AxiosError) => {
    const status = error.response?.status;
    const url = error.config?.url;
    const message = error.message;

    // Detailed Error Logging
    console.error(`[API Error] ${status || 'Network'} ${url}`, {
      message,
      data: error.response?.data,
      code: error.code,
    });

    if (status === 401) {
      console.warn('[API Auth] Session expired or unauthorized');
    }

    if (error.code === 'ECONNABORTED' && message.includes('timeout')) {
      console.error('[API Timeout] Request exceeded 60s limit');
    }

    return Promise.reject(error);
  }
);

// --- Dashboard API ---

export async function getDashboardStats() {
  try {
    const response = await api.get('/dashboard/stats');
    return response.data.data || response.data;
  } catch (error) {
    return {
      total_scans: 0,
      risk_alerts: 0,
      malicious_urls: 0,
      safe_browsing: 0,
      risk_distribution: { HIGH: 0, MEDIUM: 0, LOW: 0 },
    };
  }
}

export async function getScans(limit?: number) {
  try {
    const response = await api.get('/scans', {
      params: limit ? { limit } : undefined,
    });
    return response.data.data || response.data.scans || [];
  } catch (error) {
    return [];
  }
}

// --- Settings API ---

export interface UserSettings {
  name: string;
  email: string;
  avatar_url?: string | null;
  email_notifications: boolean;
  two_factor_enabled: boolean;
  api_key_last4?: string | null;
  api_key_created_at?: string | null;
}

export async function getUserSettings(): Promise<UserSettings> {
  const response = await api.get('/settings');
  return response.data.data || response.data;
}

export async function updateUserSettings(updates: Partial<UserSettings>) {
  const response = await api.patch('/settings', updates);
  return response.data.data || response.data;
}

export async function deleteAccount() {
  const response = await api.delete('/settings');
  return response.data;
}

// --- Core Scan Logic ---

export async function performScan(input: string): Promise<ScanResult> {
  try {
    const payload = {
      input,
      type: detectInputType(input),
    };

    const response = await api.post('/scan', payload);
    
    // Ensure we handle both wrapper and direct data patterns
    const result = response.data.data || response.data;
    
    if (!result || typeof result !== 'object') {
      throw new Error('Invalid response format from scan engine');
    }

    return result;
  } catch (error: any) {
    // Graceful error classification for the UI
    if (error.code === 'ECONNABORTED') {
      throw new Error('Analysis is taking longer than expected. Please try again in a few moments.');
    }
    
    if (error.response?.status === 500) {
      throw new Error('The scan engine encountered an internal error. Our team has been notified.');
    }

    throw error;
  }
}

// --- Graph API ---

export async function getGraphData(entity: string): Promise<GraphData> {
  const response = await api.get(`/graph/${encodeURIComponent(entity)}`);
  return response.data.data || response.data;
}

// --- Health ---

export async function checkApiHealth(): Promise<boolean> {
  try {
    const response = await api.get('/health');
    return response.status === 200;
  } catch {
    return false;
  }
}

// --- Helpers ---

function detectInputType(input: string): 'url' | 'domain' | 'text' {
  if (input.startsWith('http://') || input.startsWith('https://')) return 'url';
  // Basic domain regex
  if (/^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/.test(input)) return 'domain';
  return 'text';
}

export { api };
