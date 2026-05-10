'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { GlassCard, LoadingSpinner } from '@/components/ui';
import { getScans } from '@/lib/api';
import { ScanResult } from '@/types';

export default function HistoryPage() {
  const [scans, setScans] = useState<ScanResult[]>([]);
  const [filter, setFilter] = useState<'ALL' | 'HIGH' | 'MEDIUM' | 'LOW'>('ALL');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetch() {
      try {
        const data = await getScans();
        setScans(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Failed to fetch history:', error);
        setScans([]);
      } finally {
        setLoading(false);
      }
    }
    fetch();
  }, []);

  const filteredScans = scans.filter(
    scan => filter === 'ALL' || scan.risk_level === filter
  );

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'HIGH':
        return 'border-red-700/50 bg-red-900/10';
      case 'MEDIUM':
        return 'border-yellow-700/50 bg-yellow-900/10';
      default:
        return 'border-green-700/50 bg-green-900/10';
    }
  };

  const getRiskTextColor = (level: string) => {
    switch (level) {
      case 'HIGH':
        return 'text-red-400';
      case 'MEDIUM':
        return 'text-yellow-400';
      default:
        return 'text-green-400';
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 md:space-y-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Scan History</h1>
          <p className="text-sm md:text-base text-zinc-400">View and review your previous threat scans</p>
        </motion.div>
        <GlassCard className="h-64 flex items-center justify-center">
          <div className="text-center">
            <LoadingSpinner size="lg" />
            <p className="text-zinc-400 mt-4">Loading scan history...</p>
          </div>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Scan History</h1>
        <p className="text-sm md:text-base text-zinc-400">View and review your previous threat scans</p>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <GlassCard>
          <div className="flex gap-3 flex-wrap">
            {(['ALL', 'HIGH', 'MEDIUM', 'LOW'] as const).map((level) => (
              <motion.button
                key={level}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setFilter(level)}
                className={`
                  px-4 py-2 rounded-lg font-medium transition-all
                  ${
                    filter === level
                      ? 'bg-purple-600 text-white'
                      : 'bg-zinc-800/50 text-zinc-300 hover:bg-zinc-700/50'
                  }
                `}
              >
                {level === 'ALL' ? 'All Scans' : `${level} Risk`}
              </motion.button>
            ))}
          </div>
          <p className="text-zinc-400 text-sm mt-3">
            Showing {filteredScans.length} of {scans.length} scans
          </p>
        </GlassCard>
      </motion.div>

      {/* Scan History List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-3"
      >
        {filteredScans.map((scan, i) => (
          <motion.div
            key={scan.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <GlassCard
              className={`cursor-pointer transition-all ${getRiskColor(scan.risk_level)}`}
              hover={false}
            >
              <motion.button
                onClick={() =>
                  setExpandedId(expandedId === scan.id ? null : scan.id)
                }
                className="w-full text-left"
                whileHover={{ scale: 1.01 }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <p className="text-white font-medium truncate">{scan.url}</p>
                    <p className="text-zinc-400 text-xs mt-1">
                      {new Date(scan.created_at).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-4 ml-4">
                    <div className="text-right">
                      <p className={`text-xl font-bold ${getRiskTextColor(scan.risk_level)}`}>
                        {scan.risk_score}
                      </p>
                      <p className="text-zinc-500 text-xs">{scan.risk_level}</p>
                    </div>
                    <span className="text-xl text-zinc-400">
                      {expandedId === scan.id ? '▼' : '▶'}
                    </span>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-zinc-400 text-xs mb-1">Confidence</p>
                    <p className="text-lg font-semibold text-purple-400">
                      {Math.round(scan.confidence_score * 100)}%
                    </p>
                  </div>
                  <div>
                    <p className="text-zinc-400 text-xs mb-1">Risk Signals</p>
                    <p className="text-lg font-semibold text-red-400">
                      {scan.risk_signals.length}
                    </p>
                  </div>
                  <div>
                    <p className="text-zinc-400 text-xs mb-1">Status</p>
                    <p className="text-lg font-semibold text-green-400">✓</p>
                  </div>
                </div>
              </motion.button>

              {/* Expanded Details */}
              {expandedId === scan.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 pt-4 border-t border-zinc-700/50 space-y-3"
                >
                  <div>
                    <p className="text-zinc-400 text-sm mb-2">Analysis</p>
                    <p className="text-zinc-300 text-sm">{scan.ai_explanation}</p>
                  </div>

                  {scan.risk_signals.length > 0 && (
                    <div>
                      <p className="text-zinc-400 text-sm mb-2">Detected Signals</p>
                      <div className="flex flex-wrap gap-2">
                        {scan.risk_signals.map((signal: string, j: number) => (
                          <span
                            key={j}
                            className="text-xs bg-red-900/30 text-red-300 px-2 py-1 rounded border border-red-700/50"
                          >
                            {signal}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      className="text-xs bg-purple-600/50 hover:bg-purple-600 text-purple-100 px-3 py-1 rounded transition"
                    >
                      View Full Report
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      className="text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-3 py-1 rounded transition"
                    >
                      Rescan
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </GlassCard>
          </motion.div>
        ))}

        {filteredScans.length === 0 && (
          <GlassCard>
            <p className="text-zinc-400 text-center py-8">No scans found for selected filter</p>
          </GlassCard>
        )}
      </motion.div>

      {/* Statistics Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-4"
      >
        <GlassCard>
          <p className="text-zinc-400 text-sm mb-2">Total Scans</p>
          <p className="text-3xl font-bold text-white">{scans.length}</p>
        </GlassCard>
        <GlassCard>
          <p className="text-zinc-400 text-sm mb-2">High Risk</p>
          <p className="text-3xl font-bold text-red-400">
            {scans.filter(s => s.risk_level === 'HIGH').length}
          </p>
        </GlassCard>
        <GlassCard>
          <p className="text-zinc-400 text-sm mb-2">Clean Domains</p>
          <p className="text-3xl font-bold text-green-400">
            {scans.filter(s => s.risk_level === 'LOW').length}
          </p>
        </GlassCard>
        <GlassCard>
          <p className="text-zinc-400 text-sm mb-2">Avg Confidence</p>
          <p className="text-3xl font-bold text-purple-400">
            {Math.round(
              (scans.reduce((sum, s) => sum + s.confidence_score, 0) / scans.length) * 100
            )}%
          </p>
        </GlassCard>
      </motion.div>
    </div>
  );
}
