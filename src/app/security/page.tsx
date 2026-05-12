'use client';

import { motion } from 'framer-motion';
import { PublicNavbar } from '@/components/public-navbar';

const sections = [
  {
    title: 'Authentication',
    body: 'We support GitHub OAuth and email/password sign-in, with authenticated actions scoped to the signed-in user.',
  },
  {
    title: 'Data Protection',
    body: 'Threat scans are stored with minimal user data. Sensitive keys stay server-side and are never exposed in the browser.',
  },
  {
    title: 'Threat Intelligence',
    body: 'Scan results may aggregate external sources and graph context to improve accuracy and analyst review.',
  },
  {
    title: 'Reporting & Review',
    body: 'We are building a structured reporting path for abuse, security, and policy issues so teams can respond quickly.',
  },
];

export default function SecurityPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-zinc-950 to-black text-white">
      <PublicNavbar showHomeButton />

      <section className="mx-auto max-w-6xl px-6 py-16 md:px-8 md:py-20">
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl">
          <p className="mb-4 text-sm uppercase tracking-[0.3em] text-cyan-300/80">Security</p>
          <h1 className="text-4xl font-bold tracking-tight md:text-6xl">Security and trust posture</h1>
          <p className="mt-6 max-w-2xl text-lg text-zinc-300">
            Hackura Sentinel AI is built for authenticated threat analysis, reviewable intelligence, and controlled access to sensitive system actions.
          </p>
        </motion.div>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {sections.map((section, index) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
              className="rounded-2xl border border-zinc-800/70 bg-zinc-900/40 p-6 backdrop-blur-xl"
            >
              <h2 className="text-xl font-semibold text-white">{section.title}</h2>
              <p className="mt-3 text-sm leading-6 text-zinc-300">{section.body}</p>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-6 text-zinc-200">
          <h2 className="text-xl font-semibold text-white">Responsible disclosure</h2>
          <p className="mt-3 text-sm leading-6 text-zinc-300">
            For now, direct security contact and disclosure instructions will live here until the dedicated policy workflow is published.
          </p>
        </div>
      </section>
    </main>
  );
}