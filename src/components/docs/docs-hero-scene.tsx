'use client';

import { motion } from 'framer-motion';
import { GlassCard } from '@/components/ui';

const nodes = [
  { left: '12%', top: '18%', delay: 0 },
  { left: '28%', top: '36%', delay: 0.4 },
  { left: '54%', top: '24%', delay: 0.8 },
  { left: '72%', top: '48%', delay: 1.2 },
  { left: '84%', top: '28%', delay: 1.6 },
];

export function DocsHeroScene() {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-zinc-800/60 bg-black/50 p-4 md:p-6">
      <div className="pointer-events-none absolute inset-0 opacity-60 [background-image:linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] [background-size:40px_40px]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(168,85,247,0.12),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(34,211,238,0.08),transparent_35%)]" />

      {nodes.map((node) => (
        <motion.span
          key={`${node.left}-${node.top}`}
          className="absolute h-3 w-3 rounded-full border border-purple-300/40 bg-purple-400/20 shadow-[0_0_24px_rgba(168,85,247,0.35)]"
          style={{ left: node.left, top: node.top }}
          animate={{ y: [0, -10, 0], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 4, repeat: Infinity, delay: node.delay }}
        />
      ))}

      <div className="relative grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
        <GlassCard className="border-zinc-800/60 bg-zinc-950/70" hover={false}>
          <div className="space-y-3">
            <div className="inline-flex rounded-full border border-purple-500/20 bg-purple-500/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-purple-200">
              Live Intelligence Pipeline
            </div>
            <div className="text-sm leading-7 text-zinc-300">
              Scan orchestration, graph intelligence, risk scoring, and secure API delivery operate as one system.
            </div>
            <div className="grid gap-3 pt-2 text-sm md:grid-cols-2">
              {[
                ['Threats detected', '147'],
                ['Confidence average', '96.2%'],
                ['Graph nodes', '2.4k'],
                ['API latency', '24ms'],
              ].map(([label, value]) => (
                <div key={label} className="rounded-2xl border border-zinc-800/70 bg-black/40 p-3">
                  <div className="text-[10px] uppercase tracking-[0.28em] text-zinc-500">{label}</div>
                  <div className="mt-2 text-xl font-bold text-white">{value}</div>
                </div>
              ))}
            </div>
          </div>
        </GlassCard>

        <GlassCard className="border-purple-500/10 bg-purple-500/5" hover={false}>
          <div className="space-y-4">
            <div className="text-[10px] font-semibold uppercase tracking-[0.32em] text-purple-200/80">Architecture Preview</div>
            {['Frontend', 'API Layer', 'Recon Engine', 'Threat Intelligence', 'Graph Intelligence', 'AuraDB / Neo4j'].map((label, index) => (
              <div key={label} className="flex items-center gap-3">
                <div className="h-2.5 w-2.5 rounded-full bg-purple-400 shadow-[0_0_14px_rgba(168,85,247,0.45)]" />
                <div className="text-sm text-zinc-300">{label}</div>
                {index < 5 && <div className="flex-1 border-b border-dashed border-zinc-800/80" />}
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
