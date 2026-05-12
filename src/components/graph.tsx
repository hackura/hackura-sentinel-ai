'use client';

import { motion } from 'framer-motion';
import { GlassCard } from './ui';
import { GraphData, GraphNode } from '@/types';

interface GraphVisualizerProps {
  data: GraphData;
  loading?: boolean;
}

export function GraphVisualizer({ data, loading = false }: GraphVisualizerProps) {
  if (loading) {
    return (
      <GlassCard className="h-96 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-8 h-8 border-2 border-purple-500/30 border-t-purple-500 rounded-full"
        />
      </GlassCard>
    );
  }

  if (!data.nodes || data.nodes.length === 0) {
    return (
      <GlassCard className="h-96 flex items-center justify-center">
        <p className="text-zinc-400">No graph data available</p>
      </GlassCard>
    );
  }

  // Simple circular layout
  const width = 600;
  const height = 400;
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = 150;

  const positions = data.nodes.map((node, index) => {
    const angle = (index / data.nodes.length) * 2 * Math.PI;
    return {
      id: node.id,
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle),
    };
  });

  const getRiskColor = (riskLevel?: 'LOW' | 'MEDIUM' | 'HIGH') => {
    switch (riskLevel) {
      case 'HIGH':
        return '#dc2626';
      case 'MEDIUM':
        return '#eab308';
      case 'LOW':
        return '#16a34a';
      default:
        return '#6366f1';
    }
  };

  const getTypeIcon = (type: string) => {
    const icons: Record<string, string> = {
      domain: '🌐',
      ip: '🔌',
      campaign: '🎯',
      malware: '⚠️',
    };
    return icons[type] || '◉';
  };

  return (
    <GlassCard className="overflow-hidden">
      <h3 className="text-lg font-semibold text-white mb-4">Graph Relationships</h3>

      <svg
        width="100%"
        height="400"
        viewBox={`0 0 ${width} ${height}`}
        className="bg-zinc-900/30 rounded-lg"
      >
        {/* Draw edges */}
        {data.edges.map((edge, i) => {
          const from = positions.find(p => p.id === edge.source);
          const to = positions.find(p => p.id === edge.target);

          if (!from || !to) return null;

          return (
            <g key={`edge-${i}`}>
              <line
                x1={from.x}
                y1={from.y}
                x2={to.x}
                y2={to.y}
                stroke="#6366f1"
                strokeWidth="1.5"
                opacity="0.3"
              />
              <text
                x={(from.x + to.x) / 2}
                y={(from.y + to.y) / 2}
                fontSize="10"
                fill="#9ca3af"
                textAnchor="middle"
                opacity="0.6"
              >
                {edge.relationship}
              </text>
            </g>
          );
        })}

        {/* Draw nodes */}
        {data.nodes.map((node, i) => {
          const pos = positions[i];
          return (
            <motion.g
              key={node.id}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: i * 0.05 }}
            >
              <circle
                cx={pos.x}
                cy={pos.y}
                r="28"
                fill={getRiskColor(node.risk_level)}
                opacity="0.2"
              />
              <circle
                cx={pos.x}
                cy={pos.y}
                r="24"
                fill="none"
                stroke={getRiskColor(node.risk_level)}
                strokeWidth="2"
              />
              <text
                x={pos.x}
                y={pos.y}
                fontSize="14"
                textAnchor="middle"
                dominantBaseline="middle"
                fill="white"
              >
                {getTypeIcon(node.type)}
              </text>
              <text
                x={pos.x}
                y={pos.y + 40}
                fontSize="11"
                textAnchor="middle"
                fill="#d1d5db"
                className="pointer-events-none"
              >
                {node.label.substring(0, 12)}
              </text>
            </motion.g>
          );
        })}
      </svg>

      <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
        {data.nodes.length > 0 && (
          <p className="text-zinc-400">
            <span className="font-semibold text-white">{data.nodes.length}</span> nodes
          </p>
        )}
        {data.edges.length > 0 && (
          <p className="text-zinc-400">
            <span className="font-semibold text-white">{data.edges.length}</span> relationships
          </p>
        )}
      </div>
    </GlassCard>
  );
}
