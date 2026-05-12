'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-black via-purple-900/10 to-black">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-8 py-6 border-b border-zinc-800/50">
        <motion.h1 initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} className="text-2xl font-bold text-white flex items-center gap-2">
          <span className="text-2xl">🛡️</span>
          Hackura Sentinel AI
        </motion.h1>
        <div className="space-x-4 text-sm text-purple-300 font-medium">
          <Link href="#features" className="hover:text-purple-200 transition">Features</Link>
          <Link href="#security" className="hover:text-purple-200 transition">Security</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="px-6 py-32 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-6xl font-bold leading-tight mb-6 bg-gradient-to-r from-purple-200 via-white to-purple-300 bg-clip-text text-transparent">
            AI-Powered Trust Intelligence
          </h2>
          <p className="text-lg text-zinc-300 max-w-2xl mx-auto mb-12">
            Detect phishing, scams, malicious infrastructure, and misinformation using cutting-edge AI and graph intelligence powered by Neo4j.
          </p>

          <div className="flex justify-center gap-4 mb-16">
            <Link href="/dashboard">
              <Button variant="primary" size="lg">
                Launch Dashboard
              </Button>
            </Link>
            <Button variant="secondary" size="lg">
              Learn More
            </Button>
          </div>
        </motion.div>

        {/* Demo Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-4xl mx-auto bg-zinc-900/40 backdrop-blur-xl border border-zinc-700/50 rounded-2xl p-12"
        >
          <div className="bg-zinc-950/50 rounded-lg p-8 border border-zinc-800/50">
            <div className="space-y-4 text-left">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                <code className="text-sm text-zinc-400">Risk Assessment Engine</code>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-purple-500/50"></div>
                <code className="text-sm text-zinc-400">Graph Database Analysis</code>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
                <code className="text-sm text-zinc-400">Real-time Threat Intelligence</code>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section id="features" className="px-8 py-20 max-w-6xl mx-auto">
        <h3 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">Core Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
              <h4 className="font-semibold text-white mb-2">{feature.title}</h4>
              <p className="text-sm text-zinc-400">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-800/50 px-8 py-8 text-center text-zinc-500 text-sm">
        <p>Hackura Sentinel AI © 2026 | Advanced Threat Intelligence Platform</p>
      </footer>
    </main>
  );
}
