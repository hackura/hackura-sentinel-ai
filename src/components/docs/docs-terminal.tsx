import { ReactNode } from 'react';
import { GlassCard } from '@/components/ui';

export function DocsTerminal({ title = 'Terminal Output', children }: { title?: string; children: ReactNode }) {
  return (
    <GlassCard className="overflow-hidden border-zinc-800/60 bg-black/70 p-0" hover={false}>
      <div className="flex items-center gap-2 border-b border-zinc-800/60 bg-zinc-950/70 px-4 py-3">
        <div className="h-3 w-3 rounded-full bg-red-500/90" />
        <div className="h-3 w-3 rounded-full bg-amber-500/90" />
        <div className="h-3 w-3 rounded-full bg-emerald-500/90" />
        <div className="ml-3 text-[10px] uppercase tracking-[0.3em] text-zinc-500">{title}</div>
      </div>
      <pre className="overflow-x-auto px-4 py-4 text-sm leading-7 text-emerald-300">
        <code>{children}</code>
      </pre>
    </GlassCard>
  );
}
