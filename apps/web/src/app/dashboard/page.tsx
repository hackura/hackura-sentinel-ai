'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { OverviewCard, ScanCard, SimpleRiskChart } from '@/components/dashboard';
import { GlassCard } from '@/components/ui';
import { ScanResult } from '@/types';

// Mock data for demo
const mockScans: ScanResult[] = [
  {
    id: '1',
    url: 'https://secure-payment-update.com',
    risk_score: 87,
    risk_level: 'HIGH',
    ai_explanation: 'Domain impersonation detected. Similarity to legitimate payment gateway exceeds 95%.',
    risk_signals: ['Domain Spoofing', 'SSL Certificate Mismatch', 'Phishing Template Match'],
    confidence_score: 0.94,
    created_at: new Date().toISOString(),
  },
  {
    id: '2',
    url: 'https://github.com/torvalds/linux',
    risk_score: 8,
    risk_level: 'LOW',
    ai_explanation: 'Legitimate repository. No threats detected.',
    risk_signals: [],
    confidence_score: 0.99,
    created_at: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: '3',
    url: 'suspicious-crypto-airdrop.net',
    risk_score: 92,
    risk_level: 'HIGH',
    ai_explanation: 'Classic crypto scam indicators. Unsolicited token distribution promises.',
    risk_signals: ['Scam Pattern', 'Wallet Draining Scheme', 'False Promise'],
    confidence_score: 0.97,
    created_at: new Date(Date.now() - 172800000).toISOString(),
  },
];

export default function DashboardPage() {
  const [recentScans, setRecentScans] = useState<ScanResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setRecentScans(mockScans.slice(0, 5));
      setLoading(false);
    }, 500);
  }, []);

  const riskDistribution = [
    { label: 'High Risk', value: 12, color: '#dc2626' },
    { label: 'Medium Risk', value: 28, color: '#eab308' },
    { label: 'Low Risk', value: 156, color: '#16a34a' },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Header */}
      <motion.div variants={itemVariants}>
        <h1 className="text-4xl font-bold text-white mb-2">Security Dashboard</h1>
        <p className="text-zinc-400">Real-time threat monitoring and analysis</p>
      </motion.div>

      {/* Overview Cards */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 md:grid-cols-4 gap-4"
      >
        <OverviewCard
          title="Total Scans"
          value="1,247"
          icon="🔍"
          trend={{ value: 24, isPositive: true }}
        />
        <OverviewCard
          title="Risk Alerts"
          value="42"
          icon="⚠️"
          trend={{ value: 8, isPositive: false }}
        />
        <OverviewCard
          title="Malicious URLs"
          value="340"
          icon="🚫"
          trend={{ value: 12, isPositive: false }}
        />
        <OverviewCard
          title="Safe Browsing"
          value="865"
          icon="✓"
          trend={{ value: 16, isPositive: true }}
        />
      </motion.div>

      {/* Charts and Analytics */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <SimpleRiskChart data={riskDistribution} />
        </div>

        <GlassCard>
          <h3 className="text-lg font-semibold text-white mb-6">Quick Stats</h3>
          <div className="space-y-4">
            <div>
              <p className="text-zinc-400 text-sm mb-1">Detection Accuracy</p>
              <p className="text-2xl font-bold text-purple-400">98.7%</p>
            </div>
            <div>
              <p className="text-zinc-400 text-sm mb-1">Avg. Response Time</p>
              <p className="text-2xl font-bold text-green-400">0.24s</p>
            </div>
            <div>
              <p className="text-zinc-400 text-sm mb-1">Active Threats</p>
              <p className="text-2xl font-bold text-red-400">12</p>
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* Recent Scans */}
      <motion.div variants={itemVariants}>
        <h2 className="text-2xl font-semibold text-white mb-4">Recent Scans</h2>
        {loading ? (
          <GlassCard className="h-32 flex items-center justify-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-8 h-8 border-2 border-purple-500/30 border-t-purple-500 rounded-full"
            />
          </GlassCard>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recentScans.map((scan, i) => (
              <motion.div
                key={scan.id}
                variants={itemVariants}
                transition={{ delay: i * 0.05 }}
              >
                <ScanCard scan={scan} onClick={() => window.location.href = `/scan?id=${scan.id}`} />
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
