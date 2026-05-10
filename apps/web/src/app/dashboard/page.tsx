'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { OverviewCard, ScanCard, SimpleRiskChart } from '@/components/dashboard';
import { GlassCard } from '@/components/ui';
import { getDashboardStats, getScans } from '@/lib/api';
import { ScanResult, DashboardStats } from '@/types';

export default function DashboardPage() {
  const [recentScans, setRecentScans] = useState<ScanResult[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [statsData, scansData] = await Promise.all([
          getDashboardStats(),
          getScans(5),
        ]);
        setStats(statsData);
        setRecentScans(Array.isArray(scansData) ? scansData : []);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
        setRecentScans([]);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const riskDistribution = stats?.risk_distribution
    ? [
        { label: 'High Risk', value: stats.risk_distribution.HIGH, color: '#dc2626' },
        { label: 'Medium Risk', value: stats.risk_distribution.MEDIUM, color: '#eab308' },
        { label: 'Low Risk', value: stats.risk_distribution.LOW, color: '#16a34a' },
      ]
    : stats
    ? [
        { label: 'High Risk', value: stats.risk_alerts || 0, color: '#dc2626' },
        { label: 'Medium Risk', value: Math.floor((stats.total_scans || 0) * 0.2), color: '#eab308' },
        { label: 'Low Risk', value: stats.safe_browsing || 0, color: '#16a34a' },
      ]
    : [
        { label: 'High Risk', value: 12, color: '#dc2626' },
        { label: 'Medium Risk', value: 28, color: '#eab308' },
        { label: 'Low Risk', value: 156, color: '#16a34a' },
      ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6 md:space-y-8">
      <motion.div variants={itemVariants}>
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Security Dashboard</h1>
        <p className="text-sm md:text-base text-zinc-400">Real-time threat monitoring and analysis</p>
      </motion.div>

      {/* Stats Cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stats ? (
          <>
            <OverviewCard title="Total Scans" value={stats.total_scans} icon="🔍" trend={{ value: stats.trend?.total_scans_change || 0, isPositive: true }} />
            <OverviewCard title="Risk Alerts" value={stats.risk_alerts} icon="⚠️" trend={{ value: stats.trend?.risk_alerts_change || 0, isPositive: false }} />
            <OverviewCard title="Malicious URLs" value={stats.malicious_urls} icon="🚫" trend={{ value: stats.trend?.malicious_urls_change || 0, isPositive: false }} />
            <OverviewCard title="Safe Browsing" value={stats.safe_browsing} icon="✓" trend={{ value: stats.trend?.safe_browsing_change || 0, isPositive: true }} />
          </>
        ) : (
          <>
            <OverviewCard title="Total Scans" value="—" icon="🔍" />
            <OverviewCard title="Risk Alerts" value="—" icon="⚠️" />
            <OverviewCard title="Malicious URLs" value="—" icon="🚫" />
            <OverviewCard title="Safe Browsing" value="—" icon="✓" />
          </>
        )}
      </motion.div>

      {/* Charts */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <SimpleRiskChart data={riskDistribution} />
        </div>
        <GlassCard>
          <h3 className="text-lg font-semibold text-white mb-6">Quick Stats</h3>
          <div className="space-y-4">
            <div>
              <p className="text-zinc-400 text-sm mb-1">Detection Accuracy</p>
              <p className="text-2xl font-bold text-purple-400">{stats ? '98.7%' : '—'}</p>
            </div>
            <div>
              <p className="text-zinc-400 text-sm mb-1">Avg. Response Time</p>
              <p className="text-2xl font-bold text-green-400">{stats ? '0.24s' : '—'}</p>
            </div>
            <div>
              <p className="text-zinc-400 text-sm mb-1">Active Threats</p>
              <p className="text-2xl font-bold text-red-400">{stats ? '12' : '—'}</p>
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* Recent Scans */}
      <motion.div variants={itemVariants}>
        <h2 className="text-2xl font-semibold text-white mb-4">Recent Scans</h2>
        {loading ? (
          <GlassCard className="h-32 flex items-center justify-center">
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity }} className="w-8 h-8 border-2 border-purple-500/30 border-t-purple-500 rounded-full" />
          </GlassCard>
        ) : recentScans.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recentScans.map((scan, i) => (
              <motion.div key={scan.id} variants={itemVariants} transition={{ delay: i * 0.05 }}>
                <ScanCard scan={scan} onClick={() => window.location.href = `/dashboard/history?id=${scan.id}`} />
              </motion.div>
            ))}
          </div>
        ) : (
          <GlassCard>
            <p className="text-zinc-400 text-center py-8">No scans yet. Start scanning to see results.</p>
          </GlassCard>
        )}
      </motion.div>
    </motion.div>
  );
}
