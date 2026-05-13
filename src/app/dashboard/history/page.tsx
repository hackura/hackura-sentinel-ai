'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard, LoadingSpinner } from '@/components/ui';
import { ConfirmationModal } from '@/components/confirmation-modal';
import { getScans, clearScans, deleteScan } from '@/lib/api';
import { ScanResult } from '@/types';

export default function HistoryPage() {
  const [scans, setScans] = useState<ScanResult[]>([]);
  const [filter, setFilter] = useState<'ALL' | 'HIGH' | 'MEDIUM' | 'LOW'>('ALL');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Modal States
  const [isPurgeModalOpen, setIsPurgeModalOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

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

  const handleClearHistory = async () => {
    try {
      await clearScans();
      setScans([]);
      setIsPurgeModalOpen(false);
    } catch (err) {
      alert('Failed to clear history.');
    }
  };

  const handleDeleteItem = async () => {
    if (!deleteTargetId) return;
    try {
      await deleteScan(deleteTargetId);
      setScans(prev => prev.filter(s => s.id !== deleteTargetId));
      setDeleteTargetId(null);
    } catch (err) {
      alert('Failed to delete scan.');
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 md:space-y-8">
        <GlassCard className="h-64 flex items-center justify-center">
          <div className="text-center">
            <LoadingSpinner size="lg" />
            <p className="text-zinc-400 mt-4">Syncing intelligence history...</p>
          </div>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="space-y-6 md:space-y-8 pb-10">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 tracking-tight">Intelligence History</h1>
            <p className="text-sm md:text-base text-zinc-400 font-mono uppercase tracking-widest text-[10px]">
              Archived threat analysis reports
            </p>
          </div>
          <button
            onClick={() => setIsPurgeModalOpen(true)}
            className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all"
          >
            Purge History
          </button>
        </div>
      </motion.div>

      {/* Statistics Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        <GlassCard className="py-4">
          <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-1">Total Scans</p>
          <p className="text-2xl font-bold text-white">{scans.length}</p>
        </GlassCard>
        <GlassCard className="py-4 border-red-500/20">
          <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-1">High Risk</p>
          <p className="text-2xl font-bold text-red-500">
            {scans.filter(s => s.risk_level === 'HIGH').length}
          </p>
        </GlassCard>
        <GlassCard className="py-4 border-green-500/20">
          <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-1">Safe</p>
          <p className="text-2xl font-bold text-green-500">
            {scans.filter(s => s.risk_level === 'LOW').length}
          </p>
        </GlassCard>
        <GlassCard className="py-4 border-purple-500/20">
          <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-1">Avg Confidence</p>
          <p className="text-2xl font-bold text-purple-400">
            {scans.length > 0 
              ? Math.round(scans.reduce((sum, s) => sum + s.confidence_score, 0) / scans.length)
              : 0}%
          </p>
        </GlassCard>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
          {(['ALL', 'HIGH', 'MEDIUM', 'LOW'] as const).map((level) => (
            <button
              key={level}
              onClick={() => setFilter(level)}
              className={`
                px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all whitespace-nowrap border
                ${
                  filter === level
                    ? 'bg-purple-600 border-purple-400 text-white shadow-[0_0_15px_rgba(168,85,247,0.4)]'
                    : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:border-zinc-700'
                }
              `}
            >
              {level === 'ALL' ? 'Show All' : `${level} Risk`}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Scan History List */}
      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {filteredScans.map((scan, i) => (
            <motion.div
              key={scan.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <GlassCard
                className={`group transition-all ${getRiskColor(scan.risk_level)} border-l-4`}
                hover={false}
              >
                <div 
                  className="cursor-pointer"
                  onClick={() => setExpandedId(expandedId === scan.id ? null : scan.id)}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-bold truncate text-sm md:text-base">{scan.url}</p>
                      <p className="text-zinc-500 text-[10px] font-mono mt-1">
                        {new Date(scan.created_at).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className={`text-lg font-black ${getRiskTextColor(scan.risk_level)}`}>
                          {scan.risk_score}
                        </p>
                        <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-tighter">Intensity</p>
                      </div>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteTargetId(scan.id);
                        }}
                        className="opacity-0 group-hover:opacity-100 p-2 text-zinc-600 hover:text-red-500 transition-all"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                      </button>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-3 gap-2 border-t border-zinc-800/50 pt-4">
                    <div>
                      <p className="text-zinc-600 text-[10px] font-bold uppercase tracking-widest mb-1">Confidence</p>
                      <p className="text-sm font-bold text-purple-400">{Math.round(scan.confidence_score)}%</p>
                    </div>
                    <div>
                      <p className="text-zinc-600 text-[10px] font-bold uppercase tracking-widest mb-1">Signals</p>
                      <p className="text-sm font-bold text-zinc-300">{scan.risk_signals.length}</p>
                    </div>
                    <div className="flex justify-end items-center">
                      <span className="text-zinc-700 group-hover:text-white transition-colors">
                        {expandedId === scan.id ? '↑' : '↓'}
                      </span>
                    </div>
                  </div>
                </div>

                {expandedId === scan.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-4 pt-4 border-t border-zinc-800/50 space-y-4">
                      <div>
                        <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-2">Analysis Outcome</p>
                        <p className="text-zinc-400 text-sm leading-relaxed antialiased italic">
                          "{scan.ai_explanation}"
                        </p>
                      </div>

                      {scan.risk_signals.length > 0 && (
                        <div>
                          <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-2">Detected Vectors</p>
                          <div className="flex flex-wrap gap-2">
                            {scan.risk_signals.map((signal: string, j: number) => (
                              <span
                                key={j}
                                className="text-[10px] font-bold bg-zinc-950 text-zinc-400 px-2 py-1 rounded border border-zinc-800 uppercase tracking-tighter"
                              >
                                {signal}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </GlassCard>
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredScans.length === 0 && (
          <GlassCard className="py-12 border-dashed border-zinc-800">
            <p className="text-zinc-600 text-center font-mono italic text-sm">No historical intelligence matches your filter.</p>
          </GlassCard>
        )}
      </div>

      {/* Modals */}
      <ConfirmationModal
        isOpen={isPurgeModalOpen}
        onClose={() => setIsPurgeModalOpen(false)}
        onConfirm={handleClearHistory}
        title="Purge Intelligence History"
        message="Are you sure you want to permanently delete all archived threat reports? This action cannot be undone."
        confirmText="Confirm Purge"
        variant="danger"
      />

      <ConfirmationModal
        isOpen={!!deleteTargetId}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={handleDeleteItem}
        title="Delete Scan Report"
        message="Remove this specific threat analysis from your history?"
        confirmText="Delete"
        variant="danger"
      />
    </div>
  );
}
