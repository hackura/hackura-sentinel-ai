import { ReactNode, useState } from 'react';
import { GlassCard } from '@/components/ui';
import { Copy, Check } from 'lucide-react';

export function DocsTerminal({ title = 'Terminal Output', children }: { title?: string; children: ReactNode }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const textToCopy = typeof children === 'string' ? children : '';
    if (textToCopy) {
      navigator.clipboard.writeText(textToCopy.trim());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <GlassCard className="relative overflow-hidden border-zinc-800/60 bg-black/70 p-0" hover={false}>
      <div className="flex items-center justify-between border-b border-zinc-800/60 bg-zinc-950/70 px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-red-500/90" />
          <div className="h-3 w-3 rounded-full bg-amber-500/90" />
          <div className="h-3 w-3 rounded-full bg-emerald-500/90" />
          <div className="ml-3 text-[10px] uppercase tracking-[0.3em] text-zinc-500">{title}</div>
        </div>
        
        {typeof children === 'string' && (
          <button 
            onClick={handleCopy}
            className="group flex items-center gap-1.5 rounded-md border border-zinc-800/50 bg-zinc-900/50 px-2 py-1 text-[10px] font-medium text-zinc-400 hover:border-zinc-700 hover:text-white transition-all active:scale-95"
          >
            {copied ? (
              <>
                <Check className="h-3 w-3 text-emerald-400" />
                <span className="text-emerald-400">COPIED</span>
              </>
            ) : (
              <>
                <Copy className="h-3 w-3" />
                <span>COPY</span>
              </>
            )}
          </button>
        )}
      </div>
      <pre className="overflow-x-auto px-4 py-4 text-sm leading-7 text-emerald-300">
        <code>{children}</code>
      </pre>
    </GlassCard>
  );
}
