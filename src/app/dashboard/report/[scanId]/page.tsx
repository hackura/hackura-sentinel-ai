'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { GraphVisualizer } from '@/components/graph';
import { GlassCard, LoadingSpinner, RiskBadge } from '@/components/ui';
import { ScanResult } from '@/types';

type ReportScan = ScanResult & {
  status?: string;
  updated_at?: string;
  [key: string]: any;
};

export default function ReportDetailPage() {
  const params = useParams();
  const scanId = params?.scanId as string;
  const [scan, setScan] = useState<ReportScan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchReport = async () => {
      if (!scanId) {
        setError('Missing scan id');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('scans')
        .select('*')
        .eq('id', scanId)
        .maybeSingle();

      if (!isMounted) return;

      if (fetchError) {
        setError(fetchError.message || 'Failed to load report');
        setScan(null);
      } else if (!data) {
        setError('Report not found or access denied.');
        setScan(null);
      } else {
        setScan(data as ReportScan);
      }

      setLoading(false);
    };

    fetchReport();

    return () => {
      isMounted = false;
    };
  }, [scanId]);

  const riskSignals = Array.isArray(scan?.risk_signals) ? scan.risk_signals : [];
  const graphData = scan?.graph_data && typeof scan.graph_data === 'object' ? scan.graph_data : null;
  const intel = scan?.intel && typeof scan.intel === 'object' ? scan.intel : null;

  return (
    <div className="space-y-6 md:space-y-8 pb-10">
      <nav className="flex items-center justify-between mb-4 px-1">
        <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-zinc-500">
          <Link href="/dashboard" className="hover:text-purple-400 transition-colors">Dashboard</Link>
          <span className="opacity-30">/</span>
          <span className="text-zinc-300">Report</span>
        </div>
        <Link
          href="/dashboard/history"
          className="text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-white transition-colors flex items-center gap-2 group"
        >
          <span className="group-hover:-translate-x-1 transition-transform inline-block">←</span>
          Back to History
        </Link>
      </nav>

      {loading && (
        <GlassCard className="h-72 flex items-center justify-center border-purple-500/10">
          <div className="text-center">
            <LoadingSpinner size="lg" />
            <p className="text-zinc-400 mt-4">Loading report directly from the database...</p>
          </div>
        </GlassCard>
      )}

      {!loading && error && (
        <GlassCard className="border-red-500/20 bg-red-950/10">
          <h1 className="text-2xl font-bold text-white mb-2">Report unavailable</h1>
          <p className="text-red-300/80 text-sm">{error}</p>
        </GlassCard>
      )}

      {!loading && scan && (
        <>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <GlassCard className="border-zinc-800/50">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                <div className="space-y-3 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight break-all">
                      {scan.url}
                    </h1>
                    <RiskBadge level={scan.risk_level} className="shrink-0" />
                  </div>
                  <p className="text-sm text-zinc-500 font-mono">
                    Report ID: {scan.id}
                  </p>
                  <p className="text-sm text-zinc-400 max-w-3xl">
                    {scan.ai_explanation || 'No AI summary was stored with this report.'}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 min-w-[240px]">
                  <div className="bg-zinc-950/50 border border-zinc-800 rounded-xl p-4">
                    <p className="text-[10px] uppercase tracking-widest text-zinc-500 mb-1">Threat Score</p>
                    <p className="text-3xl font-black text-white">{scan.risk_score}</p>
                  </div>
                  <div className="bg-zinc-950/50 border border-zinc-800 rounded-xl p-4">
                    <p className="text-[10px] uppercase tracking-widest text-zinc-500 mb-1">Confidence</p>
                    <p className="text-3xl font-black text-purple-400">{Math.round(scan.confidence_score)}%</p>
                  </div>
                  <div className="bg-zinc-950/50 border border-zinc-800 rounded-xl p-4 col-span-2">
                    <p className="text-[10px] uppercase tracking-widest text-zinc-500 mb-1">Created</p>
                    <p className="text-sm text-zinc-300 font-mono">{new Date(scan.created_at).toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </GlassCard>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <GlassCard className="border-purple-500/10">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-4">AI Threat Summary</h2>
              <p className="text-sm text-zinc-300 leading-relaxed">
                {scan.intel?.summary || scan.ai_explanation || 'No AI summary is available for this report.'}
              </p>
            </GlassCard>

            <GlassCard className="border-red-500/10">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Verdict</h2>
              <p className={`text-2xl font-black ${scan.risk_level === 'HIGH' ? 'text-red-400' : scan.risk_level === 'MEDIUM' ? 'text-yellow-400' : 'text-green-400'}`}>
                {scan.risk_level}
              </p>
            </GlassCard>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <GlassCard className="border-zinc-800/50">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Risk Signals</h2>
              {riskSignals.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {riskSignals.map((signal, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 rounded-md border border-red-500/20 bg-red-500/10 text-red-300 text-[10px] font-bold uppercase tracking-widest"
                    >
                      {signal}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-zinc-500 text-sm">No risk signals were stored for this report.</p>
              )}
            </GlassCard>

            <GlassCard className="border-zinc-800/50">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Scan Metadata</h2>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-zinc-500 text-[10px] uppercase tracking-widest mb-1">Report Status</p>
                  <p className="text-zinc-300 font-mono">{scan.status || 'completed'}</p>
                </div>
                <div>
                  <p className="text-zinc-500 text-[10px] uppercase tracking-widest mb-1">Last Updated</p>
                  <p className="text-zinc-300 font-mono">{scan.updated_at ? new Date(scan.updated_at).toLocaleString() : '—'}</p>
                </div>
                <div>
                  <p className="text-zinc-500 text-[10px] uppercase tracking-widest mb-1">Evidence Count</p>
                  <p className="text-zinc-300 font-mono">{riskSignals.length}</p>
                </div>
                <div>
                  <p className="text-zinc-500 text-[10px] uppercase tracking-widest mb-1">Graph Nodes</p>
                  <p className="text-zinc-300 font-mono">{Array.isArray(scan.graph_data?.nodes) ? scan.graph_data.nodes.length : 0}</p>
                </div>
              </div>
            </GlassCard>
          </div>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <GlassCard className="border-purple-500/20">
              <div className="mb-4">
                <h2 className="text-xl font-bold text-white tracking-tight">Threat Relationship Graph</h2>
                <p className="text-xs text-zinc-500 mt-1">Saved graph data loaded directly from the report record</p>
              </div>
              {graphData ? (
                <div id="graph-container" className="w-full min-h-[620px]">
                  <GraphVisualizer data={graphData} />
                </div>
              ) : (
                <div className="min-h-[240px] flex items-center justify-center border border-dashed border-zinc-800 rounded-xl bg-black/30">
                  <p className="text-zinc-500 text-sm">No graph data was stored with this report.</p>
                </div>
              )}
            </GlassCard>
          </motion.div>

          {intel?.timeline && Array.isArray(intel.timeline) && intel.timeline.length > 0 && (
            <GlassCard className="border-zinc-800/50">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Intel Timeline</h2>
              <div className="space-y-3">
                {intel.timeline.map((entry: any, index: number) => (
                  <div key={index} className="border-l-2 border-purple-500/30 pl-4 py-1">
                    <p className="text-xs text-zinc-500 font-mono">{entry.date}</p>
                    <p className="text-sm text-zinc-300 font-semibold">{entry.event}</p>
                    <p className="text-xs text-zinc-500">{entry.details}</p>
                  </div>
                ))}
              </div>
            </GlassCard>
          )}
        </>
      )}
    </div>
  );
}
