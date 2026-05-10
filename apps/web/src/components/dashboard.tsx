'use client';

import { motion } from 'framer-motion';
import { GlassCard, RiskBadge } from './ui';
import { ScanResult } from '@/types';

interface OverviewCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: { value: number; isPositive: boolean };
  className?: string;
}

export function OverviewCard({ title, value, icon, trend, className = '' }: OverviewCardProps) {
  return (
    <GlassCard className={`flex items-center justify-between ${className}`}>
      <div>
        <p className="text-zinc-400 text-sm mb-2">{title}</p>
        <p className="text-3xl font-bold text-white">{value}</p>
        {trend && (
          <p className={`text-xs mt-2 ${trend.isPositive ? 'text-green-400' : 'text-red-400'}`}>
            {trend.isPositive ? '↑' : '↓'} {trend.value}% this month
          </p>
        )}
      </div>
      <div className="text-purple-400 text-3xl opacity-50">{icon}</div>
    </GlassCard>
  );
}

interface ScanCardProps {
  scan: ScanResult;
  onClick?: () => void;
}

export function ScanCard({ scan, onClick }: ScanCardProps) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      onClick={onClick}
      className="cursor-pointer"
    >
      <GlassCard className="hover:border-purple-500/50">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <p className="text-zinc-300 text-sm truncate">{scan.url}</p>
            <p className="text-zinc-500 text-xs mt-1">
              {new Date(scan.created_at).toLocaleDateString()}
            </p>
          </div>
          <RiskBadge level={scan.risk_level} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-zinc-400 text-xs mb-1">Risk Score</p>
            <p className="text-2xl font-bold text-white">{scan.risk_score}</p>
          </div>
          <div>
            <p className="text-zinc-400 text-xs mb-1">Confidence</p>
            <p className="text-2xl font-bold text-purple-400">{Math.round(scan.confidence_score)}%</p>
          </div>
        </div>

        {scan.risk_signals && scan.risk_signals.length > 0 && (
          <div className="mt-4 pt-4 border-t border-zinc-700/50">
            <p className="text-zinc-400 text-xs mb-2">Risk Signals</p>
            <div className="flex flex-wrap gap-2">
              {scan.risk_signals.slice(0, 3).map((signal, i) => (
                <span key={i} className="text-xs bg-red-900/30 text-red-300 px-2 py-1 rounded">
                  {signal}
                </span>
              ))}
              {scan.risk_signals.length > 3 && (
                <span className="text-xs text-zinc-400">+{scan.risk_signals.length - 3} more</span>
              )}
            </div>
          </div>
        )}
      </GlassCard>
    </motion.div>
  );
}

interface RiskChartProps {
  data: { label: string; value: number; color: string }[];
}

export function SimpleRiskChart({ data }: RiskChartProps) {
  const maxValue = Math.max(...data.map(d => d.value));

  return (
    <GlassCard>
      <h3 className="text-lg font-semibold text-white mb-6">Risk Distribution</h3>
      <div className="space-y-4">
        {data.map((item, i) => (
          <div key={i}>
            <div className="flex justify-between mb-2">
              <span className="text-sm text-zinc-300">{item.label}</span>
              <span className="text-sm font-semibold" style={{ color: item.color }}>
                {item.value}
              </span>
            </div>
            <div className="w-full bg-zinc-800/50 rounded-full h-2 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(item.value / maxValue) * 100}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="h-full rounded-full"
                style={{ backgroundColor: item.color }}
              />
            </div>
          </div>
        ))}
      </div>
    </GlassCard>
  );
}

interface ScanInputProps {
  onSubmit: (input: string) => void;
  loading?: boolean;
  placeholder?: string;
}

export function ScanInput({ onSubmit, loading = false, placeholder = 'Enter URL, domain, or text...' }: ScanInputProps) {
  const [input, setInput] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onSubmit(input);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-3">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={placeholder}
        disabled={loading}
        className="flex-1 bg-zinc-900/50 border border-zinc-700 rounded-lg px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20 transition-all disabled:opacity-50"
      />
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        type="submit"
        disabled={loading}
        className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg font-medium transition-all disabled:opacity-50"
      >
        {loading ? 'Scanning...' : 'Scan'}
      </motion.button>
    </form>
  );
}

import React from 'react';
