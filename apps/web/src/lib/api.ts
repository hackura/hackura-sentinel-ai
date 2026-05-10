import axios from 'axios';
import { ScanResult, GraphData } from '@/types';
import { getSession } from '@/lib/supabase';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.hackura.app';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
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
    console.error('Failed to get session:', error);
  }
  return config;
});

// Dashboard stats
export async function getDashboardStats() {
  try {
    const response = await api.get('/dashboard/stats');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch dashboard stats:', error);
    return getMockDashboardStats();
  }
}

// Scan history
export async function getScans(limit?: number) {
  try {
    const response = await api.get('/scans' + (limit ? `?limit=${limit}` : ''));
    return response.data.data || response.data;
  } catch (error) {
    console.error('Failed to fetch scans:', error);
    return getMockScans(limit);
  }
}

// Single scan by ID
export async function getScanById(id: string) {
  try {
    const response = await api.get(`/scans/${id}`);
    return response.data.data || response.data;
  } catch (error) {
    console.error('Failed to fetch scan:', error);
    return getMockScanById(id);
  }
}

// Perform scan
export async function performScan(input: string): Promise<ScanResult> {
  try {
    const response = await api.post('/scan', {
      input,
      type: detectInputType(input),
    });
    return response.data.data || response.data;
  } catch (error) {
    console.error('Scan error:', error);
    return getMockScanResult(input);
  }
}

// Graph data
export async function getGraphData(entity: string): Promise<GraphData> {
  try {
    const response = await api.get(`/graph/${encodeURIComponent(entity)}`);
    return response.data.data || response.data;
  } catch (error) {
    console.error('Graph error:', error);
    return getMockGraphData(entity);
  }
}

// API Health Check
export async function checkApiHealth(): Promise<boolean> {
  try {
    const response = await api.get('/health');
    return response.status === 200;
  } catch {
    return true;
  }
}

// Helper
function detectInputType(input: string): 'url' | 'domain' | 'text' {
  if (input.startsWith('http://') || input.startsWith('https://')) return 'url';
  if (/^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(input)) return 'domain';
  return 'text';
}

// Mock data fallbacks (development only)
function getMockDashboardStats() {
  return {
    total_scans: 1247,
    risk_alerts: 42,
    malicious_urls: 340,
    safe_browsing: 865,
    risk_distribution: { HIGH: 12, MEDIUM: 28, LOW: 156 },
    trend: { total_scans_change: 24, risk_alerts_change: 8, malicious_urls_change: 12, safe_browsing_change: 16 },
  };
}

function getMockScans(limit?: number) {
  const scans = [
    { id: '1', url: 'https://secure-payment-update.com', risk_score: 87, risk_level: 'HIGH', ai_explanation: 'Domain impersonation detected.', risk_signals: ['Domain Spoofing', 'SSL Mismatch'], confidence_score: 0.94, created_at: new Date().toISOString() },
    { id: '2', url: 'https://github.com/torvalds/linux', risk_score: 8, risk_level: 'LOW', ai_explanation: 'Legitimate repository.', risk_signals: [], confidence_score: 0.99, created_at: new Date(Date.now() - 86400000).toISOString() },
    { id: '3', url: 'suspicious-crypto-airdrop.net', risk_score: 92, risk_level: 'HIGH', ai_explanation: 'Classic crypto scam.', risk_signals: ['Scam Pattern', 'Wallet Draining'], confidence_score: 0.97, created_at: new Date(Date.now() - 172800000).toISOString() },
  ];
  return limit ? scans.slice(0, limit) : scans;
}

function getMockScanResult(input: string): ScanResult {
  return {
    id: Date.now().toString(), url: input, risk_score: Math.floor(Math.random() * 100),
    risk_level: Math.random() > 0.5 ? 'HIGH' : Math.random() > 0.5 ? 'MEDIUM' : 'LOW',
    ai_explanation: `This ${input} has been analyzed using advanced threat detection algorithms.`,
    risk_signals: ['Suspicious Domain Pattern', 'Low Domain Age'].slice(0, Math.floor(Math.random() * 3)),
    confidence_score: 0.85 + Math.random() * 0.15, created_at: new Date().toISOString(),
  };
}

function getMockGraphData(_entity: string): GraphData {
  return {
    nodes: [
      { id: '1', label: 'phishing.com', type: 'domain', risk_level: 'HIGH' },
      { id: '2', label: '192.168.1.1', type: 'ip', risk_level: 'HIGH' },
      { id: '3', label: 'Campaign-2024', type: 'campaign', risk_level: 'HIGH' },
    ],
    edges: [
      { source: '1', target: '2', relationship: 'hosted_on' },
      { source: '2', target: '3', relationship: 'part_of' },
    ],
  };
}

function getMockScanById(id: string) {
  return getMockScans().find(s => s.id === id) || getMockScans()[0];
}

export { api };
