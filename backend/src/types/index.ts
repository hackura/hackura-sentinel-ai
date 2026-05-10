// User from Supabase auth
export interface User {
  id: string;
  email: string;
  created_at: string;
  user_metadata?: {
    full_name?: string;
    avatar_url?: string;
  };
}

// Scan result
export interface ScanResult {
  id: string;
  user_id: string;
  input: string;
  type: 'url' | 'domain' | 'text';
  risk_score: number;
  risk_level: 'LOW' | 'MEDIUM' | 'HIGH';
  confidence_score: number;
  ai_explanation: string;
  risk_signals: string[];
  created_at: string;
}

// Graph entities
export interface GraphNode {
  id: string;
  label: string;
  type: 'domain' | 'ip' | 'campaign' | 'malware' | 'threat_actor';
  risk_level?: 'LOW' | 'MEDIUM' | 'HIGH';
  description?: string;
}

export interface GraphEdge {
  source: string;
  target: string;
  relationship: string;
  description?: string;
}

export interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

// Dashboard stats
export interface DashboardStats {
  total_scans: number;
  risk_alerts: number;
  malicious_urls: number;
  safe_browsing: number;
  risk_distribution?: {
    HIGH: number;
    MEDIUM: number;
    LOW: number;
  };
  trend?: {
    total_scans_change: number;
    risk_alerts_change: number;
    malicious_urls_change: number;
    safe_browsing_change: number;
  };
}

// API responses
export interface ApiSuccess<T> {
  success: true;
  data: T;
}

export interface ApiError {
  success: false;
  error: string;
  details?: unknown;
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError;
