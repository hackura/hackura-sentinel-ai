import { ReactNode } from 'react';
import { GlassCard } from '@/components/ui';

type TocItem = { id: string; label: string };

export function DocsPage({
  eyebrow,
  title,
  description,
  toc,
  children,
  hero,
  footer,
}: {
  eyebrow?: string;
  title: string;
  description: string;
  toc?: TocItem[];
  children: ReactNode;
  hero?: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_260px]">
      <div className="space-y-8">
        <div className="space-y-6">
          {eyebrow && <p className="text-[10px] font-semibold uppercase tracking-[0.34em] text-purple-400/80">{eyebrow}</p>}
          <div className="space-y-4">
            <h1 className="max-w-4xl text-4xl font-black tracking-tight text-white md:text-5xl">{title}</h1>
            <p className="max-w-3xl text-base leading-8 text-zinc-400 md:text-lg">{description}</p>
          </div>
          {hero && <div>{hero}</div>}
        </div>

        <GlassCard className="border-zinc-800/60 bg-zinc-950/60" hover={false}>
          <article className="docs-prose space-y-6 text-zinc-300">{children}</article>
        </GlassCard>

        {footer && <div>{footer}</div>}
      </div>

      <aside className="hidden xl:block">
        <div className="sticky top-24 space-y-4">
          <GlassCard className="border-zinc-800/60 bg-zinc-950/60" hover={false}>
            <div className="mb-3 text-[10px] font-semibold uppercase tracking-[0.32em] text-zinc-500">On this page</div>
            <nav className="space-y-2">
              {(toc || []).map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className="block rounded-lg px-2 py-1.5 text-sm text-zinc-400 transition hover:bg-zinc-900/70 hover:text-white"
                >
                  {item.label}
                </a>
              ))}
            </nav>
          </GlassCard>

          <GlassCard className="border-purple-500/10 bg-purple-500/5" hover={false}>
            <div className="text-sm font-semibold text-purple-200">Need a hand?</div>
            <p className="mt-2 text-sm leading-7 text-zinc-400">
              Hackura Sentinel AI docs are designed for operators and developers. Use search, code samples, and architecture diagrams to move quickly.
            </p>
          </GlassCard>
        </div>
      </aside>
    </div>
  );
}
