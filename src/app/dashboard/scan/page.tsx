'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { ScanInput } from '@/components/dashboard';
import { GlassCard, LoadingSpinner } from '@/components/ui';
import { initiateScan } from '@/lib/api';

export default function ScanPage() {
  const router = useRouter();
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [scanId, setScanId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loadingPhase, setLoadingPhase] = useState(0);

  // Cycle through loading messages for initiating scan
  useEffect(() => {
    let interval: any;
    if (loading) {
      interval = setInterval(() => {
        setLoadingPhase((prev) => (prev + 1) % 4);
      }, 1500);
    } else {
      setLoadingPhase(0);
    }
    return () => clearInterval(interval);
  }, [loading]);

  // Redirect when scan is initiated
  useEffect(() => {
    if (scanId) {
      // Slight delay to allow user to see the success state
      const timeout = setTimeout(() => {
        router.push(`/dashboard/scan/${scanId}`);
      }, 800);
      return () => clearTimeout(timeout);
    }
  }, [scanId, router]);

  const loadingMessages = [
    'Initiating threat engine...',
    'Registering scan session...',
    'Establishing intelligence pipeline...',
    'Beginning analysis...',
  ];

  const handleScan = async (scanInput: string) => {
    if (!scanInput || loading) return;

    setLoading(true);
    setError(null);
    setInput(scanInput);
    setScanId(null);

    try {
      console.log(`[Frontend] Initiating async scan for: ${scanInput}`);
      const response = await initiateScan(scanInput);
      console.log(`[Frontend] Scan initiated with ID: ${response.scanId}`);
      setScanId(response.scanId);
    } catch (err: any) {
      console.error(`[Frontend Scan Initiation Error]`, err);

      const errorMessage = 
        err.response?.data?.error ||
        err.response?.data?.message ||
        err.message ||
        'Failed to initiate scan. Please check your input and try again.';

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 md:space-y-8 pb-10">
      {/* Page Navbar / Breadcrumbs */}
      <nav className="flex items-center justify-between mb-4 px-1">
        <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-zinc-500">
          <Link href="/dashboard" className="hover:text-purple-400 transition-colors">Dashboard</Link>
          <span className="opacity-30">/</span>
          <span className="text-zinc-300">Threat Scanner</span>
        </div>
        <Link
          href="/"
          className="text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-white transition-colors flex items-center gap-2 group"
        >
          <span className="group-hover:-translate-x-1 transition-transform inline-block">←</span>
          Public Home
        </Link>
      </nav>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 tracking-tight">Threat Scanner</h1>
        <p className="text-sm md:text-base text-zinc-400">
          Analyze URLs, domains, and suspicious text through our AI-powered intelligence engine. Results appear live as analysis progresses.
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
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
              </div>
              <div className="flex-1">
                <h4 className="text-red-400 font-bold mb-1">Scan Initiation Failed</h4>
                <p className="text-red-200/80 text-sm leading-relaxed">{error}</p>
                {input && (
                  <button
                    onClick={() => handleScan(input)}
                    className="mt-4 text-xs font-bold text-red-400 uppercase tracking-widest hover:text-red-300 transition-colors"
                  >
                    Retry Scan →
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Initiating Scan State */}
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
                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                className="absolute left-0 right-0 h-40 bg-gradient-to-b from-transparent via-purple-500/10 to-transparent pointer-events-none"
              />

              <div className="relative z-10 flex flex-col items-center justify-center text-center py-10">
                <div className="relative mb-8">
                  <div className="absolute inset-0 bg-purple-500/20 blur-3xl rounded-full" />
                  <LoadingSpinner size="lg" className="relative text-purple-400" />
                </div>

                <h3 className="text-xl font-bold text-white mb-2 tracking-wide">
                  Scan Engine Initializing
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
                        scale: loadingPhase === i ? 1.2 : 1,
                      }}
                      className="w-2 h-2 rounded-full bg-purple-500"
                    />
                  ))}
                </div>

                <p className="text-[11px] text-zinc-600 mt-6 font-mono tracking-wider">
                  You will be redirected to live results...
                </p>
              </div>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Info Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <GlassCard className="border-blue-500/10">
          <div className="flex items-start gap-3">
            <span className="text-2xl">🚀</span>
            <div>
              <h4 className="font-bold text-white text-sm mb-1">Instant Results</h4>
              <p className="text-xs text-zinc-400">
                See scan progress in real-time as each analysis stage completes
              </p>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="border-purple-500/10">
          <div className="flex items-start gap-3">
            <span className="text-2xl">🔍</span>
            <div>
              <h4 className="font-bold text-white text-sm mb-1">Deep Intelligence</h4>
              <p className="text-xs text-zinc-400">
                Multi-source threat intelligence and relationship graphing
              </p>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="border-green-500/10">
          <div className="flex items-start gap-3">
            <span className="text-2xl">🧠</span>
            <div>
              <h4 className="font-bold text-white text-sm mb-1">AI Analysis</h4>
              <p className="text-xs text-zinc-400">
                Advanced AI summarization and threat verdicts
              </p>
            </div>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
}
