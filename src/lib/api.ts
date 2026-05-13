import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { ScanResult, GraphData } from '@/types';
import { getSession, supabase } from '@/lib/supabase';

/**
 * Hackura Sentinel AI - High-Resilience API Client
 * Senior Full-Stack Implementation with Network Diagnostics
 */

const getApiBaseUrl = (): string => {
  // STRICT REQUIREMENT: Use direct production URL
  return 'https://api.hackura.app';
};

const API_BASE_URL = getApiBaseUrl();

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 300000, // 300 second (5 min) timeout for deep AI/external API scans
  withCredentials: false, // Ensure cross-origin requests don't fail on credential checks
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// --- Network Diagnostics & Interceptors ---

api.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  // Add auth token
  try {
    const session = await getSession();
    if (session?.access_token) {
      config.headers.Authorization = `Bearer ${session.access_token}`;
    }
  } catch (error) {
    console.warn('[API Auth] Session retrieval failed:', error);
  }

  // Diagnostics Logging
  console.log('--- API Request Diagnostics ---');
  console.log('Base URL:', api.defaults.baseURL);
  console.log('Request Path:', config.url);
  console.log('Full Request URL:', (config.baseURL || '') + (config.url || ''));
  console.log('Method:', config.method?.toUpperCase());
  console.log('Payload:', config.data);
  
  return config;
}, (error) => {
  console.error('[API Request Error] Diagnostics:', error);
  return Promise.reject(error);
});

api.interceptors.response.use(
  (response) => {
    console.log(`[API Response Success] ${response.status} ${response.config.url}`);
    return response;
  },
  (error: AxiosError) => {
    console.log('--- API Error Diagnostics ---');
    console.log('Axios Error Object:', error);
    console.log('Axios Code:', error.code);
    console.log('Axios Message:', error.message);
    
    if (error.response) {
      // The server responded with a status code that falls out of the range of 2xx
      console.error('[API Error: Server Response]', {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers,
      });
    } else if (error.request) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser
      console.error('[API Error: No Response Received]', {
        request: error.request,
        reason: 'Possible CORS, Network Interruption, or Proxy Timeout',
      });
      
      if (error.code === 'ECONNABORTED') {
        console.error('[API Error: Timeout] Request exceeded 300s limit');
      }
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('[API Error: Setup/Config Issue]', error.message);
    }

    return Promise.reject(error);
  }
);

// --- API Health Check ---

export async function checkApiHealth(): Promise<boolean> {
  try {
    console.log('[Health Check] Verifying API availability...');
    const response = await api.get('/health', { timeout: 5000 });
    const isUp = response.status === 200;
    console.log(`[Health Check] Result: ${isUp ? 'ONLINE' : 'OFFLINE'}`);
    return isUp;
  } catch (err) {
    console.warn('[Health Check] API health check failed:', err);
    return false;
  }
}

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

export async function clearScans() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Authentication required to clear history');
  
  const { error } = await supabase
    .from('scans')
    .delete()
    .eq('user_id', user.id);
    
  if (error) throw error;
  return { success: true };
}

export async function deleteScan(id: string) {
  const { error } = await supabase
    .from('scans')
    .delete()
    .eq('id', id);
    
  if (error) throw error;
  return { success: true };
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
  // 1. Pre-scan health check to verify direct connection
  const apiHealthy = await checkApiHealth();
  if (!apiHealthy) {
    throw new Error('Threat Intelligence Engine is currently unreachable. Please check your network connection or try again later.');
  }

  try {
    const payload = {
      input,
      type: detectInputType(input),
    };

    console.log(`[Scan Engine] Initiating analysis for: ${input}`);
    const response = await api.post('/scan', payload);
    
    const result = response.data.data || response.data;
    
    // Clean up AI explanation: remove debug/status tags like [Offline Mode]
    if (result && typeof result.ai_explanation === 'string') {
      result.ai_explanation = result.ai_explanation.replace(/\[Offline Mode\]/gi, '').trim();
    }

    return result;
  } catch (error: any) {
    // Detailed error classification
    if (error.code === 'ECONNABORTED') {
      throw new Error('Analysis timed out after 300s. This usually happens with extremely complex threat networks or slow upstream providers.');
    }
    
    if (!error.response && error.request) {
      throw new Error('Network interruption detected. The request was sent but the connection was closed before the engine could respond.');
    }

    if (error.response?.status === 500) {
      throw new Error('The threat engine encountered an internal error while analyzing this resource.');
    }

    throw error;
  }
}

// --- Graph API ---

export async function getGraphData(entity: string): Promise<GraphData> {
  const response = await api.get(`/graph/${encodeURIComponent(entity)}`);
  return response.data.data || response.data;
}

// --- Helpers ---

function detectInputType(input: string): 'url' | 'domain' | 'text' {
  if (input.startsWith('http://') || input.startsWith('https://')) return 'url';
  if (/^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/.test(input)) return 'domain';
  return 'text';
}

export { api };
