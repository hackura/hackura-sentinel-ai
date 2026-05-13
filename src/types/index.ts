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
  graph_data?: GraphData;
  intel?: IntelData;
}

// Graph Data
export type NodeType = 
  | 'domain' 
  | 'ip' 
  | 'url' 
  | 'asn' 
  | 'certificate' 
  | 'malware' 
  | 'campaign' 
  | 'technology' 
  | 'subdomain' 
  | 'organization' 
  | 'email' 
  | 'hash';

export interface GraphNode {
  id: string;
  label: string;
  type: NodeType;
  risk_level?: 'LOW' | 'MEDIUM' | 'HIGH' | 'SAFE' | 'UNKNOWN' | 'INFRA';
  metadata?: {
    reputation?: number;
    geoip?: string;
    asn?: string;
    threat_score?: number;
    tags?: string[];
    malware_associations?: string[];
    abuse_reports?: number;
    vt_detections?: number;
    linked_entities?: number;
    [key: string]: any;
  };
}

export interface GraphEdge {
  source: string;
  target: string;
  relationship: 'RESOLVES_TO' | 'HOSTED_BY' | 'USES_SSL' | 'RELATED_TO' | 'SEEN_IN' | 'COMMUNICATES_WITH' | 'REDIRECTS_TO' | string;
}

export interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export interface IntelData {
  summary: string;
  threat_score: number;
  timeline?: Array<{
    date: string;
    event: string;
    type: string;
    details: string;
  }>;
  [key: string]: any;
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
