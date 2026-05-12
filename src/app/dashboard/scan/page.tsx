'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ScanInput } from '@/components/dashboard';
import { GlassCard, RiskBadge, LoadingSpinner, Button } from '@/components/ui';
import { performScan } from '@/lib/api';
import { ScanResult } from '@/types';

export default function ScanPage() {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loadingPhase, setLoadingPhase] = useState(0);

  // Cycle through loading messages for slow AI scans
  useEffect(() => {
    let interval: any;
    if (loading) {
      interval = setInterval(() => {
        setLoadingPhase((prev) => (prev + 1) % 4);
      }, 5000);
    } else {
      setLoadingPhase(0);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const loadingMessages = [
    'Establishing secure connection...',
    'Analyzing threat patterns with AI...',
    'Correlating external intelligence...',
    'Finalizing security score...',
  ];

  const handleScan = async (scanInput: string) => {
    if (!scanInput || loading) return;

    setLoading(true);
    setError(null);
    setInput(scanInput);
    // Keep results visible until new results come in, or clear if you prefer
    // setResult(null); 

    try {
      console.log(`[Frontend] Initiating scan for: ${scanInput}`);
      const data = await performScan(scanInput);
      setResult(data);
    } catch (err: any) {
      console.error(`[Frontend Scan Error]`, err);
      
      const errorMessage = err.response?.data?.error || 
                          err.response?.data?.message || 
                          err.message || 
                          'An unexpected error occurred during analysis.';
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 md:space-y-8 pb-10">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 tracking-tight">Threat Scanner</h1>
        <p className="text-sm md:text-base text-zinc-400">
          Analyze URLs, domains, and suspicious text through our AI-powered intelligence engine
        </p>
      </motion.div>

      {/* Scan Input */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <GlassCard className="border-purple-500/20 shadow-lg shadow-purple-500/5">
          <ScanInput onSubmit={handleScan} loading={loading} />
        </GlassCard>
      </motion.div>

      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0, scale: 0.95 }}
            animate={{ opacity: 1, height: 'auto', scale: 1 }}
            exit={{ opacity: 0, height: 0, scale: 0.95 }}
            className="overflow-hidden"
          >
            <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-6 flex items-start gap-4">
              <div className="bg-red-500/20 p-2 rounded-lg text-red-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              </div>
              <div className="flex-1">
                <h4 className="text-red-400 font-bold mb-1">Scan Failure</h4>
                <p className="text-red-200/80 text-sm leading-relaxed">{error}</p>
                <button 
                  onClick={() => handleScan(input)}
                  className="mt-4 text-xs font-bold text-red-400 uppercase tracking-widest hover:text-red-300 transition-colors"
                >
                  Retry Analysis →
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading State - Premium Aesthetic */}
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            className="py-12"
          >
            <GlassCard className="relative overflow-hidden group border-purple-500/30">
              {/* Scanning Ray Effect */}
              <motion.div 
                animate={{ top: ['-100%', '200%'] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                className="absolute left-0 right-0 h-40 bg-gradient-to-b from-transparent via-purple-500/10 to-transparent pointer-events-none"
              />
              
              <div className="relative z-10 flex flex-col items-center justify-center text-center py-10">
                <div className="relative mb-8">
                  <div className="absolute inset-0 bg-purple-500/20 blur-3xl rounded-full" />
                  <LoadingSpinner size="lg" className="relative text-purple-400" />
                </div>
                
                <h3 className="text-xl font-bold text-white mb-2 tracking-wide">
                  Intelligence Gathering in Progress
                </h3>
                
                <AnimatePresence mode="wait">
                  <motion.p
                    key={loadingPhase}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-purple-300/70 text-sm font-mono h-5"
                  >
                    {loadingMessages[loadingPhase]}
                  </motion.p>
                </AnimatePresence>

                <div className="mt-8 flex gap-2">
                  {[0, 1, 2, 3].map((i) => (
                    <motion.div
                      key={i}
                      animate={{ 
                        opacity: loadingPhase >= i ? 1 : 0.2,
                        scale: loadingPhase === i ? 1.2 : 1 
                      }}
                      className="w-2 h-2 rounded-full bg-purple-500"
                    />
                  ))}
                </div>
              </div>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results */}
      {result && !loading && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Risk Score Overview */}
          <GlassCard className="border-zinc-800/50">
            <div className="flex flex-col md:flex-row items-start justify-between gap-4 mb-8">
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Analysis Intelligence</h3>
                <p className="text-zinc-500 text-sm font-mono bg-zinc-900/50 px-3 py-1 rounded border border-zinc-800 break-all">
                  {result.url}
                </p>
              </div>
              <div className="flex flex-col items-end">
                <RiskBadge level={result.risk_level} className="text-lg px-4 py-1" />
                <span className="text-[10px] text-zinc-600 mt-1 uppercase tracking-widest font-bold">Classification</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 items-center border-t border-zinc-800/50 pt-8">
              {/* Risk Score */}
              <div className="flex flex-col items-center">
                <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-6">Threat Intensity</p>
                <div className="relative w-36 h-36">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="6"
                      className="text-zinc-900"
                    />
                    <motion.circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="6"
                      strokeDasharray={`${(result.risk_score / 100) * 282.7} 282.7`}
                      className={
                        result.risk_level === 'HIGH'
                          ? 'text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)]'
                          : result.risk_level === 'MEDIUM'
                          ? 'text-yellow-500'
                          : 'text-green-500'
                      }
                      initial={{ strokeDasharray: '0 282.7' }}
                      animate={{ strokeDasharray: `${(result.risk_score / 100) * 282.7} 282.7` }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl font-black text-white">{result.risk_score}</span>
                    <span className="text-[10px] text-zinc-500 uppercase font-bold">Score</span>
                  </div>
                </div>
              </div>

              {/* Confidence Score */}
              <div className="flex flex-col items-center">
                <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-6">Model Confidence</p>
                <div className="text-center">
                  <p className="text-6xl font-black text-purple-500 mb-1 drop-shadow-2xl">
                    {Math.round(result.confidence_score)}%
                  </p>
                  <p className="text-[10px] text-purple-400/50 uppercase font-bold tracking-tighter">Certainty Rating</p>
                </div>
              </div>

              {/* Status */}
              <div className="flex flex-col items-center">
                <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-6">Network Signal</p>
                <div className="flex flex-col items-center justify-center space-y-2">
                  <div className={`w-3 h-3 rounded-full animate-pulse ${
                    result.risk_level === 'HIGH' ? 'bg-red-500 shadow-[0_0_8px_red]' : 
                    result.risk_level === 'MEDIUM' ? 'bg-yellow-500' : 'bg-green-500'
                  }`} />
                  <span className="text-white font-mono text-sm">{result.risk_level === 'HIGH' ? 'MALICIOUS' : result.risk_level === 'MEDIUM' ? 'SUSPICIOUS' : 'STABLE'}</span>
                </div>
              </div>
            </div>
          </GlassCard>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* AI Explanation */}
            <GlassCard className="border-purple-500/10">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-4 bg-purple-500 rounded" />
                <h3 className="text-lg font-bold text-white tracking-tight">AI Interpretation</h3>
              </div>
              <p className="text-zinc-400 leading-relaxed text-sm antialiased">
                {result.ai_explanation}
              </p>
            </GlassCard>

            {/* Risk Signals */}
            <GlassCard className="border-red-500/10">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-4 bg-red-500 rounded" />
                <h3 className="text-lg font-bold text-white tracking-tight">Threat Vectors</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {result.risk_signals && result.risk_signals.length > 0 ? (
                  result.risk_signals.map((signal, i) => (
                    <span 
                      key={i}
                      className="px-3 py-1 bg-red-500/10 border border-red-500/20 rounded-md text-[10px] font-bold text-red-400 uppercase tracking-widest"
                    >
                      {signal}
                    </span>
                  ))
                ) : (
                  <span className="text-zinc-600 text-sm italic">No specific risk signals detected.</span>
                )}
              </div>
            </GlassCard>
          </div>

          {/* Recommendations */}
          <GlassCard className="border-zinc-800/50 overflow-hidden">
             <div className="flex items-center gap-2 mb-6">
                <div className="w-2 h-4 bg-zinc-400 rounded" />
                <h3 className="text-lg font-bold text-white tracking-tight">Standard Operating Procedures</h3>
              </div>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {result.risk_level === 'HIGH' ? (
                <>
                  <li className="bg-red-500/5 border border-red-500/20 p-4 rounded-lg flex items-start gap-4">
                    <span className="bg-red-500 text-white w-6 h-6 rounded flex items-center justify-center flex-shrink-0 text-xs font-bold">1</span>
                    <p className="text-zinc-300 text-sm">
                      <strong>ABORT ACCESS:</strong> Terminate all connections to this resource immediately.
                    </p>
                  </li>
                  <li className="bg-red-500/5 border border-red-500/20 p-4 rounded-lg flex items-start gap-4">
                    <span className="bg-red-500 text-white w-6 h-6 rounded flex items-center justify-center flex-shrink-0 text-xs font-bold">2</span>
                    <p className="text-zinc-300 text-sm">
                      <strong>ISOLATE HOST:</strong> If credentials were provided, rotate them across all services.
                    </p>
                  </li>
                </>
              ) : result.risk_level === 'MEDIUM' ? (
                <li className="bg-yellow-500/5 border border-yellow-500/20 p-4 rounded-lg flex items-start gap-4">
                  <span className="bg-yellow-500 text-black w-6 h-6 rounded flex items-center justify-center flex-shrink-0 text-xs font-bold">!</span>
                  <p className="text-zinc-300 text-sm">
                    <strong>CAUTIONARY ACCESS:</strong> Use virtualized environment or VPN for any further interaction.
                  </p>
                </li>
              ) : (
                <li className="bg-green-500/5 border border-green-500/20 p-4 rounded-lg flex items-start gap-4">
                  <span className="bg-green-500 text-white w-6 h-6 rounded flex items-center justify-center flex-shrink-0 text-xs font-bold">✓</span>
                  <p className="text-zinc-300 text-sm">
                    <strong>PROCEED:</strong> No critical indicators detected. Resource matches safe behavior profiles.
                  </p>
                </li>
              )}
            </ul>
          </GlassCard>
          
          <div className="flex justify-center pt-4">
            <Button variant="secondary" onClick={() => setResult(null)} className="text-xs uppercase font-bold tracking-widest border-zinc-800 hover:bg-zinc-800">
              Reset Scanner
            </Button>
          </div>
        </motion.div>
      )}

      {/* Example Scans */}
      {!result && !loading && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <GlassCard className="border-zinc-800/50">
            <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-widest mb-6">Threat Templates</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { label: 'Deceptive Phishing', value: 'https://suspicious-crypto-airdrop.net' },
                { label: 'Banking Fraud', value: 'secure-payment-update.com' },
                { label: 'Suspicious Payload', value: 'analysis-request-034' },
              ].map((example, i) => (
                <motion.button
                  key={i}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleScan(example.value)}
                  className="group text-left bg-zinc-900/50 hover:bg-zinc-800/50 border border-zinc-800/50 rounded-xl p-5 transition-all"
                >
                  <p className="text-zinc-600 text-[10px] font-bold uppercase tracking-widest mb-2 group-hover:text-purple-400 transition-colors">
                    {example.label}
                  </p>
                  <p className="text-white text-sm truncate font-mono">{example.value}</p>
                </motion.button>
              ))}
            </div>
          </GlassCard>
        </motion.div>
      )}
    </div>
  );
}
