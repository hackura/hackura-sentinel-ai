import { createClient, type User } from '@supabase/supabase-js';
import { logger } from '../config/logger.js';
import type { ScanResult, DashboardStats } from '../types/index.js';

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  logger.warn('Supabase credentials not configured');
}

const supabase = createClient(SUPABASE_URL || '', SUPABASE_SERVICE_ROLE_KEY || '', {
  auth: {
    autoRefreshToken: false,
    detectSessionInUrl: false,
  },
});

// Verify JWT token from frontend
export async function verifyToken(token: string): Promise<User | null> {
  try {
    const { data, error } = await supabase.auth.getUser(token);
    if (error) {
      logger.warn({ error: error.message }, 'Token verification failed');
      return null;
    }
    return data.user as User;
  } catch (err) {
    logger.error({ err }, 'Token verification error');
    return null;
  }
}

// Create scan record
export async function createScan(scan: Omit<ScanResult, 'id' | 'created_at'>): Promise<ScanResult> {
  const { data, error } = await supabase
    .from('scans')
    .insert({
      user_id: scan.user_id,
      input: scan.input,
      type: scan.type,
      risk_score: scan.risk_score,
      risk_level: scan.risk_level,
      confidence_score: scan.confidence_score,
      ai_explanation: scan.ai_explanation,
      risk_signals: scan.risk_signals,
    })
    .select()
    .single();

  if (error) {
    logger.error({ error: error.message }, 'Failed to create scan');
    throw error;
  }

  return data as ScanResult;
}

// Get scans for a user
export async function getScansByUser(userId: string, limit?: number): Promise<ScanResult[]> {
  let query = supabase
    .from('scans')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (limit) {
    query = query.limit(limit);
  }

  const { data, error } = await query;

  if (error) {
    logger.error({ error: error.message }, 'Failed to fetch scans');
    throw error;
  }

  return (data || []) as ScanResult[];
}

// Get single scan by ID
export async function getScanById(id: string, userId: string): Promise<ScanResult> {
  const { data, error } = await supabase
    .from('scans')
    .select('*')
    .eq('id', id)
    .eq('user_id', userId)
    .single();

  if (error) {
    logger.error({ error: error.message }, 'Failed to fetch scan');
    throw error;
  }

  return data as ScanResult;
}

// Get dashboard stats
export async function getDashboardStats(userId: string): Promise<DashboardStats> {
  try {
    // Try RPC first
    const { data, error } = await supabase.rpc('get_dashboard_stats', { user_id: userId });

    if (!error && data) {
      return data as DashboardStats;
    }
  } catch (err) {
    logger.warn('RPC get_dashboard_stats not available, computing manually');
  }

  // Fallback: compute from scans
  const scans = await getScansByUser(userId);
  return computeStatsManual(scans);
}

// Compute stats manually
function computeStatsManual(scans: ScanResult[]): DashboardStats {
  const total = scans.length;
  const high = scans.filter(s => s.risk_level === 'HIGH').length;
  const medium = scans.filter(s => s.risk_level === 'MEDIUM').length;
  const low = scans.filter(s => s.risk_level === 'LOW').length;

  return {
    total_scans: total,
    risk_alerts: high,
    malicious_urls: high + medium,
    safe_browsing: low,
    risk_distribution: { HIGH: high, MEDIUM: medium, LOW: low },
    trend: undefined,
  };
}

export { supabase, type User };
