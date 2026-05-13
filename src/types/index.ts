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

// Async Scan Types
export type ScanStatus = 
  | 'pending'
  | 'processing'
  | 'recon'
  | 'threat_intelligence'
  | 'graph_building'
  | 'ai_enrichment'
  | 'completed'
  | 'failed';

export interface ScanInitResponse {
  success: boolean;
  scanId: string;
  status: 'processing';
  input: string;
  created_at: string;
}

export interface ScanStatusUpdate {
  scanId: string;
  status: ScanStatus;
  progress: number; // 0-100
  current_phase: string;
  timestamp: string;
}

export interface LiveScanData {
  scanId: string;
  input: string;
  status: ScanStatus;
  progress: number;
  
  // Progressive data fields
  recon_data?: {
    domain_info?: Record<string, any>;
    dns_records?: Record<string, any>;
    whois_data?: Record<string, any>;
    ssl_cert?: Record<string, any>;
    asn_info?: Record<string, any>;
    geoip_info?: Record<string, any>;
  };
  
  threat_intelligence?: {
    reputation_feeds?: {
      abuseipdb?: Record<string, any>;
      alienvault?: Record<string, any>;
      urlhaus?: Record<string, any>;
      phishtank?: Record<string, any>;
      [key: string]: any;
    };
    ioc_relationships?: Array<{
      type: string;
      indicator: string;
      context: string;
    }>;
    campaigns?: string[];
    threat_actors?: string[];
    malware_associations?: string[];
  };
  
  graph_data?: GraphData;
  
  scoring?: {
    risk_score?: number;
    confidence_score?: number;
    risk_level?: 'LOW' | 'MEDIUM' | 'HIGH';
    factors?: Array<{
      factor: string;
      contribution: number;
      evidence: string;
    }>;
  };
  
  ai_summary?: {
    summary: string;
    verdict: string;
    key_findings: string[];
    recommendations: string[];
    generated_at?: string;
  };
  
  errors?: Array<{
    phase: string;
    message: string;
    recoverable: boolean;
  }>;
  
  created_at: string;
  updated_at: string;
}
