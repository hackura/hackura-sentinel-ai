'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui';
import Link from 'next/link';
import { PublicNavbar } from '@/components/public-navbar';
import { BrandLogo } from '@/components/brand-logo';

function GitHubIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
      <path
        fill="currentColor"
        d="M12 2C6.48 2 2 6.58 2 12.25c0 4.54 2.87 8.39 6.84 9.75.5.1.68-.22.68-.49 0-.24-.01-.87-.01-1.71-2.78.62-3.37-1.37-3.37-1.37-.46-1.2-1.12-1.52-1.12-1.52-.91-.64.07-.63.07-.63 1.01.07 1.55 1.06 1.55 1.06.9 1.57 2.36 1.12 2.94.86.09-.67.35-1.12.64-1.38-2.22-.26-4.56-1.13-4.56-5.03 0-1.11.38-2.02 1-2.73-.1-.26-.43-1.31.1-2.73 0 0 .82-.27 2.7 1.04a9.1 9.1 0 0 1 4.92 0c1.87-1.31 2.69-1.04 2.69-1.04.53 1.42.2 2.47.1 2.73.63.71 1 1.62 1 2.73 0 3.91-2.35 4.76-4.59 5.02.36.32.68.95.68 1.92 0 1.38-.01 2.49-.01 2.83 0 .27.18.6.69.49A10.24 10.24 0 0 0 22 12.25C22 6.58 17.52 2 12 2Z"
      />
    </svg>
  );
}

function MediumIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
      <path
        fill="currentColor"
        d="M4.5 6.2c0-.3-.1-.6-.3-.8L2.4 3.1V2.8h6.4l4.9 10.7 4.3-10.7H24v.3l-1.4 1.3c-.1.1-.2.3-.2.5v12.3c0 .2.1.4.2.5l1.3 1.3v.3h-7.1v-.3l1.4-1.4c.1-.1.1-.2.1-.4v-10l-4.9 12.2h-.7L9.1 7.2v8.2c0 .2.1.5.2.6l1.8 2.2v.3H4.5v-.3l1.8-2.2c.1-.1.2-.4.2-.6V6.2Z"
      />
    </svg>
  );
}

export default function HomePageClient({ structuredData }: { structuredData: object }) {
  return (
    <main className="min-h-screen bg-gradient-to-br from-black via-purple-900/10 to-black">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* Navigation */}
      <PublicNavbar />

      {/* Hero Section */}
      <section className="px-6 py-20 md:py-32 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6 bg-gradient-to-r from-purple-200 via-white to-purple-300 bg-clip-text text-transparent tracking-tight px-2">
            AI-Powered Trust Intelligence
          </h1>
          <p className="text-base md:text-lg text-zinc-300 max-w-2xl mx-auto mb-10 px-4">
            Detect phishing, scams, malicious infrastructure, and misinformation using cutting-edge AI and graph intelligence powered by Neo4j.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16 px-6">
            <Link href="/auth/login" className="w-full sm:w-auto">
              <Button variant="primary" size="lg" className="w-full">
                Launch Dashboard
              </Button>
            </Link>
            <Link href="/docs" className="w-full sm:w-auto">
              <Button variant="secondary" size="lg" className="w-full">
                Documentation
              </Button>
            </Link>
            <Link href="/docs/cli" className="w-full sm:w-auto">
              <Button variant="secondary" size="lg" className="w-full">
                Try the CLI
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Demo Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-4xl mx-auto bg-zinc-900/40 backdrop-blur-xl border border-zinc-700/50 rounded-2xl p-6 md:p-12"
        >
          <div className="bg-zinc-950/50 rounded-lg p-6 md:p-8 border border-zinc-800/50">
            <div className="space-y-4 text-left">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-red-500/50 flex-shrink-0"></div>
                <code className="text-xs md:text-sm text-zinc-400">Risk Assessment Engine</code>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-purple-500/50 flex-shrink-0"></div>
                <code className="text-xs md:text-sm text-zinc-400">Graph Database Analysis</code>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-green-500/50 flex-shrink-0"></div>
                <code className="text-xs md:text-sm text-zinc-400">Real-time Threat Intelligence</code>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section id="features" className="px-6 py-20 max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">Core Features</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {[
            { icon: '🔍', title: 'URL Scanning', desc: 'Analyze URLs, domains, and text for threats' },
            { icon: '🕸️', title: 'Graph Explorer', desc: 'Visualize relationships in threat networks' },
            { icon: '📊', title: 'Risk Dashboard', desc: 'Monitor threat trends and alerts in real-time' },
            { icon: '🧠', title: 'AI Analysis', desc: 'Powered by advanced machine learning models' },
            { icon: '📜', title: 'Scan History', desc: 'Track and review all previous analyses' },
            { icon: '🛡️', title: 'Enterprise Grade', desc: 'Built for security teams at scale' },
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-zinc-900/40 backdrop-blur-xl border border-zinc-700/50 rounded-xl p-6 hover:border-purple-500/50 transition"
            >
              <p className="text-3xl mb-3">{feature.icon}</p>
              <h3 className="font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-sm text-zinc-400">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-800/50 bg-black/70 px-8 py-12 text-sm text-zinc-400">
        <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-4">
          <div className="space-y-4 md:col-span-1">
            <BrandLogo size="sm" />
            <p className="max-w-sm text-zinc-400">
              Security intelligence for teams that need clear risk signals, graph context, and accountable review paths.
            </p>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-[0.22em] text-zinc-200">Product</h4>
            <ul className="space-y-3">
              <li><Link href="/auth/login" className="hover:text-white transition">Log in</Link></li>
              <li><Link href="/auth/signup" className="hover:text-white transition">Create account</Link></li>
              <li><Link href="/security" className="hover:text-white transition">Security</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-[0.22em] text-zinc-200">Legal</h4>
            <ul className="space-y-3">
              <li><Link href="/terms" className="hover:text-white transition">Terms & Conditions</Link></li>
              <li><Link href="/privacy" className="hover:text-white transition">Privacy Policy</Link></li>
              <li><Link href="/docs/api" className="hover:text-white transition">API Docs</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-[0.22em] text-zinc-200">Social</h4>
            <a
              href="https://medium.com/@hackuralabs"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-zinc-700/70 bg-zinc-900/50 px-4 py-2 text-zinc-200 hover:border-zinc-500 hover:text-white transition"
            >
              <MediumIcon />
              Medium
            </a>
          </div>
        </div>

        <div className="mx-auto mt-10 flex max-w-6xl flex-col gap-4 border-t border-zinc-800/60 pt-6 text-zinc-500 md:flex-row md:items-center md:justify-between">
          <p>Hackura Sentinel AI © 2026 | Advanced Threat Intelligence Platform</p>
          <p className="text-zinc-600">Built for security teams, reviewers, and operators.</p>
        </div>
      </footer>
    </main>
  );
}