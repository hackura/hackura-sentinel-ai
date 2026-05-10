import axios from 'axios';
import { ScanResult, GraphData } from '../types/index.js';
import { randomUUID } from 'crypto';
import { queryThreatGraph } from './neo4j.js';

const OLLAMA_API_URL = process.env.OLLAMA_API_URL || 'http://localhost:11434';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'mistral';

const ollama = axios.create({
  baseURL: OLLAMA_API_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 60000,
});

const THREAT_ANALYSIS_PROMPT = `You are a cybersecurity threat intelligence expert. Analyze the following input for security threats.

Input: {input}
Type: {type}

Return ONLY valid JSON:
{
  "risk_score": <0-100>,
  "risk_level": "<LOW|MEDIUM|HIGH>",
  "confidence_score": <0-100>,
  "ai_explanation": "<1-2 sentences>",
  "risk_signals": ["<signal>", ...]
}`;

const GRAPH_ANALYSIS_PROMPT = `You are a threat intelligence analyst. Generate a threat relationship graph.

Entity: {entity}

Return ONLY valid JSON:
{
  "related_entities": [
    { "id": "<id>", "label": "<name>", "type": "<domain|ip|campaign|malware|threat_actor>", "risk_level": "<LOW|MEDIUM|HIGH>" }
  ],
  "relationships": [
    { "source_id": "<id>", "target_id": "<id>", "type": "<relationship>" }
  ]
}`;

export async function analyzeThreat(input: string, type: 'url' | 'domain' | 'text'): Promise<ScanResult> {
  try {
    const prompt = THREAT_ANALYSIS_PROMPT.replace('{input}', input).replace('{type}', type);
    const response = await ollama.post('/api/generate', {
      model: OLLAMA_MODEL,
      prompt,
      stream: false,
      temperature: 0.7,
    });

    const raw = response.data.response || '';
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('Invalid AI response format');

    const parsed = JSON.parse(jsonMatch[0]);

    return {
      id: randomUUID(),
      user_id: '',
      input,
      type,
      risk_score: Math.min(100, Math.max(0, parsed.risk_score ?? 50)),
      risk_level: (parsed.risk_level || 'MEDIUM') as 'LOW' | 'MEDIUM' | 'HIGH',
      confidence_score: Math.min(100, Math.max(0, parsed.confidence_score ?? 75)),
      ai_explanation: parsed.ai_explanation || 'Analysis complete.',
      risk_signals: Array.isArray(parsed.risk_signals) ? parsed.risk_signals : [],
      created_at: new Date().toISOString(),
    };
  } catch (error: any) {
    console.error('Ollama error:', error.message);
    throw new Error(`AI analysis failed: ${error.message}`);
  }
}

export async function generateThreatGraph(entity: string): Promise<GraphData> {
  // Try Neo4j first
  const neo4jResult = await queryThreatGraph(entity);
  if (neo4jResult && neo4jResult.nodes.length > 0) {
    console.log(`✅ Graph from Neo4j: ${neo4jResult.nodes.length} nodes`);
    return neo4jResult;
  }

  // Fallback to Ollama
  console.log('⚠️ Neo4j unavailable — falling back to Ollama');
  const prompt = GRAPH_ANALYSIS_PROMPT.replace('{entity}', entity);
  const response = await ollama.post('/api/generate', {
    model: OLLAMA_MODEL,
    prompt,
    stream: false,
    temperature: 0.7,
  });

  const raw = response.data.response || '';
  const jsonMatch = raw.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error('Invalid graph response format');

  const parsed = JSON.parse(jsonMatch[0]);

  const nodes = (parsed.related_entities || []).map((e: any) => ({
    id: e.id || e.label.toLowerCase().replace(/\s+/g, '_'),
    label: e.label,
    type: (e.type || 'threat_actor') as 'domain' | 'ip' | 'campaign' | 'malware' | 'threat_actor',
    risk_level: (e.risk_level || 'MEDIUM') as 'LOW' | 'MEDIUM' | 'HIGH',
    description: e.description,
  }));

  const edges = (parsed.relationships || []).map((r: any) => ({
    source: r.source_id,
    target: r.target_id,
    relationship: r.type || 'related_to',
    description: r.description,
  }));

  return { nodes, edges };
}

export async function checkOllamaHealth(): Promise<boolean> {
  try {
    const response = await ollama.get('/api/tags');
    return response.status === 200;
  } catch {
    return false;
  }
}
