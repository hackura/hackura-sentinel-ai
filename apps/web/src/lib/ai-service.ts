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
 * Generate threat analysis using Ollama AI
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
    const prompt = THREAT_ANALYSIS_PROMPT
      .replace('{input}', input)
      .replace('{type}', type);

    console.log('🤖 Calling Ollama AI for threat analysis...');
    const response = await aiClient.post('/api/generate', {
      model: OLLAMA_MODEL,
      prompt: prompt,
      stream: false,
      temperature: 0.7,
    });

    // Parse the AI response
    const aiResponse = response.data.response || '';
    console.log('🤖 AI Response:', aiResponse);

    // Extract JSON from response
    const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Invalid AI response format');
    }

    const threatData = JSON.parse(jsonMatch[0]);

    return {
      risk_score: Math.min(100, Math.max(0, threatData.risk_score || 50)),
      risk_level: threatData.risk_level || 'MEDIUM',
      confidence_score: Math.min(100, Math.max(0, threatData.confidence_score || 75)),
      ai_explanation: threatData.ai_explanation || 'Analysis in progress...',
      risk_signals: Array.isArray(threatData.risk_signals) ? threatData.risk_signals : [],
      recommendations: Array.isArray(threatData.recommendations) ? threatData.recommendations : [],
    };
  } catch (error) {
    console.error('❌ AI Service Error:', error);
    throw new Error(`Failed to analyze threat: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Generate threat graph using Ollama AI
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
    const prompt = GRAPH_ANALYSIS_PROMPT.replace('{entity}', entity);

    console.log('🤖 Calling Ollama AI for threat graph generation...');
    const response = await aiClient.post('/api/generate', {
      model: OLLAMA_MODEL,
      prompt: prompt,
      stream: false,
      temperature: 0.7,
    });

    const aiResponse = response.data.response || '';
    console.log('🤖 AI Graph Response:', aiResponse);

    // Extract JSON from response
    const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Invalid AI response format');
    }

    const graphData = JSON.parse(jsonMatch[0]);

    // Transform AI response to graph format
    const nodes = (graphData.related_entities || []).map((entity: any) => ({
      id: entity.id || entity.label.toLowerCase().replace(/\s+/g, '_'),
      label: entity.label,
      type: entity.type || 'threat',
      risk_level: entity.risk_level || 'MEDIUM',
      description: entity.description || '',
    }));

    const edges = (graphData.relationships || []).map((rel: any, index: number) => ({
      source: rel.source_id,
      target: rel.target_id,
      relationship: rel.type || 'related_to',
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
