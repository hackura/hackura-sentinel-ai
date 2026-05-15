'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { AlertTriangle, ArrowLeft, RotateCcw } from 'lucide-react';

import { buildCliLoginUrl, getCliFailureMessage, isValidDeviceId } from '@/lib/cli-auth';

type CliErrorPageProps = {
  deviceId?: string;
  reason?: string | string[];
};

export function CliErrorPage({ deviceId, reason }: CliErrorPageProps) {
  const retryHref = deviceId && isValidDeviceId(deviceId) ? buildCliLoginUrl(deviceId) : '/auth/login';

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#020205] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(239,68,68,0.18),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.08),transparent_24%),linear-gradient(180deg,#020205_0%,#120407_48%,#020205_100%)]" />
      <div className="absolute inset-0 opacity-[0.14] [background-image:linear-gradient(rgba(255,255,255,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.07)_1px,transparent_1px)] [background-size:72px_72px] [mask-image:radial-gradient(circle_at_center,black,transparent_85%)]" />

      <div className="relative flex min-h-screen items-center justify-center px-4 py-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 14 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-xl rounded-[1.75rem] border border-white/10 bg-white/5 p-8 text-center shadow-[0_24px_90px_rgba(0,0,0,0.55)] backdrop-blur-2xl"
        >
          <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full border border-red-400/20 bg-red-400/10">
            <motion.div
              animate={{ scale: [1, 1.04, 1], opacity: [0.75, 1, 0.75] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute h-24 w-24 rounded-full bg-red-400/10 blur-2xl"
            />
            <AlertTriangle className="relative h-14 w-14 text-red-300" />
          </div>

          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.36em] text-red-300/80">
            Authentication Failed
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Your CLI authentication session is invalid or expired.
          </h1>
          <p className="mt-4 text-sm leading-6 text-zinc-300 sm:text-base">
            {getCliFailureMessage(reason)}
          </p>

          {deviceId ? (
            <div className="mt-6 rounded-2xl border border-white/8 bg-black/25 px-4 py-3 text-left font-mono text-xs text-zinc-300">
              device_id: {deviceId}
            </div>
          ) : null}

          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              href={retryHref}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-fuchsia-500 to-violet-500 px-5 py-3 text-sm font-medium text-white shadow-[0_0_0_1px_rgba(217,70,239,0.28),0_16px_40px_rgba(168,85,247,0.25)] transition hover:-translate-y-0.5"
            >
              <RotateCcw className="h-4 w-4" />
              Retry Login
            </Link>
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-black/20 px-5 py-3 text-sm font-medium text-zinc-200 transition hover:border-white/20 hover:bg-white/10"
            >
              <ArrowLeft className="h-4 w-4" />
              Return Home
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}