import axios from 'axios';
import { ScanResult, GraphData } from '@/types';

const API_BASE_URL = 'https://api.hackura.app';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Scan API calls
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

// Graph API calls
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

// Helper function to detect input type
function detectInputType(input: string): 'url' | 'domain' | 'text' {
  if (input.startsWith('http://') || input.startsWith('https://')) {
    return 'url';
  }
  if (/^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(input)) {
    return 'domain';
  }
  return 'text';
}

export { api };
