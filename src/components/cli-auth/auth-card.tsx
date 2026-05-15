'use client';

import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

type AuthCardProps = {
  title: string;
  subtitle: string;
  eyebrow?: string;
  children: ReactNode;
  footer?: ReactNode;
};

export function AuthCard({ title, subtitle, eyebrow, children, footer }: AuthCardProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 18, scale: 0.985 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      className="relative w-full max-w-2xl overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/5 shadow-[0_24px_90px_rgba(0,0,0,0.55)] backdrop-blur-2xl"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(168,85,247,0.22),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(34,197,94,0.12),transparent_28%),linear-gradient(180deg,rgba(255,255,255,0.06),transparent_30%)]" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-fuchsia-400/80 to-transparent" />
      <div className="relative p-6 sm:p-8">
        {eyebrow ? (
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.34em] text-fuchsia-300/80">{eyebrow}</p>
        ) : null}

        <div className="mb-6 space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">{title}</h1>
          <p className="max-w-xl text-sm leading-6 text-zinc-300 sm:text-base">{subtitle}</p>
        </div>

        {children}

        {footer ? <div className="mt-6 border-t border-white/8 pt-5">{footer}</div> : null}
      </div>
    </motion.section>
  );
}