import { ArrowDown, Layers3, Radar, ServerCog, Shield, Workflow } from 'lucide-react';
import { GlassCard } from '@/components/ui';

const ARCH_STEPS = [
  { title: 'Frontend', description: 'App Router UI, docs portal, dashboard, and visualization surfaces.', icon: Layers3 },
  { title: 'API Layer', description: 'Public endpoints, request validation, and orchestration glue.', icon: ServerCog },
  { title: 'Recon Engine', description: 'URL, DNS, IP, redirect, and metadata collection pipeline.', icon: Radar },
  { title: 'Threat Intelligence', description: 'Enrichment, correlation, and confidence layering.', icon: Shield },
  { title: 'Graph Intelligence Engine', description: 'Node/edge inference, cluster discovery, and relationship scoring.', icon: Workflow },
  { title: 'AuraDB / Neo4j', description: 'Persistent graph storage and traversal for intelligence contexts.', icon: Layers3 },
];

export function ArchitectureFlow() {
  return (
    <div className="space-y-4">
      {ARCH_STEPS.map((step, index) => {
        const Icon = step.icon;
        return (
          <div key={step.title} className="space-y-4">
            <GlassCard className="border-zinc-800/60 bg-zinc-950/60" hover={false}>
              <div className="flex items-start gap-4">
                <div className="rounded-2xl border border-purple-500/20 bg-purple-500/10 p-3 text-purple-300">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-sm font-semibold uppercase tracking-[0.26em] text-white">{step.title}</div>
                  <p className="mt-2 text-sm leading-7 text-zinc-400">{step.description}</p>
                </div>
              </div>
            </GlassCard>
            {index < ARCH_STEPS.length - 1 && (
              <div className="flex justify-center text-purple-400/60">
                <ArrowDown className="h-5 w-5" />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
