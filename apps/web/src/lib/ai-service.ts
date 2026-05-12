/**
 * 🤖 Ollama AI Service
 * Connects to the Ollama AI brain running on api.hackura.app
 * Handles threat analysis, scanning, and graph generation
 */

import axios from 'axios';

const AI_API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.hackura.app';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'mistral';

// Ollama client
const aiClient = axios.create({
  baseURL: AI_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 60000, // 60 second timeout for AI responses
});

/**
 * Prompt templates for threat analysis
 */
const THREAT_ANALYSIS_PROMPT = `You are a cybersecurity threat intelligence expert. Analyze the following input for security threats and provide a detailed threat assessment.

Input: {input}
Type: {type}

Provide your response ONLY as valid JSON (no markdown, no code blocks) with this exact structure:
{
  "risk_score": <number 0-100>,
  "risk_level": "<LOW|MEDIUM|HIGH>",
  "confidence_score": <number 0-100>,
  "ai_explanation": "<brief 1-2 sentence explanation of the threat level>",
  "risk_signals": ["<signal1>", "<signal2>", ...],
  "recommendations": ["<action1>", "<action2>", ...]
}`;

const GRAPH_ANALYSIS_PROMPT = `You are a cybersecurity threat intelligence expert specializing in threat relationships and attack patterns.

Entity: {entity}

Based on your knowledge of threat intelligence, provide related entities, relationships, and network information that would be relevant for a threat graph visualization.

Provide your response ONLY as valid JSON (no markdown, no code blocks) with this exact structure:
{
  "related_entities": [
    {
      "id": "<unique_id>",
      "label": "<entity_name>",
      "type": "<domain|ip|malware|campaign|threat_actor>",
      "risk_level": "<LOW|MEDIUM|HIGH>",
      "description": "<brief description>"
    }
  ],
  "relationships": [
    {
      "source_id": "<id>",
      "target_id": "<id>",
      "type": "<relationship_type>",
      "description": "<brief description>"
    }
  ],
  "threat_summary": "<overall threat assessment>"
}`;

/**
 * Generate threat analysis by calling our backend service
 */
export async function analyzeThreat(input: string, type: 'url' | 'domain' | 'text'): Promise<{
  risk_score: number;
  risk_level: string;
  confidence_score: number;
  ai_explanation: string;
  risk_signals: string[];
  recommendations: string[];
}> {
  try {
    console.log('🤖 Calling backend for threat analysis...');
    const response = await aiClient.post('/scan', {
      input: input,
      type: type,
    });

    // The backend now returns the full scan record
    const scanRecord = response.data.data;
    console.log('🤖 Backend Response:', scanRecord);

    if (!scanRecord) {
      throw new Error('Invalid backend response');
    }

    // The backend doesn't provide recommendations, so we add a placeholder.
    return { ...scanRecord, recommendations: [] };
  } catch (error) {
    console.error('❌ AI Service Error:', error);
    throw new Error(`Failed to analyze threat: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Generate threat graph by calling our backend service
 */
export async function generateThreatGraph(entity: string): Promise<{
  nodes: Array<{
    id: string;
    label: string;
    type: string;
    risk_level: string;
    description: string;
  }>;
  edges: Array<{
    source: string;
    target: string;
    relationship: string;
    weight: number;
  }>;
  statistics: {
    total_nodes: number;
    total_edges: number;
    network_density: number;
  };
}> {
  try {
    console.log('🤖 Calling backend for threat graph generation...');
    const response = await aiClient.post('/graph', {
      entity: entity,
    });

    const graphData = response.data.data;
    console.log('🤖 AI Graph Response:', graphData);

    if (!graphData) {
      throw new Error('Invalid AI response format');
    }

    // Transform AI response to graph format
    const nodes = (graphData.nodes || []).map((node: any) => ({
      id: node.id || node.label.toLowerCase().replace(/\s+/g, '_'),
      label: node.label,
      type: node.type || 'threat',
      risk_level: node.risk_level || 'MEDIUM',
      description: node.description || '',
    }));

    const edges = (graphData.edges || []).map((rel: any, index: number) => ({
      source: rel.source,
      target: rel.target,
      relationship: rel.relationship || 'related_to',
      weight: 1,
    }));

    const totalNodes = nodes.length;
    const totalEdges = edges.length;
    const networkDensity = totalNodes > 1 ? totalEdges / (totalNodes * (totalNodes - 1)) : 0;

    return {
      nodes,
      edges,
      statistics: {
        total_nodes: totalNodes,
        total_edges: totalEdges,
        network_density: Math.round(networkDensity * 100) / 100,
      },
    };
  } catch (error) {
    console.error('❌ AI Service Error:', error);
    throw new Error(`Failed to generate threat graph: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Test AI connection
 */
export async function testAIConnection(): Promise<boolean> {
  try {
    console.log('🤖 Testing Ollama AI connection...');
    const response = await aiClient.get('/api/tags');
    console.log('✅ AI Connection successful:', response.data);
    return true;
  } catch (error) {
    console.error('❌ AI Connection failed:', error);
    return false;
  }
}

/**
 * Get available models
 */
export async function getAvailableModels(): Promise<string[]> {
  try {
    const response = await aiClient.get('/api/tags');
    return response.data.models?.map((m: any) => m.name) || [OLLAMA_MODEL];
  } catch (error) {
    console.error('❌ Failed to get models:', error);
    return [OLLAMA_MODEL];
  }
}

export { aiClient };
