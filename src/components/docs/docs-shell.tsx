'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Menu, ExternalLink, LayoutDashboard, MoonStar } from 'lucide-react';
import { BrandLogo } from '@/components/brand-logo';
import { DocsSearch } from './docs-search';
import { DocsSidebar } from './docs-sidebar';

export function DocsShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [theme, setTheme] = useState<'midnight' | 'glow'>('midnight');

  useEffect(() => {
    const storedTheme = window.localStorage.getItem('docs-theme');
    if (storedTheme === 'glow' || storedTheme === 'midnight') {
      setTheme(storedTheme);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem('docs-theme', theme);
  }, [theme]);

  const shellClassName = useMemo(
    () =>
      theme === 'glow'
        ? 'bg-[radial-gradient(circle_at_top,rgba(168,85,247,0.12),transparent_30%),linear-gradient(180deg,#020202_0%,#050816_100%)]'
        : 'bg-[linear-gradient(180deg,#000_0%,#020617_100%)]',
    [theme],
  );

  return (
    <div className={`relative min-h-screen overflow-hidden text-zinc-200 ${shellClassName}`}>
      <div className="pointer-events-none absolute inset-0 opacity-35 [background-image:linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] [background-size:48px_48px]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(168,85,247,0.08),transparent_30%),radial-gradient(circle_at_top_right,rgba(34,211,238,0.05),transparent_25%)]" />

      <header className="sticky top-0 z-40 border-b border-zinc-800/60 bg-black/70 backdrop-blur-2xl">
        <div className="mx-auto flex h-20 max-w-[1600px] items-center gap-4 px-4 md:px-6">
          <button
            className="inline-flex items-center justify-center rounded-xl border border-zinc-800 p-2 text-zinc-400 transition hover:border-purple-500/40 hover:text-white xl:hidden"
            onClick={() => setMobileOpen(true)}
            aria-label="Open docs navigation"
          >
            <Menu className="h-5 w-5" />
          </button>

          <Link href="/" className="flex items-center gap-3">
            <BrandLogo size="sm" className="gap-2" textClassName="text-sm" subtitle={false} />
          </Link>

          <div className="hidden border-l border-zinc-800 pl-4 text-[10px] font-semibold uppercase tracking-[0.34em] text-zinc-500 md:block">
            Documentation
          </div>

          <div className="flex-1 px-2 md:px-4">
            <DocsSearch />
          </div>

          <div className="hidden items-center gap-2 xl:flex">
            <Link
              href="https://github.com/hackura"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-950/80 px-4 py-2 text-sm text-zinc-300 transition hover:border-purple-500/40 hover:text-white"
            >
              <ExternalLink className="h-4 w-4" />
              GitHub
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 rounded-full border border-purple-500/20 bg-purple-500/10 px-4 py-2 text-sm text-purple-100 transition hover:border-purple-500/40 hover:bg-purple-500/20"
            >
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </Link>
            <button
              onClick={() => setTheme((current) => (current === 'midnight' ? 'glow' : 'midnight'))}
              className="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-950/80 px-4 py-2 text-sm text-zinc-300 transition hover:border-purple-500/40 hover:text-white"
            >
              <MoonStar className="h-4 w-4" />
              {theme === 'midnight' ? 'Midnight' : 'Glow'}
            </button>
          </div>

          <div className="flex items-center gap-2 xl:hidden">
            <button
              onClick={() => setTheme((current) => (current === 'midnight' ? 'glow' : 'midnight'))}
              className="inline-flex items-center justify-center rounded-xl border border-zinc-800 p-2 text-zinc-400 transition hover:border-purple-500/40 hover:text-white"
              aria-label="Toggle docs theme"
            >
              <MoonStar className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      <div className="relative mx-auto flex max-w-[1600px] gap-6 px-4 py-6 md:px-6 lg:py-8">
        <DocsSidebar
          collapsed={collapsed}
          mobileOpen={mobileOpen}
          onClose={() => setMobileOpen(false)}
          onToggleCollapsed={() => setCollapsed((value) => !value)}
        />

        <motion.main
          key={pathname}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="min-w-0 flex-1"
        >
          <div className="space-y-6">{children}</div>
        </motion.main>
      </div>
    </div>
  );
}
