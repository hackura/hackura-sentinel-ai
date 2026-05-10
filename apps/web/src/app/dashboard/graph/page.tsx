'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { GraphVisualizer } from '@/components/graph';
import { GlassCard, Button, LoadingSpinner } from '@/components/ui';
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
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { error?: string } }; message?: string };
      setError(axiosError.response?.data?.error || axiosError.message || 'Failed to load graph');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 md:space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Graph Explorer</h1>
        <p className="text-sm md:text-base text-zinc-400">Visualize threat relationships in the network graph</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <GlassCard>
          <h3 className="text-lg font-semibold text-white mb-4">Search Entity</h3>
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Enter domain, IP, or campaign..."
              value={selectedEntity}
              onChange={(e) => setSelectedEntity(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleLoadGraph()}
              className="flex-1 bg-zinc-900/50 border border-zinc-700 rounded-lg px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20 transition-all"
            />
            <Button variant="primary" onClick={() => handleLoadGraph()} loading={loading}>
              Explore
            </Button>
          </div>
          {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
        </GlassCard>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        {loading ? (
          <GlassCard className="h-96 flex items-center justify-center">
            <div className="text-center">
              <LoadingSpinner size="lg" />
              <p className="text-zinc-400 mt-4">Building threat graph...</p>
            </div>
          </GlassCard>
        ) : graphData ? (
          <GraphVisualizer data={graphData} />
        ) : (
          <GlassCard className="h-96 flex items-center justify-center">
            <div className="text-center">
              <p className="text-2xl mb-2">🕸️</p>
              <p className="text-zinc-400">Search for an entity to visualize its threat graph</p>
            </div>
          </GlassCard>
        )}
      </motion.div>
    </div>
  );
}
