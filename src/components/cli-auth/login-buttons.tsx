'use client';

import { motion } from 'framer-motion';
import { Loader2, LockKeyhole, Mail } from 'lucide-react';
import type { FormEvent } from 'react';

type LoginButtonsProps = {
  email: string;
  password: string;
  loading: boolean;
  error: string | null;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onGitHubLogin: () => void;
  onGoogleLogin: () => void;
};

export function LoginButtons({
  email,
  password,
  loading,
  error,
  onEmailChange,
  onPasswordChange,
  onSubmit,
  onGitHubLogin,
  onGoogleLogin,
}: LoginButtonsProps) {
  return (
    <div className="space-y-5">
      {error ? (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-100"
        >
          {error}
        </motion.div>
      ) : null}

      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="mb-2 block text-xs font-medium uppercase tracking-[0.24em] text-zinc-400">
            Email
          </label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
            <input
              type="email"
              value={email}
              onChange={(event) => onEmailChange(event.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              className="w-full rounded-2xl border border-white/10 bg-black/35 py-3.5 pl-10 pr-4 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-fuchsia-400/40 focus:ring-2 focus:ring-fuchsia-500/15"
              required
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-xs font-medium uppercase tracking-[0.24em] text-zinc-400">
            Password
          </label>
          <div className="relative">
            <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
            <input
              type="password"
              value={password}
              onChange={(event) => onPasswordChange(event.target.value)}
              placeholder="••••••••••"
              autoComplete="current-password"
              className="w-full rounded-2xl border border-white/10 bg-black/35 py-3.5 pl-10 pr-4 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-fuchsia-400/40 focus:ring-2 focus:ring-fuchsia-500/15"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-fuchsia-500 to-violet-500 px-4 py-3 font-medium text-white shadow-[0_0_0_1px_rgba(217,70,239,0.28),0_16px_40px_rgba(168,85,247,0.25)] transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-[0_0_0_1px_rgba(217,70,239,0.38),0_18px_46px_rgba(168,85,247,0.3)] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          Continue with Email
        </button>
      </form>

      <div className="relative flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-zinc-500">
        <span className="h-px flex-1 bg-white/10" />
        Or continue with
        <span className="h-px flex-1 bg-white/10" />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <button
          type="button"
          onClick={onGitHubLogin}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm font-medium text-white transition-all duration-200 hover:border-fuchsia-400/35 hover:bg-fuchsia-500/10 hover:shadow-[0_0_30px_rgba(168,85,247,0.18)] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <GitHubIcon />
          GitHub
        </button>

        <button
          type="button"
          onClick={onGoogleLogin}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm font-medium text-white transition-all duration-200 hover:border-fuchsia-400/35 hover:bg-fuchsia-500/10 hover:shadow-[0_0_30px_rgba(168,85,247,0.18)] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <GoogleIcon />
          Google
        </button>
      </div>
    </div>
  );
}

function GitHubIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4">
      <path
        fill="currentColor"
        d="M12 2C6.48 2 2 6.58 2 12.25c0 4.54 2.87 8.39 6.84 9.75.5.1.68-.22.68-.49 0-.24-.01-.87-.01-1.71-2.78.62-3.37-1.37-3.37-1.37-.46-1.2-1.12-1.52-1.12-1.52-.91-.64.07-.63.07-.63 1.01.07 1.55 1.06 1.55 1.06.9 1.57 2.36 1.12 2.94.86.09-.67.35-1.12.64-1.38-2.22-.26-4.56-1.13-4.56-5.03 0-1.11.38-2.02 1-2.73-.1-.26-.43-1.31.1-2.73 0 0 .82-.27 2.7 1.04a9.1 9.1 0 0 1 4.92 0c1.87-1.31 2.69-1.04 2.69-1.04.53 1.42.2 2.47.1 2.73.63.71 1 1.62 1 2.73 0 3.91-2.35 4.76-4.59 5.02.36.32.68.95.68 1.92 0 1.38-.01 2.49-.01 2.83 0 .27.18.6.69.49A10.24 10.24 0 0 0 22 12.25C22 6.58 17.52 2 12 2Z"
      />
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4">
      <path
        fill="currentColor"
        d="M21.35 11.1H12v3.9h5.36c-.23 1.24-.93 2.28-1.98 2.99v2.49h3.2c1.87-1.72 2.95-4.25 2.95-7.24 0-.69-.06-1.22-.18-1.84Z"
      />
      <path
        fill="currentColor"
        d="M12 22c2.67 0 4.91-.88 6.55-2.37l-3.2-2.49c-.88.59-2.01.94-3.35.94-2.58 0-4.77-1.74-5.55-4.08H3.1v2.56A10 10 0 0 0 12 22Z"
      />
      <path
        fill="currentColor"
        d="M6.45 13.99A5.97 5.97 0 0 1 6.13 12c0-.69.12-1.36.32-1.99V7.45H3.1A10 10 0 0 0 2 12c0 1.61.38 3.13 1.1 4.55l3.35-2.56Z"
      />
      <path
        fill="currentColor"
        d="M12 5.88c1.46 0 2.77.5 3.8 1.48l2.85-2.85C16.9 2.88 14.67 2 12 2A10 10 0 0 0 3.1 7.45l3.35 2.56C7.23 7.62 9.42 5.88 12 5.88Z"
      />
    </svg>
  );
}