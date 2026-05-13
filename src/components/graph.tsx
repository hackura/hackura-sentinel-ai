'use client';

import React, { useRef, useState, useEffect, useCallback, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard, Button } from './ui';
import { GraphData, GraphNode, NodeType } from '@/types';

type GraphLink = {
  source: string | { id?: string };
  target: string | { id?: string };
};

// Dynamically import react-force-graph-2d to avoid SSR issues
const ForceGraph2D = dynamic(() => import('react-force-graph-2d'), {
  ssr: false,
  loading: () => (
    <div className="h-[600px] flex items-center justify-center bg-zinc-950/50 rounded-xl animate-pulse border border-zinc-800/50">
      <div className="text-zinc-500 font-mono text-[10px] uppercase tracking-[0.4em]">
        Initialising Canvas Engine...
      </div>
    </div>
  ),
});

interface GraphVisualizerProps {
  data?: GraphData | null;
  loading?: boolean;
}

const TYPE_ICONS: Record<string, string> = {
  domain: '🌐',
  ip: '🔌',
  url: '🔗',
  asn: '📡',
  certificate: '📜',
  malware: '⚠️',
  campaign: '🎯',
  technology: '💻',
  subdomain: '📁',
  organization: '🏢',
  email: '📧',
  hash: '🔑',
};

const RISK_COLORS: Record<string, string> = {
  HIGH: '#ef4444',
  MEDIUM: '#f59e0b',
  LOW: '#10b981',
  SAFE: '#10b981',
  INFRA: '#3b82f6',
  UNKNOWN: '#71717a',
};

export function GraphVisualizer({ data, loading = false }: GraphVisualizerProps) {
  const fgRef = useRef<any>(null);
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });

  const getLinkNodeId = (node: string | { id?: string }) =>
    typeof node === 'string' ? node : node.id || '';

  // 1. SAFE STATE INITIALIZATION: Normalize incoming data to ensure nodes/links are always arrays
  const normalizedData = useMemo(() => {
    return {
      nodes: Array.isArray(data?.nodes) ? data!.nodes : [],
      links: (Array.isArray((data as any)?.edges) ? (data as any).edges : (Array.isArray((data as any)?.links) ? (data as any).links : [])) as GraphLink[],
    };
  }, [data]);

  // 2. SAFE FILTERED DATA: Ensure filtered results always have valid arrays
  const safeGraphData = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    
    // Filter nodes safely
    const filteredNodes = normalizedData.nodes.filter(n => {
      if (!q) return true;
      return (
        n.label?.toLowerCase().includes(q) || 
        n.type?.toLowerCase().includes(q) ||
        n.id?.toLowerCase().includes(q)
      );
    });
    
    const nodeIds = new Set(filteredNodes.map(n => n.id));
    
    // Filter links safely based on existing nodes
    const filteredLinks = normalizedData.links.filter((l: GraphLink) => 
      nodeIds.has(getLinkNodeId(l.source)) && nodeIds.has(getLinkNodeId(l.target))
    );
    
    return { 
      nodes: filteredNodes, 
      links: filteredLinks 
    };
  }, [normalizedData, searchQuery]);

  // Handle dimensions
  useEffect(() => {
    const updateDimensions = () => {
      const container = document.getElementById('graph-container');
      if (container) {
        setDimensions({
          width: container.clientWidth,
          height: 600
        });
      }
    };
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Custom Node Painting
  const paintNode = useCallback((node: any, ctx: CanvasRenderingContext2D, globalScale: number) => {
    const { x, y, risk_level, type, label } = node;
    const color = RISK_COLORS[risk_level] || RISK_COLORS.UNKNOWN;
    const size = selectedNode?.id === node.id ? 10 : 7;
    const fontSize = 11 / globalScale;

    // Malicious Pulse
    if (risk_level === 'HIGH') {
      const t = Date.now() / 800;
      const pulse = (Math.sin(t * Math.PI) + 1) / 2;
      ctx.beginPath();
      ctx.arc(x, y, size + 5 * pulse, 0, 2 * Math.PI);
      ctx.fillStyle = `${color}11`;
      ctx.fill();
    }

    // Glow
    ctx.beginPath();
    ctx.arc(x, y, size + 2, 0, 2 * Math.PI);
    ctx.fillStyle = `${color}33`;
    ctx.fill();

    // Circle
    ctx.beginPath();
    ctx.arc(x, y, size, 0, 2 * Math.PI);
    ctx.fillStyle = '#000';
    ctx.fill();
    ctx.strokeStyle = color;
    ctx.lineWidth = 2 / globalScale;
    ctx.stroke();

    // Icon
    ctx.font = `${size * 1.2}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(TYPE_ICONS[type] || '◉', x, y);

    // Label on Zoom
    if (globalScale > 2) {
      ctx.font = `${fontSize}px "JetBrains Mono", monospace`;
      ctx.fillStyle = '#fff';
      ctx.fillText(label || 'Unknown', x, y + size + 10);
    }
  }, [selectedNode]);

  // Custom Link Painting
  const paintLink = useCallback((link: any, ctx: CanvasRenderingContext2D, globalScale: number) => {
    const { source, target, relationship } = link;
    if (!source || !target || typeof source !== 'object' || typeof target !== 'object') return;

    ctx.beginPath();
    ctx.moveTo(source.x, source.y);
    ctx.lineTo(target.x, target.y);
    ctx.strokeStyle = 'rgba(139, 92, 246, 0.2)';
    ctx.lineWidth = 1 / globalScale;
    ctx.stroke();

    if (globalScale > 3 && relationship) {
      const midX = (source.x + target.x) / 2;
      const midY = (source.y + target.y) / 2;
      ctx.font = `${7 / globalScale}px "JetBrains Mono"`;
      ctx.fillStyle = 'rgba(167, 139, 250, 0.5)';
      ctx.textAlign = 'center';
      ctx.fillText(relationship, midX, midY);
    }
  }, []);

  // 3. UI SAFETY: Show loading state if data is not ready
  if (loading || !data) {
    return (
      <GlassCard className="h-[600px] flex flex-col items-center justify-center border-purple-500/10 bg-black/40">
        <div className="relative">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            className="w-20 h-20 border-2 border-purple-500/5 border-t-purple-500 rounded-full"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xl animate-pulse">🛰️</span>
          </div>
        </div>
        <p className="mt-6 text-zinc-500 font-mono text-[9px] uppercase tracking-[0.5em] animate-pulse">
          Intelligence Pipeline Active...
        </p>
      </GlassCard>
    );
  }

  // 4. EMPTY STATE SAFETY
  if (normalizedData.nodes.length === 0) {
    return (
      <GlassCard className="h-[600px] flex flex-col items-center justify-center border-dashed border-zinc-800 bg-black/20">
        <p className="text-4xl mb-4 grayscale opacity-20">🕳️</p>
        <p className="text-zinc-600 font-mono text-[10px] uppercase tracking-widest text-center max-w-xs leading-relaxed">
          The requested entity returned zero intelligence nodes. <br/>Check the identifier and try again.
        </p>
      </GlassCard>
    );
  }

  return (
    <div className="relative h-full" id="graph-container">
      {/* Search Header */}
      <div className="absolute top-4 left-4 z-10 w-64">
        <div className="relative">
          <input
            type="text"
            placeholder="Search intelligence nodes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-zinc-950/90 border border-zinc-800 rounded-lg px-4 py-2.5 text-[10px] font-mono text-white placeholder-zinc-700 focus:outline-none focus:border-purple-500/40 transition-all shadow-2xl"
          />
          <div className="absolute right-3 top-2.5 text-zinc-600">🔍</div>
        </div>
      </div>

      {/* Force Graph Render */}
      <div className="rounded-xl overflow-hidden border border-zinc-800/50 bg-black/60 shadow-2xl">
        <ForceGraph2D
          ref={fgRef}
          graphData={safeGraphData}
          width={dimensions.width}
          height={dimensions.height}
          backgroundColor="#000000"
          nodeCanvasObject={paintNode}
          linkCanvasObject={paintLink}
          onNodeClick={(node: any) => setSelectedNode(node)}
          nodeRelSize={7}
          cooldownTicks={100}
          d3VelocityDecay={0.4}
          linkDirectionalArrowLength={3}
          linkDirectionalArrowRelPos={1}
        />
      </div>

      {/* Map Controls */}
      <div className="absolute bottom-4 left-4 z-10 flex gap-2">
        <button 
          onClick={() => fgRef.current?.zoomToFit(400)}
          className="p-2.5 bg-zinc-950/80 border border-zinc-800 rounded-lg text-zinc-500 hover:text-white transition-colors shadow-xl"
          title="Zoom to Fit"
        >
          🎯
        </button>
        <button 
          onClick={() => fgRef.current?.centerAt(0, 0, 400)}
          className="p-2.5 bg-zinc-950/80 border border-zinc-800 rounded-lg text-zinc-500 hover:text-white transition-colors shadow-xl"
          title="Center Perspective"
        >
          🏠
        </button>
      </div>

      {/* Investigation Side Panel */}
      <AnimatePresence>
        {selectedNode && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="absolute top-0 right-0 h-full w-80 z-20"
          >
            <div className="h-full bg-zinc-950/95 backdrop-blur-3xl border-l border-zinc-800/50 p-6 overflow-y-auto custom-scrollbar shadow-[-10px_0_50px_rgba(0,0,0,0.8)]">
              <div className="flex items-center justify-between mb-8">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600">Investigator v1.0</span>
                <button onClick={() => setSelectedNode(null)} className="text-zinc-600 hover:text-white transition-colors">✕</button>
              </div>

              <div className="flex items-center gap-4 mb-8">
                <span className="text-4xl">{TYPE_ICONS[selectedNode.type] || '◉'}</span>
                <div className="min-w-0">
                  <h2 className="text-lg font-black text-white truncate leading-tight uppercase tracking-tighter">
                    {selectedNode.label}
                  </h2>
                  <p className="text-[10px] font-mono text-purple-500 uppercase tracking-widest">{selectedNode.type}</p>
                </div>
              </div>

              <div className="space-y-8">
                <section>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Risk Score</h4>
                    <span className={`text-[10px] font-black uppercase ${
                      selectedNode.risk_level === 'HIGH' ? 'text-red-500' : 
                      selectedNode.risk_level === 'MEDIUM' ? 'text-yellow-500' : 'text-green-500'
                    }`}>
                      {selectedNode.risk_level || 'UNKNOWN'}
                    </span>
                  </div>
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-5xl font-black text-white tracking-tighter">
                      {selectedNode.metadata?.threat_score || 0}
                    </span>
                    <span className="text-xs text-zinc-700">/100</span>
                  </div>
                  <div className="w-full bg-zinc-900 h-1 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${selectedNode.metadata?.threat_score || 0}%` }}
                      className={`h-full ${
                        (selectedNode.metadata?.threat_score || 0) > 70 ? 'bg-red-500' :
                        (selectedNode.metadata?.threat_score || 0) > 30 ? 'bg-yellow-500' : 'bg-green-500'
                      }`}
                    />
                  </div>
                </section>

                <section className="grid grid-cols-2 gap-3">
                  <div className="bg-zinc-900/30 p-3 rounded-xl border border-zinc-800/50">
                    <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest mb-1">ASN</p>
                    <p className="text-xs font-mono text-zinc-300 truncate">{selectedNode.metadata?.asn || 'Unknown'}</p>
                  </div>
                  <div className="bg-zinc-900/30 p-3 rounded-xl border border-zinc-800/50">
                    <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest mb-1">GeoIP</p>
                    <p className="text-xs font-mono text-zinc-300 truncate">{selectedNode.metadata?.geoip || 'Unknown'}</p>
                  </div>
                </section>

                {selectedNode.metadata?.tags && (
                  <section>
                    <h4 className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-3">Tactical Tags</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedNode.metadata.tags.map((tag, i) => (
                        <span key={i} className="px-2.5 py-1 bg-purple-500/5 border border-purple-500/20 text-purple-400 text-[9px] font-black uppercase tracking-tighter rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </section>
                )}

                <section className="space-y-3">
                  <h4 className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-4">Intel Summary</h4>
                  <div className="flex justify-between items-center text-[11px] py-1">
                    <span className="text-zinc-500">VirusTotal Detections</span>
                    <span className="font-mono text-red-500 font-bold">{selectedNode.metadata?.vt_detections || 0}</span>
                  </div>
                  <div className="flex justify-between items-center text-[11px] py-1 border-t border-zinc-900">
                    <span className="text-zinc-500">Abuse Reports</span>
                    <span className="font-mono text-yellow-500 font-bold">{selectedNode.metadata?.abuse_reports || 0}</span>
                  </div>
                  <div className="flex justify-between items-center text-[11px] py-1 border-t border-zinc-900">
                    <span className="text-zinc-500">Linked Entities</span>
                    <span className="font-mono text-blue-500 font-bold">{selectedNode.metadata?.linked_entities || 0}</span>
                  </div>
                </section>

                <Button variant="primary" className="w-full mt-6 h-12 text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-purple-500/20">
                  Full Dossier Analysis
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
