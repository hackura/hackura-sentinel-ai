'use client';

type BrandLogoProps = {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
  textClassName?: string;
  subtitle?: boolean;
};

const sizeClasses = {
  sm: 'h-9 w-9',
  md: 'h-12 w-12',
  lg: 'h-16 w-16',
};

const textSizes = {
  sm: 'text-base',
  md: 'text-xl',
  lg: 'text-3xl',
};

const subtitleSizes = {
  sm: 'text-[10px]',
  md: 'text-xs',
  lg: 'text-sm',
};

export function BrandLogo({
  size = 'md',
  showText = true,
  className = '',
  textClassName = '',
  subtitle = true,
}: BrandLogoProps) {
  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      <div className={`relative ${sizeClasses[size]} shrink-0`} aria-hidden="true">
        <div className="absolute inset-0 rounded-[1.1rem] bg-[radial-gradient(circle_at_30%_25%,rgba(250,204,21,0.18),transparent_36%),linear-gradient(145deg,#0f172a_0%,#050816_54%,#020617_100%)] shadow-[0_0_0_1px_rgba(148,163,184,0.18),0_18px_40px_rgba(2,6,23,0.65),0_0_28px_rgba(34,211,238,0.16)]" />
        <div className="absolute inset-[1.25px] rounded-[1rem] border border-white/10" />
        <img
          src="/cli.png"
          alt="Hackura Sentinel AI logo"
          className="absolute inset-0 h-full w-full rounded-[1.05rem] object-cover"
        />
      </div>

      {showText && (
        <div className="leading-tight">
          <div className={`font-semibold tracking-[0.2em] text-white uppercase ${textSizes[size]} ${textClassName}`}>
            Hackura
          </div>
          <div className={`font-medium tracking-[0.28em] uppercase text-amber-300/90 ${subtitleSizes[size]}`}>
            Sentinel AI
          </div>
          {subtitle && size === 'lg' && (
            <div className="mt-1 text-sm text-zinc-400">Security intelligence command platform</div>
          )}
        </div>
      )}
    </div>
  );
}