// Authentication
export interface User {
  id: string;
  email: string;
  created_at: string;
}

// Scan Data
export interface ScanResult {
  id: string;
  url: string;
  risk_score: number;
  risk_level: 'LOW' | 'MEDIUM' | 'HIGH';
  ai_explanation: string;
  risk_signals: string[];
  confidence_score: number;
  created_at: string;
  metadata?: Record<string, any>;
}

// Graph Data
export interface GraphNode {
  id: string;
  label: string;
  type: 'domain' | 'ip' | 'campaign' | 'malware';
  risk_level?: 'LOW' | 'MEDIUM' | 'HIGH';
}

export interface GraphEdge {
  source: string;
  target: string;
  relationship: string;
}

export interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

// API Response Types
export interface ApiScanResponse {
  success: boolean;
  data: ScanResult;
  error?: string;
}

export interface ApiGraphResponse {
  success: boolean;
  data: GraphData;
  error?: string;
}

export interface DashboardStats {
  total_scans: number;
  risk_alerts: number;
  malicious_urls: number;
  safe_browsing: number;
  detection_accuracy?: number;
  avg_response_time?: number;
  active_threats?: number;
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

export interface ScanHistoryResponse {
  scans: ScanResult[];
  total: number;
  page?: number;
  limit?: number;
}
