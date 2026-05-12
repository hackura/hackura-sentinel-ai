'use client';

import { PublicNavbar } from '@/components/public-navbar';
import { motion } from 'framer-motion';

export default function ApiDocsPage() {
  return (
    <main className="min-h-screen bg-black text-zinc-300 pb-20">
      <PublicNavbar showHomeButton />
      
      <div className="max-w-5xl mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <header className="mb-12">
            <p className="text-purple-400 font-mono text-sm uppercase tracking-widest mb-2">Documentation</p>
            <h1 className="text-5xl font-bold text-white tracking-tight mb-4">API Reference</h1>
            <p className="text-xl text-zinc-400 max-w-3xl">
              Integrate Hackura's AI-powered threat intelligence directly into your workflows. Our REST API provides real-time access to URL scanning, graph networks, and risk assessments.
            </p>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-16">
              {/* Authentication */}
              <section id="authentication">
                <h2 className="text-2xl font-bold text-white mb-4">Authentication</h2>
                <p className="mb-4">
                  All API requests must include an API key in the <code>X-API-Key</code> header. You can generate and manage your API keys from the <a href="/dashboard/settings" className="text-purple-400 hover:underline">Settings</a> page.
                </p>
                <div className="bg-zinc-900 rounded-lg p-4 font-mono text-sm border border-zinc-800">
                  <span className="text-zinc-500"># Example Header</span><br />
                  <span className="text-purple-400">X-API-Key:</span> <span className="text-green-400">hk_live_xxxxxxxxxxxxxxxxxxxx</span>
                </div>
              </section>

              {/* Endpoints */}
              <section id="endpoints" className="space-y-12">
                <h2 className="text-2xl font-bold text-white mb-4">Endpoints</h2>
                
                {/* Scan URL */}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-zinc-200">Scan URL</h3>
                  <div className="flex items-center gap-3 font-mono text-sm">
                    <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded">POST</span>
                    <span className="text-zinc-300">/api/v1/scan</span>
                  </div>
                  <p>Analyze a URL for potential threats using our AI engine.</p>
                  <div className="bg-zinc-950 rounded-lg p-6 border border-zinc-800">
                    <h4 className="text-sm font-semibold text-zinc-400 mb-2 uppercase">Request Body</h4>
                    <pre className="text-sm text-purple-300">
{`{
  "url": "https://suspicious-site.com",
  "depth": "standard",
  "use_graph": true
}`}
                    </pre>
                  </div>
                </div>

                {/* Get Report */}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-zinc-200">Get Report</h3>
                  <div className="flex items-center gap-3 font-mono text-sm">
                    <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded">GET</span>
                    <span className="text-zinc-300">/api/v1/report/:scan_id</span>
                  </div>
                  <p>Retrieve the detailed results of a completed scan.</p>
                </div>
              </section>

              {/* Rate Limits */}
              <section id="rate-limits">
                <h2 className="text-2xl font-bold text-white mb-4">Rate Limits</h2>
                <p>
                  Rate limits vary based on your subscription plan. Standard API keys are limited to 100 requests per minute. Enterprise keys offer customized limits.
                </p>
              </section>
            </div>

            {/* Sidebar Navigation */}
            <aside className="hidden lg:block">
              <div className="sticky top-24 space-y-6">
                <div>
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">On this page</h4>
                  <ul className="space-y-3 text-sm">
                    <li><a href="#authentication" className="text-zinc-400 hover:text-purple-400 transition">Authentication</a></li>
                    <li><a href="#endpoints" className="text-zinc-400 hover:text-purple-400 transition">Endpoints</a></li>
                    <li><a href="#rate-limits" className="text-zinc-400 hover:text-purple-400 transition">Rate Limits</a></li>
                  </ul>
                </div>
                <div className="p-4 rounded-xl bg-purple-500/5 border border-purple-500/10">
                  <h4 className="text-sm font-bold text-purple-300 mb-2">Need help?</h4>
                  <p className="text-xs text-zinc-500 mb-4">Our support team is available 24/7 for technical assistance.</p>
                  <button className="text-xs font-semibold text-purple-400 hover:text-purple-300">Contact Support →</button>
                </div>
              </div>
            </aside>
          </div>
        </motion.div>
      </div>
    </main>
  );
}