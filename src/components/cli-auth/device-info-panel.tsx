'use client';

import { motion } from 'framer-motion';
import { ShieldAlert, TimerReset, Terminal } from 'lucide-react';

import { maskDeviceId } from '@/lib/cli-auth';

type DeviceInfoPanelProps = {
  deviceId: string;
  isValid: boolean;
};

export function DeviceInfoPanel({ deviceId, isValid }: DeviceInfoPanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.08, duration: 0.35 }}
      className="mb-6 rounded-2xl border border-white/10 bg-zinc-950/55 p-4 shadow-inner shadow-black/30"
    >
      <div className="mb-3 flex items-center gap-2 text-sm font-medium text-zinc-200">
        <Terminal className="h-4 w-4 text-fuchsia-300" />
        Device Authorization Request
      </div>

      <div className="grid gap-3 sm:grid-cols-[1.2fr_0.8fr] sm:items-start">
        <div>
          <div className="text-xs uppercase tracking-[0.3em] text-zinc-500">Device ID</div>
          <div className="mt-1 rounded-xl border border-white/8 bg-black/30 px-3 py-2 font-mono text-sm text-zinc-100">
            {isValid ? maskDeviceId(deviceId) : 'Invalid or missing device_id'}
          </div>
        </div>

        <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-3 text-sm text-amber-100">
          <div className="mb-2 flex items-center gap-2 font-medium">
            <ShieldAlert className="h-4 w-4" />
            Security Notice
          </div>
          Only proceed if you initiated this login from the Hackura Sentinel AI CLI.
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-3 text-xs text-zinc-400">
        <span className="inline-flex items-center gap-2 rounded-full border border-fuchsia-500/20 bg-fuchsia-500/10 px-3 py-1 text-fuchsia-100">
          <TimerReset className="h-3.5 w-3.5" />
          Device sessions expire quickly
        </span>
        <span className="rounded-full border border-white/8 bg-white/5 px-3 py-1">
          JWT issuance stays in the backend
        </span>
      </div>
    </motion.div>
  );
}