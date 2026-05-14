import { AlertTriangle, CheckCircle2, Info, Sparkles } from 'lucide-react';
import { ReactNode } from 'react';

const calloutStyles = {
  note: 'border-sky-500/20 bg-sky-500/10 text-sky-100',
  tip: 'border-emerald-500/20 bg-emerald-500/10 text-emerald-100',
  warning: 'border-amber-500/20 bg-amber-500/10 text-amber-100',
  danger: 'border-red-500/20 bg-red-500/10 text-red-100',
};

const calloutIcons = {
  note: Info,
  tip: Sparkles,
  warning: AlertTriangle,
  danger: CheckCircle2,
};

type CalloutVariant = keyof typeof calloutStyles;

export function DocsCallout({
  title,
  children,
  variant = 'note',
}: {
  title: string;
  children: ReactNode;
  variant?: CalloutVariant;
}) {
  const Icon = calloutIcons[variant];

  return (
    <div className={`rounded-2xl border p-4 md:p-5 shadow-lg shadow-black/20 ${calloutStyles[variant]}`}>
      <div className="mb-3 flex items-center gap-2 font-semibold text-sm uppercase tracking-[0.22em]">
        <Icon className="h-4 w-4" />
        <span>{title}</span>
      </div>
      <div className="space-y-2 text-sm leading-7 text-inherit">{children}</div>
    </div>
  );
}
