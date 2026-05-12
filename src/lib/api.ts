import axios, { AxiosError } from 'axios';
import { ScanResult, GraphData } from '@/types';
import { getSession } from '@/lib/supabase';

// Get API URL from environment with fallback
const getApiBaseUrl = (): string => {
  // In browser/client
  if (typeof window !== 'undefined') {
    return process.env.NEXT_PUBLIC_API_URL || 'https://api.hackura.app';
  }
  // Server-side
  return process.env.NEXT_PUBLIC_API_URL || 'https://api.hackura.app';
};

const API_BASE_URL = getApiBaseUrl();

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 second timeout
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use(async (config) => {
  try {
    const session = await getSession();
    if (session?.access_token) {
      config.headers.Authorization = `Bearer ${session.access_token}`;
    }
  } catch (error) {
    console.warn('Failed to get session:', error);
  }
  return config;
});

// Response error interceptor for better error handling
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Handle unauthorized - redirect to login if needed
      console.warn('Unauthorized request');
    }
    return Promise.reject(error);
  }
);

export async function getDashboardStats() {
  try {
    const response = await api.get('/dashboard/stats');
    return response.data.data || response.data;
  } catch (error) {
    console.error('Dashboard stats error:', error);
    return {
      total_scans: 0,
      risk_alerts: 0,
      malicious_urls: 0,
      safe_browsing: 0,
      risk_distribution: { HIGH: 0, MEDIUM: 0, LOW: 0 },
      trend: undefined,
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
    console.error('Scans error:', error);
    return [];
  }
}

export async function getScanById(id: string) {
  const response = await api.get(`/scan/${encodeURIComponent(id)}`);
  return response.data.data || response.data;
}

export interface UserSettings {
  name: string;
  email: string;
  email_notifications: boolean;
  two_factor_enabled: boolean;
  api_key_last4?: string | null;
  api_key_created_at?: string | null;
}

export async function getUserSettings(): Promise<UserSettings> {
  const response = await api.get('/settings');
  return response.data.data || response.data;
}

export async function updateUserSettings(updates: Partial<Pick<UserSettings, 'name' | 'email_notifications' | 'two_factor_enabled'>>) {
  const response = await api.patch('/settings', updates);
  return response.data.data || response.data;
}

export async function generateApiKey(): Promise<{ key: string; last4: string; created_at: string }> {
  const response = await api.post('/settings/api-keys');
  return response.data.data || response.data;
}


// Perform scan (active)
export async function performScan(input: string): Promise<ScanResult> {
  try {
    const response = await api.post('/scan', {
      input,
      type: detectInputType(input),
    });
    return response.data.data || response.data;
  } catch (error) {
    console.error('Scan error:', error);
    throw error;
  }
}

// Graph data (active)
export async function getGraphData(entity: string): Promise<GraphData> {
  try {
    const response = await api.get(`/graph/${encodeURIComponent(entity)}`);
    return response.data.data || response.data;
  } catch (error) {
    console.error('Graph error:', error);
    throw error;
  }
}


// API Health Check
export async function checkApiHealth(): Promise<boolean> {
  try {
    const response = await api.get('/health');
    return response.status === 200;
  } catch {
    return false;
  }
}

// Helper
function detectInputType(input: string): 'url' | 'domain' | 'text' {
  if (input.startsWith('http://') || input.startsWith('https://')) return 'url';
  if (/^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(input)) return 'domain';
  return 'text';
}

export { api };
