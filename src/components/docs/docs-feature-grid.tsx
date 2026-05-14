import { ReactNode } from 'react';
import { GlassCard } from '@/components/ui';

export function DocsFeatureGrid({
  items,
}: {
  items: Array<{ title: string; description: string; icon: ReactNode }>;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => (
        <GlassCard key={item.title} className="border-zinc-800/60 bg-zinc-950/60" hover={false}>
          <div className="mb-4 inline-flex rounded-2xl border border-purple-500/15 bg-purple-500/10 p-3 text-purple-300">
            {item.icon}
          </div>
          <h3 className="text-base font-semibold text-white">{item.title}</h3>
          <p className="mt-2 text-sm leading-7 text-zinc-400">{item.description}</p>
        </GlassCard>
      ))}
    </div>
  );
}
