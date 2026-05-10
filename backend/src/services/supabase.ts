import { createClient } from '@supabase/supabase-js';
import { ScanResult, User, DashboardStats } from '../types/index.js';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Supabase credentials not configured');
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

// Verify JWT token and get user
export async function verifyToken(token: string): Promise<User | null> {
  try {
    const { data, error } = await supabase.auth.getUser(token);
    if (error) return null;
    return data.user as User;
  } catch {
    return null;
  }
}

// Create a new scan record
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

  if (error) throw error;
  return data as ScanResult;
}

// Get scans for a user
export async function getScansByUser(userId: string, limit?: number) {
  let query = supabase
    .from('scans')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (limit) {
    query = query.limit(limit);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data as ScanResult[];
}

// Get single scan by ID
export async function getScanById(id: string, userId: string) {
  const { data, error } = await supabase
    .from('scans')
    .select('*')
    .eq('id', id)
    .eq('user_id', userId)
    .single();

  if (error) throw error;
  return data as ScanResult;
}

// Get dashboard stats for a user
export async function getDashboardStats(userId: string): Promise<DashboardStats> {
  const { data, error } = await supabase
    .rpc('get_dashboard_stats', { user_id: userId });

  if (error) {
    // Fallback: compute manually
    const scans = await getScansByUser(userId);
    return computeStatsManual(scans);
  }

  return data as DashboardStats;
}

// Compute stats manually from scans (fallback)
function computeStatsManual(scans: ScanResult[]): DashboardStats {
  const total = scans.length;
  const riskAlerts = scans.filter(s => s.risk_level === 'HIGH').length;
  const malicious = scans.filter(s => s.risk_level === 'MEDIUM' || s.risk_level === 'HIGH').length;
  const safe = scans.filter(s => s.risk_level === 'LOW').length;

  const distribution = {
    HIGH: riskAlerts,
    MEDIUM: scans.filter(s => s.risk_level === 'MEDIUM').length,
    LOW: safe,
  };

  return {
    total_scans: total,
    risk_alerts: riskAlerts,
    malicious_urls: malicious,
    safe_browsing: safe,
    risk_distribution: distribution,
    trend: undefined,
  };
}
