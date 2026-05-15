'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { CheckCircle2, X } from 'lucide-react';

export function CliSuccessPage() {
  useEffect(() => {
    const timer = window.setTimeout(() => {
      window.close();
    }, 8000);

    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#020205] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,197,94,0.18),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(16,185,129,0.12),transparent_24%),linear-gradient(180deg,#020205_0%,#04110a_48%,#020205_100%)]" />
      <div className="absolute inset-0 opacity-[0.14] [background-image:linear-gradient(rgba(255,255,255,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.07)_1px,transparent_1px)] [background-size:72px_72px] [mask-image:radial-gradient(circle_at_center,black,transparent_85%)]" />

      <div className="relative flex min-h-screen items-center justify-center px-4 py-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 14 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-xl rounded-[1.75rem] border border-white/10 bg-white/5 p-8 text-center shadow-[0_24px_90px_rgba(0,0,0,0.55)] backdrop-blur-2xl"
        >
          <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full border border-emerald-400/20 bg-emerald-400/10">
            <motion.div
              animate={{ scale: [1, 1.06, 1], opacity: [0.8, 1, 0.8] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute h-24 w-24 rounded-full bg-emerald-400/10 blur-2xl"
            />
            <CheckCircle2 className="relative h-14 w-14 text-emerald-300" />
          </div>

          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.36em] text-emerald-300/80">
            Authentication Successful
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            You can return to your terminal.
          </h1>
          <p className="mt-4 text-sm leading-6 text-zinc-300 sm:text-base">
            This tab can be closed. The CLI will receive the linked authorization in the background.
          </p>

          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/10 px-5 py-3 text-sm font-medium text-white transition hover:border-emerald-400/30 hover:bg-emerald-500/10"
            >
              Return Home
            </Link>
            <button
              type="button"
              onClick={() => window.close()}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-black/20 px-5 py-3 text-sm font-medium text-zinc-200 transition hover:border-white/20 hover:bg-white/10"
            >
              <X className="h-4 w-4" />
              Close Tab
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}