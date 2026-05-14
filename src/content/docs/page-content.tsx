import { ReactNode } from 'react';
import { Bot, Command, Cpu, Database, Globe, Layers3, Radar, Server, Shield, TerminalSquare, Workflow } from 'lucide-react';

export type TocItem = { id: string; label: string };

export const HOME_FEATURES: Array<{ title: string; description: string; icon: ReactNode }> = [
  { title: 'Threat Intelligence', description: 'Correlate suspicious infrastructure, indicators, and campaign patterns.', icon: <Shield className="h-5 w-5" /> },
  { title: 'URL Analysis', description: 'Scan URLs for redirects, payloads, and malicious infrastructure signatures.', icon: <Radar className="h-5 w-5" /> },
  { title: 'Threat Graphs', description: 'Explore relationships between nodes, edges, and confidence layers.', icon: <Workflow className="h-5 w-5" /> },
  { title: 'AI Risk Engine', description: 'Weight signals, explain scores, and surface analyst-ready confidence.', icon: <Cpu className="h-5 w-5" /> },
  { title: 'Linux CLI', description: 'Run scans from the terminal with consistent output formatting.', icon: <TerminalSquare className="h-5 w-5" /> },
  { title: 'API Access', description: 'Integrate scanning, graph intelligence, and threat payloads programmatically.', icon: <Globe className="h-5 w-5" /> },
  { title: 'Infrastructure Analysis', description: 'Inspect DNS, ASN, GeoIP, certs, redirects, and resolved hosts.', icon: <Layers3 className="h-5 w-5" /> },
  { title: 'Real-Time Intelligence', description: 'Track scan progress and graph enrichment as it unfolds.', icon: <Command className="h-5 w-5" /> },
];

export const INTEGRATION_ITEMS: Array<{ title: string; text: string; icon: ReactNode }> = [
  { title: 'VirusTotal', text: 'External reputation and artifact context.', icon: <Shield className="h-5 w-5" /> },
  { title: 'AbuseIPDB', text: 'IP abuse reporting and network reputation.', icon: <Globe className="h-5 w-5" /> },
  { title: 'Supabase', text: 'Auth, profiles, and product workspace state.', icon: <Database className="h-5 w-5" /> },
  { title: 'OpenAI', text: 'Analysis support and AI-assisted explanation.', icon: <Bot className="h-5 w-5" /> },
  { title: 'AuraDB / Neo4j', text: 'Graph persistence and traversal engine.', icon: <Server className="h-5 w-5" /> },
];

export const DOCS_HOME_TOC: TocItem[] = [
  { id: 'hero', label: 'Hero' },
  { id: 'feature-grid', label: 'Feature grid' },
  { id: 'quick-start', label: 'Quick start' },
  { id: 'system-preview', label: 'System preview' },
];

export const GETTING_STARTED_TOC: TocItem[] = [
  { id: 'platform-overview', label: 'Platform overview' },
  { id: 'authentication', label: 'Authentication' },
  { id: 'first-scan', label: 'First scan' },
  { id: 'dashboard-overview', label: 'Dashboard overview' },
  { id: 'onboarding', label: 'Onboarding' },
  { id: 'architecture-summary', label: 'Architecture summary' },
];

export const ARCHITECTURE_TOC: TocItem[] = [
  { id: 'system-flow', label: 'System flow' },
  { id: 'supabase-auth', label: 'Supabase Auth' },
  { id: 'risk-engine', label: 'AI risk engine' },
  { id: 'graph-intelligence', label: 'Graph intelligence' },
  { id: 'scan-orchestration', label: 'Scan orchestration' },
  { id: 'frontend-visualization', label: 'Frontend visualization' },
];

export const SCANNING_TOC: TocItem[] = [
  { id: 'url-scanning', label: 'URL scanning' },
  { id: 'domain-analysis', label: 'Domain analysis' },
  { id: 'ip-analysis', label: 'IP analysis' },
  { id: 'dns-enrichment', label: 'DNS enrichment' },
  { id: 'asn-and-geoip', label: 'ASN and GeoIP' },
  { id: 'redirect-analysis', label: 'Redirect analysis' },
  { id: 'threat-indicators', label: 'Threat indicators' },
  { id: 'example-response', label: 'Example response' },
];

export const THREAT_GRAPH_TOC: TocItem[] = [
  { id: 'graph-concepts', label: 'Graph concepts' },
  { id: 'node-types', label: 'Node types' },
  { id: 'edge-types', label: 'Edge types' },
  { id: 'confidence-scoring', label: 'Confidence scoring' },
  { id: 'intelligence-layers', label: 'Intelligence layers' },
  { id: 'graph-example', label: 'Graph example' },
];

export const RISK_ENGINE_TOC: TocItem[] = [
  { id: 'scoring-model', label: 'Scoring model' },
  { id: 'confidence-calculation', label: 'Confidence calculation' },
  { id: 'weighting', label: 'Intelligence weighting' },
  { id: 'sample-table', label: 'Sample table' },
  { id: 'ai-analysis', label: 'AI-assisted analysis' },
];

export const API_HOME_TOC: TocItem[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'authentication', label: 'Authentication' },
  { id: 'endpoints', label: 'Endpoints' },
  { id: 'error-handling', label: 'Error handling' },
  { id: 'nested-reference', label: 'Nested reference' },
];

export const API_AUTH_TOC: TocItem[] = [
  { id: 'api-keys', label: 'API keys' },
  { id: 'headers', label: 'Headers' },
  { id: 'example-request', label: 'Example request' },
  { id: 'security-notes', label: 'Security notes' },
];

export const API_SCANS_TOC: TocItem[] = [
  { id: 'endpoint', label: 'Endpoint' },
  { id: 'request-body', label: 'Request body' },
  { id: 'response-body', label: 'Response body' },
  { id: 'errors', label: 'Errors' },
];

export const API_GRAPH_TOC: TocItem[] = [
  { id: 'graph-endpoint', label: 'Graph endpoint' },
  { id: 'nodes', label: 'Nodes' },
  { id: 'edges', label: 'Edges' },
  { id: 'traversal', label: 'Traversal' },
];

export const API_THREATS_TOC: TocItem[] = [
  { id: 'threat-object', label: 'Threat object' },
  { id: 'scoring-fields', label: 'Scoring fields' },
  { id: 'confidence', label: 'Confidence' },
  { id: 'notes', label: 'Notes' },
];

export const INTEGRATIONS_TOC: TocItem[] = [
  { id: 'integration-stack', label: 'Integration stack' },
  { id: 'virustotal', label: 'VirusTotal' },
  { id: 'abuseipdb', label: 'AbuseIPDB' },
  { id: 'supabase', label: 'Supabase' },
  { id: 'openai', label: 'OpenAI' },
  { id: 'neo4j', label: 'AuraDB / Neo4j' },
];

export const CLI_TOC: TocItem[] = [
  { id: 'commands', label: 'Commands' },
  { id: 'output', label: 'Output preview' },
  { id: 'workflow', label: 'Workflow' },
  { id: 'notes', label: 'Notes' },
];

export const EXAMPLES_TOC: TocItem[] = [
  { id: 'scan-example', label: 'Scan example' },
  { id: 'dashboard-example', label: 'Dashboard preview' },
  { id: 'graph-example', label: 'Graph preview' },
  { id: 'automation', label: 'Automation' },
];

export const SECURITY_TOC: TocItem[] = [
  { id: 'rate-limiting', label: 'Rate limiting' },
  { id: 'scan-protections', label: 'Scan protections' },
  { id: 'ssrf-protections', label: 'SSRF protections' },
  { id: 'authentication', label: 'Authentication' },
  { id: 'graph-handling', label: 'Graph handling' },
  { id: 'privacy', label: 'Privacy' },
];

export const FAQ_TOC: TocItem[] = [
  { id: 'questions', label: 'Questions' },
  { id: 'support', label: 'Support' },
];

export const CHANGELOG_TOC: TocItem[] = [
  { id: 'recent-updates', label: 'Recent updates' },
  { id: 'docs-notes', label: 'Docs notes' },
];

export const ROADMAP_TOC: TocItem[] = [
  { id: 'near-term', label: 'Near term' },
  { id: 'next-up', label: 'Next up' },
  { id: 'long-term', label: 'Long term' },
];
