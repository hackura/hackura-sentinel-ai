'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, FolderOpen, BookOpen, Shield, TerminalSquare, TriangleRight } from 'lucide-react';
import { DOC_NAV } from '@/content/docs/navigation';

const GROUP_ICONS = [BookOpen, Shield, TerminalSquare, FolderOpen];

export function DocsSidebar({
  collapsed,
  mobileOpen,
  onClose,
  onToggleCollapsed,
}: {
  collapsed: boolean;
  mobileOpen: boolean;
  onClose: () => void;
  onToggleCollapsed: () => void;
}) {
  const pathname = usePathname();

  const sidebarContent = (
    <div className="flex h-full flex-col border-r border-zinc-800/60 bg-black/70 backdrop-blur-xl">
      <div className="flex items-center justify-between border-b border-zinc-800/60 px-4 py-4">
        {!collapsed && <div className="text-xs font-semibold uppercase tracking-[0.3em] text-zinc-500">Navigation</div>}
        <button
          onClick={onToggleCollapsed}
          className="rounded-full border border-zinc-800 p-2 text-zinc-500 transition hover:border-purple-500/40 hover:text-white"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <ChevronDown className={`h-4 w-4 transition-transform ${collapsed ? '-rotate-90' : 'rotate-0'}`} />
        </button>
      </div>

      <div className="flex-1 space-y-6 overflow-y-auto px-3 py-4">
        {DOC_NAV.map((group, groupIndex) => {
          const GroupIcon = GROUP_ICONS[groupIndex % GROUP_ICONS.length];
          return (
            <div key={group.title} className="space-y-2">
              <div className={`flex items-center gap-2 px-2 text-[10px] font-semibold uppercase tracking-[0.28em] text-zinc-500 ${collapsed ? 'justify-center' : ''}`}>
                <GroupIcon className="h-3.5 w-3.5 text-purple-400/70" />
                {!collapsed && <span>{group.title}</span>}
              </div>
              <div className="space-y-1">
                {group.items.map((item) => {
                  const active = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`group flex items-center gap-3 rounded-xl border px-3 py-3 text-sm transition ${
                        active
                          ? 'border-purple-500/40 bg-purple-500/10 text-white shadow-[0_0_20px_rgba(168,85,247,0.08)]'
                          : 'border-transparent text-zinc-400 hover:border-zinc-800 hover:bg-zinc-900/50 hover:text-white'
                      } ${collapsed ? 'justify-center px-2' : ''}`}
                      onClick={mobileOpen ? onClose : undefined}
                    >
                      <TriangleRight className={`h-3.5 w-3.5 shrink-0 transition ${active ? 'text-purple-400' : 'text-zinc-600 group-hover:text-purple-400'}`} />
                      {!collapsed && (
                        <div className="min-w-0">
                          <div className="truncate font-medium">{item.title}</div>
                          <div className="truncate text-[11px] text-zinc-500">{item.summary}</div>
                        </div>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <>
      <div className="hidden xl:block xl:sticky xl:top-20 xl:h-[calc(100vh-5rem)] xl:shrink-0">
        <motion.div
          animate={{ width: collapsed ? 96 : 320 }}
          transition={{ type: 'spring', stiffness: 220, damping: 28 }}
          className="h-full overflow-hidden rounded-3xl border border-zinc-800/60 shadow-2xl shadow-black/30"
        >
          {sidebarContent}
        </motion.div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm xl:hidden"
          >
            <motion.div
              initial={{ x: -320 }}
              animate={{ x: 0 }}
              exit={{ x: -320 }}
              transition={{ type: 'spring', stiffness: 240, damping: 28 }}
              className="h-full w-[320px] max-w-[86vw]"
            >
              {sidebarContent}
            </motion.div>
            <button aria-label="Close navigation" className="absolute inset-0 -z-10" onClick={onClose} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
