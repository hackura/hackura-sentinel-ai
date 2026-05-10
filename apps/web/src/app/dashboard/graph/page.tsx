'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { GraphVisualizer } from '@/components/graph';
import { GlassCard, Button, LoadingSpinner } from '@/components/ui';
import { GraphData } from '@/types';

// Mock graph data
const mockGraphData: GraphData = {
  nodes: [
    { id: '1', label: 'phishing.com', type: 'domain', risk_level: 'HIGH' },
    { id: '2', label: '192.168.1.1', type: 'ip', risk_level: 'HIGH' },
    { id: '3', label: 'Campaign-2024', type: 'campaign', risk_level: 'HIGH' },
    { id: '4', label: 'malware.exe', type: 'malware', risk_level: 'HIGH' },
    { id: '5', label: 'fake-bank.net', type: 'domain', risk_level: 'MEDIUM' },
    { id: '6', label: '203.0.113.45', type: 'ip', risk_level: 'MEDIUM' },
  ],
  edges: [
    { source: '1', target: '2', relationship: 'hosted_on' },
    { source: '2', target: '3', relationship: 'part_of' },
    { source: '3', target: '4', relationship: 'distributes' },
    { source: '4', target: '5', relationship: 'targets' },
    { source: '5', target: '6', relationship: 'uses' },
    { source: '1', target: '3', relationship: 'created_by' },
  ],
};

export default function GraphExplorerPage() {
  const [graphData, setGraphData] = useState<GraphData | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedEntity, setSelectedEntity] = useState('');

  const handleLoadGraph = async (entity: string) => {
    setLoading(true);
    setSelectedEntity(entity);

    // Simulate API call
    setTimeout(() => {
      setGraphData(mockGraphData);
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-4xl font-bold text-white mb-2">Graph Explorer</h1>
        <p className="text-zinc-400">Visualize threat relationships in the network graph</p>
      </motion.div>

      {/* Search / Entity Selection */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <GlassCard>
          <h3 className="text-lg font-semibold text-white mb-4">Search Entity</h3>
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Enter domain, IP, or campaign..."
              value={selectedEntity}
              onChange={(e) => setSelectedEntity(e.target.value)}
              className="flex-1 bg-zinc-900/50 border border-zinc-700 rounded-lg px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20 transition-all"
            />
            <Button
              variant="primary"
              onClick={() => handleLoadGraph(selectedEntity || 'example')}
              loading={loading}
            >
              Explore
            </Button>
          </div>
        </GlassCard>
      </motion.div>

      {/* Graph Visualization */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
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

      {/* Graph Details */}
      {graphData && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          {/* Nodes List */}
          <GlassCard>
            <h3 className="text-lg font-semibold text-white mb-4">
              Nodes ({graphData.nodes.length})
            </h3>
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {graphData.nodes.map((node) => (
                <motion.div
                  key={node.id}
                  whileHover={{ x: 4 }}
                  className="bg-zinc-800/50 rounded-lg p-3 hover:bg-zinc-700/50 transition cursor-pointer"
                >
                  <div className="flex items-start gap-2">
                    <span className="text-lg mt-1">
                      {node.type === 'domain' && '🌐'}
                      {node.type === 'ip' && '🔌'}
                      {node.type === 'campaign' && '🎯'}
                      {node.type === 'malware' && '⚠️'}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-medium truncate">{node.label}</p>
                      <p className="text-zinc-500 text-xs">{node.type}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </GlassCard>

          {/* Edges List */}
          <GlassCard>
            <h3 className="text-lg font-semibold text-white mb-4">
              Relationships ({graphData.edges.length})
            </h3>
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {graphData.edges.map((edge, i) => (
                <motion.div
                  key={i}
                  whileHover={{ x: 4 }}
                  className="bg-zinc-800/50 rounded-lg p-3 hover:bg-zinc-700/50 transition"
                >
                  <p className="text-zinc-400 text-xs mb-1">
                    {graphData.nodes.find(n => n.id === edge.source)?.label}
                  </p>
                  <p className="text-white text-sm font-medium mb-1">
                    → {edge.relationship}
                  </p>
                  <p className="text-zinc-400 text-xs">
                    {graphData.nodes.find(n => n.id === edge.target)?.label}
                  </p>
                </motion.div>
              ))}
            </div>
          </GlassCard>

          {/* Statistics */}
          <GlassCard>
            <h3 className="text-lg font-semibold text-white mb-4">Network Stats</h3>
            <div className="space-y-4">
              <div>
                <p className="text-zinc-400 text-sm mb-1">Total Nodes</p>
                <p className="text-3xl font-bold text-purple-400">{graphData.nodes.length}</p>
              </div>
              <div>
                <p className="text-zinc-400 text-sm mb-1">Relationships</p>
                <p className="text-3xl font-bold text-blue-400">{graphData.edges.length}</p>
              </div>
              <div>
                <p className="text-zinc-400 text-sm mb-1">High Risk Nodes</p>
                <p className="text-3xl font-bold text-red-400">
                  {graphData.nodes.filter(n => n.risk_level === 'HIGH').length}
                </p>
              </div>
              <div>
                <p className="text-zinc-400 text-sm mb-1">Network Density</p>
                <p className="text-3xl font-bold text-green-400">
                  {((graphData.edges.length / (graphData.nodes.length * (graphData.nodes.length - 1) / 2)) * 100).toFixed(1)}%
                </p>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      )}

      {/* Quick Queries */}
      {!graphData && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <GlassCard>
            <h3 className="text-lg font-semibold text-white mb-4">Suggested Queries</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {[
                { title: 'Recent Campaign', entity: 'Campaign-2024' },
                { title: 'Malware Cluster', entity: 'malware-botnet-x' },
                { title: 'Phishing Network', entity: 'phishing-ring-001' },
              ].map((query, i) => (
                <motion.button
                  key={i}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => handleLoadGraph(query.entity)}
                  className="text-left bg-zinc-800/50 hover:bg-zinc-700/50 border border-zinc-700 rounded-lg p-4 transition-all"
                >
                  <p className="text-zinc-400 text-xs mb-2">{query.title}</p>
                  <p className="text-white text-sm truncate">{query.entity}</p>
                </motion.button>
              ))}
            </div>
          </GlassCard>
        </motion.div>
      )}
    </div>
  );
}
