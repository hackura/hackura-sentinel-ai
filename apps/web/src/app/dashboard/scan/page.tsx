'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ScanInput } from '@/components/dashboard';
import { GlassCard, RiskBadge, LoadingSpinner } from '@/components/ui';
import { performScan } from '@/lib/api';
import { ScanResult } from '@/types';

export default function ScanPage() {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleScan = async (scanInput: string) => {
    setLoading(true);
    setError(null);
    setInput(scanInput);

    try {
      // Mock delay for demo
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Simulate response
      const mockResult: ScanResult = {
        id: Date.now().toString(),
        url: scanInput,
        risk_score: Math.floor(Math.random() * 100),
        risk_level: Math.random() > 0.5 ? 'HIGH' : Math.random() > 0.5 ? 'MEDIUM' : 'LOW',
        ai_explanation: `This ${scanInput} has been analyzed using advanced threat detection algorithms. The analysis includes domain reputation, SSL certificate validation, content analysis, and comparison with known threat databases.`,
        risk_signals: [
          'Suspicious Domain Pattern',
          'Low Domain Age',
          'Phishing Template Match',
        ].slice(0, Math.floor(Math.random() * 4)),
        confidence_score: 0.85 + Math.random() * 0.15,
        created_at: new Date().toISOString(),
      };

      setResult(mockResult);
      // In production, call: const result = await performScan(scanInput);
    } catch (err) {
      setError('Failed to perform scan. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-4xl font-bold text-white mb-2">Threat Scanner</h1>
        <p className="text-zinc-400">Analyze URLs, domains, and text for security threats</p>
      </motion.div>

      {/* Scan Input */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <GlassCard>
          <ScanInput onSubmit={handleScan} loading={loading} />
        </GlassCard>
      </motion.div>

      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-900/20 border border-red-700/50 rounded-lg p-4"
        >
          <p className="text-red-300">{error}</p>
        </motion.div>
      )}

      {/* Loading State */}
      {loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center justify-center py-20"
        >
          <div className="text-center">
            <LoadingSpinner size="lg" />
            <p className="text-zinc-400 mt-4">Analyzing threat patterns...</p>
          </div>
        </motion.div>
      )}

      {/* Results */}
      {result && !loading && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Risk Score Overview */}
          <GlassCard>
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Scan Result</h3>
                <p className="text-zinc-400 text-sm break-all">{result.url}</p>
              </div>
              <RiskBadge level={result.risk_level} />
            </div>

            <div className="grid grid-cols-3 gap-6">
              {/* Risk Score */}
              <div>
                <p className="text-zinc-400 text-sm mb-3">Risk Score</p>
                <div className="relative w-32 h-32 mx-auto">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="8"
                      className="text-zinc-800"
                    />
                    <motion.circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="8"
                      strokeDasharray={`${(result.risk_score / 100) * 282.7} 282.7`}
                      className={
                        result.risk_level === 'HIGH'
                          ? 'text-red-500'
                          : result.risk_level === 'MEDIUM'
                          ? 'text-yellow-500'
                          : 'text-green-500'
                      }
                      initial={{ strokeDasharray: '0 282.7' }}
                      animate={{ strokeDasharray: `${(result.risk_score / 100) * 282.7} 282.7` }}
                      transition={{ duration: 1 }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-3xl font-bold text-white">{result.risk_score}</span>
                  </div>
                </div>
              </div>

              {/* Confidence Score */}
              <div>
                <p className="text-zinc-400 text-sm mb-3">Confidence</p>
                <p className="text-5xl font-bold text-purple-400 text-center">
                  {Math.round(result.confidence_score * 100)}%
                </p>
              </div>

              {/* Risk Level */}
              <div>
                <p className="text-zinc-400 text-sm mb-3">Classification</p>
                <div className="flex items-center justify-center h-full">
                  <RiskBadge level={result.risk_level} />
                </div>
              </div>
            </div>
          </GlassCard>

          {/* AI Explanation */}
          <GlassCard>
            <h3 className="text-lg font-semibold text-white mb-4">AI Analysis</h3>
            <p className="text-zinc-300 leading-relaxed">{result.ai_explanation}</p>
          </GlassCard>

          {/* Risk Signals */}
          {result.risk_signals && result.risk_signals.length > 0 && (
            <GlassCard>
              <h3 className="text-lg font-semibold text-white mb-4">Detected Risk Signals</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {result.risk_signals.map((signal, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-red-900/20 border border-red-700/50 rounded-lg p-4"
                  >
                    <p className="text-red-300 font-medium flex items-center gap-2">
                      <span className="text-lg">⚠️</span>
                      {signal}
                    </p>
                  </motion.div>
                ))}
              </div>
            </GlassCard>
          )}

          {/* Recommendations */}
          <GlassCard>
            <h3 className="text-lg font-semibold text-white mb-4">Recommendations</h3>
            <ul className="space-y-3">
              {result.risk_level === 'HIGH' && (
                <>
                  <li className="flex items-start gap-3">
                    <span className="text-red-400 mt-1">✗</span>
                    <span className="text-zinc-300">
                      <strong>Do not visit</strong> this website. It has been identified as a high-risk threat.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-red-400 mt-1">✗</span>
                    <span className="text-zinc-300">
                      <strong>Report</strong> this domain to your email provider or ISP.
                    </span>
                  </li>
                </>
              )}
              {result.risk_level === 'MEDIUM' && (
                <>
                  <li className="flex items-start gap-3">
                    <span className="text-yellow-400 mt-1">!</span>
                    <span className="text-zinc-300">
                      <strong>Exercise caution</strong> when visiting this site. Verify legitimacy before entering credentials.
                    </span>
                  </li>
                </>
              )}
              {result.risk_level === 'LOW' && (
                <>
                  <li className="flex items-start gap-3">
                    <span className="text-green-400 mt-1">✓</span>
                    <span className="text-zinc-300">
                      This resource appears to be <strong>safe to visit</strong>.
                    </span>
                  </li>
                </>
              )}
            </ul>
          </GlassCard>
        </motion.div>
      )}

      {/* Example Scans */}
      {!result && !loading && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <GlassCard>
            <h3 className="text-lg font-semibold text-white mb-4">Try Scanning</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {[
                'https://suspicious-crypto-airdrop.net',
                'secure-payment-update.com',
                'phishing-email-content',
              ].map((example, i) => (
                <motion.button
                  key={i}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => handleScan(example)}
                  className="text-left bg-zinc-800/50 hover:bg-zinc-700/50 border border-zinc-700 rounded-lg p-4 transition-all"
                >
                  <p className="text-zinc-400 text-xs mb-2">Example {i + 1}</p>
                  <p className="text-white text-sm truncate">{example}</p>
                </motion.button>
              ))}
            </div>
          </GlassCard>
        </motion.div>
      )}
    </div>
  );
}
