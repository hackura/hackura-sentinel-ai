'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Command } from 'lucide-react';
import { searchDocs } from '@/lib/docs/search';

export function DocsSearch({ className = '' }: { className?: string }) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const results = useMemo(() => searchDocs(query), [query]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        inputRef.current?.focus();
        setOpen(true);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  return (
    <div className={`relative w-full max-w-xl ${className}`}>
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
        <input
          ref={inputRef}
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder="Search docs..."
          className="w-full rounded-full border border-zinc-800 bg-zinc-950/80 py-2.5 pl-10 pr-16 text-sm text-white placeholder:text-zinc-600 outline-none transition focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20"
        />
        <div className="pointer-events-none absolute right-3 top-1/2 flex -translate-y-1/2 items-center gap-1 rounded-full border border-zinc-800 bg-zinc-900/70 px-2 py-1 text-[10px] uppercase tracking-[0.22em] text-zinc-500">
          <Command className="h-3 w-3" />
          K
        </div>
      </div>

      {open && query.trim() && (
        <div className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-50 overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950/95 shadow-2xl shadow-black/60 backdrop-blur-xl">
          <div className="max-h-80 overflow-auto p-2">
            {results.length > 0 ? (
              results.map((item) => (
                <button
                  key={item.href}
                  onClick={() => router.push(item.href)}
                  className="flex w-full flex-col items-start gap-1 rounded-xl px-3 py-3 text-left transition hover:bg-zinc-900/80"
                >
                  <span className="text-sm font-semibold text-white">{item.title}</span>
                  <span className="text-xs text-zinc-500">{item.description}</span>
                  <span className="text-[10px] uppercase tracking-[0.24em] text-purple-400/70">{item.section}</span>
                </button>
              ))
            ) : (
              <div className="px-3 py-6 text-sm text-zinc-500">No docs match “{query}”.</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
