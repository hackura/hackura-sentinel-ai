'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useLiveScanPolling } from '@/hooks/useLiveScanPolling';
import { GlassCard, RiskBadge, LoadingSpinner, Button } from '@/components/ui';
import { GraphVisualizer } from '@/components/graph';
import { LiveScanData } from '@/types';

export default function LiveScanResultsPage() {
  const params = useParams();
  const router = useRouter();
  const scanId = params?.scanId as string;

  const { data, loading, error, isComplete, isFailed } = useLiveScanPolling({
    scanId: scanId || '',
    initialPollInterval: 1500,
    maxRetries: 10,
    enableBackoff: true,
  });

  if (!scanId) {
    return (
      <div className="space-y-6 pb-10">
        <div className="p-6 bg-red-900/20 border border-red-500/30 rounded-xl">
          <h2 className="text-red-300 font-bold">Invalid Scan</h2>
          <p className="text-red-200/70 text-sm mt-2">No scan ID provided.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 md:space-y-8 pb-10">
      {/* Navigation */}
      <nav className="flex items-center justify-between mb-4 px-1">
        <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-zinc-500">
          <Link href="/dashboard" className="hover:text-purple-400 transition-colors">Dashboard</Link>
          <span className="opacity-30">/</span>
          <span className="text-zinc-300">Scan Results</span>
        </div>
        <Link 
          href="/dashboard/scan" 
          className="text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-white transition-colors flex items-center gap-2 group"
        >
          <span className="group-hover:-translate-x-1 transition-transform inline-block">←</span>
          New Scan
        </Link>
      </nav>

      {/* Error State */}
      {error && !data && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-6 bg-red-900/20 border border-red-500/30 rounded-xl"
        >
          <div className="flex items-start gap-4">
            <div className="text-red-500 mt-1">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-red-300 font-bold mb-2">Scan Error</h3>
              <p className="text-red-200/70 text-sm mb-4">{error}</p>
              <button
                onClick={() => router.push('/dashboard/scan')}
                className="text-xs font-bold text-red-400 uppercase tracking-widest hover:text-red-300 transition-colors"
              >
                Start New Scan →
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Main Content */}
      {data && (
        <>
          {/* Header with Threat Level */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 tracking-tight">
                  Scan Results
                </h1>
                <p className="text-zinc-400 text-sm font-mono bg-zinc-900/50 px-3 py-1 rounded border border-zinc-800 break-all">
                  {data.input}
                </p>
              </div>

              <div className="flex flex-col items-end gap-2">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full animate-pulse ${
                    isComplete ? 'bg-green-500' :
                    isFailed ? 'bg-red-500' :
                    'bg-purple-500 shadow-lg shadow-purple-500/50'
                  }`} />
                  <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">
                    {isComplete ? 'Complete' : isFailed ? 'Failed' : 'Processing'}
                  </span>
                </div>
                <p className="text-xs text-zinc-600 font-mono">
                  ID: {scanId.substring(0, 8)}...
                </p>
              </div>
            </div>
          </motion.div>

          {/* Progress Bar */}
          {!isComplete && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="w-full bg-zinc-900/50 rounded-full h-1 overflow-hidden border border-zinc-800"
            >
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${data.progress || 0}%` }}
                transition={{ duration: 0.5 }}
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
              />
            </motion.div>
          )}

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Score & Status */}
            <div className="lg:col-span-1 space-y-6">
              {/* Threat Score */}
              <ScoringCard data={data} />

              {/* Verdict */}
              <VerdictCard data={data} />

              {/* Confidence Score */}
              <ConfidenceCard data={data} />

              {/* Loading Indicators */}
              {!isComplete && (
                <StatusIndicatorsCard data={data} />
              )}
            </div>

            {/* Middle Column - Intelligence */}
            <div className="lg:col-span-1 space-y-6">
              {/* DNS Intelligence */}
              <DNSIntelligenceCard data={data} />

              {/* SSL Analysis */}
              <SSLAnalysisCard data={data} />

              {/* Reputation Feeds */}
              <ReputationFeedsCard data={data} />
            </div>

            {/* Right Column - Graph & IOCs */}
            <div className="lg:col-span-1 space-y-6">
              {/* IOC Relationships */}
              <IOCRelationshipsCard data={data} />

              {/* AI Summary */}
              <AISummaryCard data={data} />
            </div>
          </div>

          {/* Full-width Graph */}
          {data.graph_data && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <GlassCard className="border-purple-500/20">
                <div className="mb-4">
                  <h2 className="text-xl font-bold text-white tracking-tight">
                    Threat Relationship Graph
                  </h2>
                  <p className="text-xs text-zinc-500 mt-1">
                    Interactive visualization of detected threat relationships
                  </p>
                </div>
                <div id="graph-container" className="w-full">
                  <GraphVisualizer data={data.graph_data} loading={!isComplete} />
                </div>
              </GlassCard>
            </motion.div>
          )}

          {/* Error Log */}
          {data.errors && data.errors.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <GlassCard className="border-yellow-500/20">
                <h3 className="text-sm font-bold text-yellow-300 mb-4 tracking-tight">
                  Processing Notices
                </h3>
                <div className="space-y-2">
                  {data.errors.map((err, idx) => (
                    <div key={idx} className="text-xs text-yellow-200/70 flex items-start gap-2">
                      <div>
                        <p className="font-mono">{err.phase}</p>
                        <p>{err.message}</p>
                        {err.recoverable && (
                          <p className="text-yellow-300/50 text-[10px] mt-1">
                            (This error is being recovered)
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </motion.div>
          )}

          {/* Metadata Footer */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-[10px] text-zinc-600 font-mono">
            <div>
              <p className="text-zinc-500 mb-1">CREATED</p>
              <p>{new Date(data.created_at).toLocaleString()}</p>
            </div>
            <div>
              <p className="text-zinc-500 mb-1">UPDATED</p>
              <p>{new Date(data.updated_at).toLocaleString()}</p>
            </div>
            <div>
              <p className="text-zinc-500 mb-1">SCAN ID</p>
              <p>{scanId}</p>
            </div>
            <div>
              <p className="text-zinc-500 mb-1">STATUS</p>
              <p className="uppercase tracking-wider">{data.status}</p>
            </div>
          </div>
        </>
      )}

      {/* Loading Skeleton */}
      {loading && !data && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6"
        >
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-64 bg-zinc-900/50 rounded-xl animate-pulse border border-zinc-800/50" />
          ))}
        </motion.div>
      )}
    </div>
  );
}

// ============ CARD COMPONENTS ============

function ScoringCard({ data }: { data: LiveScanData }) {
  const riskScore = data.scoring?.risk_score ?? 0;
  const riskLevel = data.scoring?.risk_level ?? 'UNKNOWN';

  const scoreColor = 
    riskLevel === 'HIGH' ? 'text-red-500' :
    riskLevel === 'MEDIUM' ? 'text-yellow-500' :
    riskLevel === 'LOW' ? 'text-green-500' :
    'text-zinc-500';

  const scoreGlow = 
    riskLevel === 'HIGH' ? 'shadow-[0_0_20px_rgba(239,68,68,0.5)]' :
    riskLevel === 'MEDIUM' ? 'shadow-[0_0_20px_rgba(245,158,11,0.5)]' :
    riskLevel === 'LOW' ? 'shadow-[0_0_20px_rgba(16,185,129,0.5)]' :
    '';

  return (
    <GlassCard className="border-zinc-800/50">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider">Threat Score</h3>
        {riskScore === 0 && !data.scoring ? (
          <div className="text-[10px] text-zinc-600 flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />
            Analyzing...
          </div>
        ) : null}
      </div>

      <div className={`text-center py-6 px-4 rounded-lg border border-zinc-800/30 bg-zinc-950/50 ${scoreGlow}`}>
        <p className={`text-5xl font-black mb-2 ${scoreColor}`}>
          {riskScore}
        </p>
        <p className="text-xs text-zinc-500 uppercase tracking-widest font-bold">
          {riskLevel}
        </p>
      </div>

      {data.scoring?.factors && data.scoring.factors.length > 0 && (
        <div className="mt-6 space-y-2 border-t border-zinc-800/30 pt-4">
          <p className="text-[10px] text-zinc-600 uppercase tracking-wider font-bold mb-3">Key Factors</p>
          {data.scoring.factors.slice(0, 3).map((factor, idx) => (
            <div key={idx} className="flex items-center justify-between text-[10px]">
              <span className="text-zinc-400">{factor.factor}</span>
              <span className="text-purple-400 font-mono">+{factor.contribution}</span>
            </div>
          ))}
        </div>
      )}
    </GlassCard>
  );
}

function VerdictCard({ data }: { data: LiveScanData }) {
  const verdict = data.ai_summary?.verdict || data.scoring?.risk_level || 'ANALYZING';

  const verdictColor = 
    verdict === 'HIGH' || verdict?.includes('MALICIOUS') ? 'text-red-400' :
    verdict === 'MEDIUM' || verdict?.includes('SUSPICIOUS') ? 'text-yellow-400' :
    verdict === 'LOW' || verdict?.includes('SAFE') ? 'text-green-400' :
    'text-blue-400';

  return (
    <GlassCard className="border-zinc-800/50">
      <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Verdict</h3>
      <p className={`text-2xl font-black leading-tight ${verdictColor}`}>
        {verdict === 'ANALYZING' ? (
          <span className="inline-flex items-center gap-2">
            <LoadingSpinner size="sm" className="inline" />
            Analyzing...
          </span>
        ) : (
          verdict
        )}
      </p>
    </GlassCard>
  );
}

function ConfidenceCard({ data }: { data: LiveScanData }) {
  const confidence = data.scoring?.confidence_score ?? 0;

  return (
    <GlassCard className="border-zinc-800/50">
      <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Confidence</h3>
      <div className="relative">
        <div className="w-full bg-zinc-800/50 rounded-full h-3 overflow-hidden border border-zinc-700/50">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${confidence}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
          />
        </div>
        <p className="text-center text-lg font-black text-purple-400 mt-3">
          {confidence}%
        </p>
      </div>
    </GlassCard>
  );
}

function StatusIndicatorsCard({ data }: { data: LiveScanData }) {
  const statusPhases = [
    { name: 'Recon', phase: 'recon', complete: !!data.recon_data },
    { name: 'Threat Intel', phase: 'threat_intelligence', complete: !!data.threat_intelligence },
    { name: 'Graph', phase: 'graph_building', complete: !!data.graph_data },
    { name: 'AI Summary', phase: 'ai_enrichment', complete: !!data.ai_summary },
  ];

  return (
    <GlassCard className="border-purple-500/20">
      <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Processing Stages</h3>
      <div className="space-y-2">
        {statusPhases.map((phase) => (
          <div key={phase.phase} className="flex items-center gap-2">
            {phase.complete ? (
              <div className="text-green-500">Done</div>
            ) : (
              <div className="text-purple-400 animate-pulse">⟳</div>
            )}
            <span className={`text-xs ${phase.complete ? 'text-green-400' : 'text-zinc-500'}`}>
              {phase.name}
            </span>
          </div>
        ))}
      </div>
    </GlassCard>
  );
}

function DNSIntelligenceCard({ data }: { data: LiveScanData }) {
  const dnsData = data.recon_data?.dns_records;

  if (!dnsData) {
    return (
      <GlassCard className="border-zinc-800/50">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">DNS Intelligence</h3>
          <div className="text-[10px] text-zinc-600 flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />
            Gathering...
          </div>
        </div>
        <div className="h-12 bg-zinc-900/50 rounded animate-pulse border border-zinc-800/50" />
      </GlassCard>
    );
  }

  return (
    <GlassCard className="border-blue-500/10">
      <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-3">DNS Intelligence</h3>
      <div className="space-y-2 text-[11px]">
        {Object.entries(dnsData).slice(0, 4).map(([key, value]) => (
          <div key={key} className="flex justify-between items-start">
            <span className="text-zinc-600 capitalize">{key.replace(/_/g, ' ')}</span>
            <span className="text-blue-400 font-mono text-right max-w-[50%] break-words">
              {typeof value === 'string' ? value : JSON.stringify(value).slice(0, 30)}
            </span>
          </div>
        ))}
      </div>
    </GlassCard>
  );
}

function SSLAnalysisCard({ data }: { data: LiveScanData }) {
  const sslData = data.recon_data?.ssl_cert;

  if (!sslData) {
    return (
      <GlassCard className="border-zinc-800/50">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">SSL Analysis</h3>
          <div className="text-[10px] text-zinc-600 flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />
            Gathering...
          </div>
        </div>
        <div className="h-12 bg-zinc-900/50 rounded animate-pulse border border-zinc-800/50" />
      </GlassCard>
    );
  }

  const isValid = sslData.valid !== false && new Date(sslData.expiry_date) > new Date();

  return (
    <GlassCard className={isValid ? 'border-green-500/10' : 'border-red-500/10'}>
      <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-3">SSL Analysis</h3>
      <div className="space-y-2 text-[11px]">
        <div className="flex justify-between">
          <span className="text-zinc-600">Status</span>
          <span className={isValid ? 'text-green-400' : 'text-red-400'}>
            {isValid ? 'Valid' : 'Invalid/Expired'}
          </span>
        </div>
        {sslData.issuer && (
          <div className="flex justify-between items-start">
            <span className="text-zinc-600">Issuer</span>
            <span className="text-blue-400 text-right max-w-[50%] break-words leading-tight">{sslData.issuer}</span>
          </div>
        )}
        {sslData.expiry_date && (
          <div className="flex justify-between">
            <span className="text-zinc-600">Expires</span>
            <span className="text-blue-400 font-mono">
              {new Date(sslData.expiry_date).toLocaleDateString()}
            </span>
          </div>
        )}
      </div>
    </GlassCard>
  );
}

function ReputationFeedsCard({ data }: { data: LiveScanData }) {
  const repFeeds = data.threat_intelligence?.reputation_feeds;

  if (!repFeeds) {
    return (
      <GlassCard className="border-zinc-800/50">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Reputation</h3>
          <div className="text-[10px] text-zinc-600 flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />
            Gathering...
          </div>
        </div>
        <div className="h-12 bg-zinc-900/50 rounded animate-pulse border border-zinc-800/50" />
      </GlassCard>
    );
  }

  return (
    <GlassCard className="border-orange-500/10">
      <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-3">Reputation Feeds</h3>
      <div className="space-y-2 text-[11px]">
        {Object.entries(repFeeds).map(([source, data]) => (
          <div key={source} className="flex justify-between items-center">
            <span className="text-zinc-600 capitalize">{source}</span>
            <span className="text-orange-400 font-mono">
              {typeof data === 'object' ? 'Detected' : data ? 'Bad' : 'Clean'}
            </span>
          </div>
        ))}
      </div>
    </GlassCard>
  );
}

function IOCRelationshipsCard({ data }: { data: LiveScanData }) {
  const iocs = data.threat_intelligence?.ioc_relationships;

  if (!iocs) {
    return (
      <GlassCard className="border-zinc-800/50">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">IOC Relationships</h3>
          <div className="text-[10px] text-zinc-600 flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />
            Gathering...
          </div>
        </div>
        <div className="h-12 bg-zinc-900/50 rounded animate-pulse border border-zinc-800/50" />
      </GlassCard>
    );
  }

  return (
    <GlassCard className="border-red-500/10 lg:row-span-2">
      <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-3">IOC Relationships</h3>
      <div className="space-y-2 text-[10px]">
        {iocs.length > 0 ? (
          iocs.slice(0, 6).map((ioc, idx) => (
            <div key={idx} className="p-2 bg-red-950/20 rounded border border-red-800/30">
              <p className="text-red-300 font-mono mb-1 break-all leading-tight">{ioc.indicator}</p>
              <p className="text-zinc-500 text-[9px] uppercase tracking-wider mb-1">{ioc.type}</p>
              {ioc.context && (
                <p className="text-zinc-400 text-[9px] leading-relaxed break-words mt-1 pt-1 border-t border-red-900/20 italic">
                  {ioc.context}
                </p>
              )}
            </div>
          ))
        ) : (
          <p className="text-zinc-500">No IOCs detected</p>
        )}
      </div>
    </GlassCard>
  );
}

function AISummaryCard({ data }: { data: LiveScanData }) {
  const summary = data.ai_summary;

  if (!summary) {
    return (
      <GlassCard className="border-zinc-800/50 lg:row-span-2">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">AI Summary</h3>
          <div className="text-[10px] text-zinc-600 flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />
            Analyzing...
          </div>
        </div>
        <div className="h-24 bg-zinc-900/50 rounded animate-pulse border border-zinc-800/50" />
      </GlassCard>
    );
  }

  return (
    <GlassCard className="border-purple-500/20 lg:row-span-2">
      <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-3">AI Threat Summary</h3>
      <div className="space-y-4">
        <p className="text-xs text-zinc-300 leading-relaxed">
          {summary.summary}
        </p>

        {summary.key_findings && summary.key_findings.length > 0 && (
          <div>
            <p className="text-[10px] text-zinc-600 uppercase tracking-wider font-bold mb-2">Key Findings</p>
            <ul className="space-y-1 text-[10px] text-zinc-400">
              {summary.key_findings.slice(0, 3).map((finding, idx) => (
                <li key={idx} className="flex gap-2">
                  <span className="text-purple-400 flex-shrink-0">•</span>
                  <span>{finding}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {summary.recommendations && summary.recommendations.length > 0 && (
          <div className="pt-2 border-t border-zinc-800/50">
            <p className="text-[10px] text-zinc-600 uppercase tracking-wider font-bold mb-2">Recommendations</p>
            <ul className="space-y-1 text-[10px] text-zinc-400">
              {summary.recommendations.slice(0, 2).map((rec, idx) => (
                <li key={idx} className="flex gap-2">
                  <span className="text-green-400 flex-shrink-0">→</span>
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </GlassCard>
  );
}
