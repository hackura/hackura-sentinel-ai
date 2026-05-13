'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GraphVisualizer } from '@/components/graph';
import { GlassCard, Button } from '@/components/ui';
import { getGraphData } from '@/lib/api';
import { GraphData } from '@/types';

export default function GraphExplorerPage() {
  const [graphData, setGraphData] = useState<GraphData | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedEntity, setSelectedEntity] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleLoadGraph = async (entity?: string) => {
    const query = entity || selectedEntity;
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    setGraphData(null);

    try {
      const data = await getGraphData(query);
      setGraphData(data);
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Threat engine connection failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full min-h-[calc(100vh-140px)] flex flex-col gap-6 md:gap-8 pb-4 w-full">
      {/* Header Section */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-white mb-2 tracking-tighter uppercase italic">
              Graph <span className="text-purple-500">Intelligence</span>
            </h1>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
              <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-[0.3em]">
                SOC Level 3 Infrastructure Analysis
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <div className="relative group min-w-[300px]">
              <input
                type="text"
                placeholder="Target Domain, IP, or Malware Hash..."
                value={selectedEntity}
                onChange={(e) => setSelectedEntity(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleLoadGraph()}
                className="w-full bg-zinc-950/80 border border-zinc-800 rounded-lg px-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20 transition-all font-mono"
              />
              <button 
                onClick={() => handleLoadGraph()}
                disabled={loading}
                className="absolute right-2 top-1.5 px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white text-[10px] font-bold uppercase tracking-widest rounded transition-all disabled:opacity-50"
              >
                {loading ? 'Analyzing...' : 'Execute'}
              </button>
            </div>
          </div>
        </div>
        {error && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-500 text-[10px] font-mono mt-2 uppercase">
            [!] Error: {error}
          </motion.p>
        )}
      </motion.div>

      {/* Main Visualization Area */}
      <div className="flex-1 min-h-[420px] w-full">
        {graphData || loading ? (
          <GraphVisualizer data={graphData || { nodes: [], edges: [] }} loading={loading} />
        ) : (
          <GlassCard className="h-full min-h-[420px] flex items-center justify-center border-dashed border-zinc-800">
            <div className="text-center group">
              <h3 className="text-zinc-500 font-mono text-xs uppercase tracking-[0.5em] mb-4">Initialize Intelligence Scan</h3>
              <p className="text-zinc-600 text-[10px] max-w-xs mx-auto leading-relaxed uppercase tracking-widest">
                Enter a network entity in the command bar to map relationships and detect malicious infrastructure patterns.
              </p>
            </div>
          </GlassCard>
        )}
      </div>

      {/* Footer System Specs */}
      <div className="flex flex-wrap gap-6 mt-1 opacity-30">
        <div className="flex items-center gap-2">
          <span className="text-[9px] font-mono text-zinc-500 uppercase">Engine:</span>
          <span className="text-[9px] font-mono text-purple-400 uppercase">H-Sent-v1-Force</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[9px] font-mono text-zinc-500 uppercase">Latency:</span>
          <span className="text-[9px] font-mono text-green-400 uppercase">24ms</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[9px] font-mono text-zinc-500 uppercase">Nodes:</span>
          <span className="text-[9px] font-mono text-white uppercase">{graphData?.nodes.length || 0}</span>
        </div>
      </div>
    </div>
  );
}
