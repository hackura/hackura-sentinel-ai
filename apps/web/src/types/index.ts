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
