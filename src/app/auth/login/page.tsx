'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { signInWithEmail, signInWithGitHub, signInWithGoogle } from '@/lib/supabase';
import { GlassCard, Button } from '@/components/ui';
import { BrandLogo } from '@/components/brand-logo';
import { PublicNavbar } from '@/components/public-navbar';

function GitHubIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
      <path
        fill="currentColor"
        d="M12 2C6.48 2 2 6.58 2 12.25c0 4.54 2.87 8.39 6.84 9.75.5.1.68-.22.68-.49 0-.24-.01-.87-.01-1.71-2.78.62-3.37-1.37-3.37-1.37-.46-1.2-1.12-1.52-1.12-1.52-.91-.64.07-.63.07-.63 1.01.07 1.55 1.06 1.55 1.06.9 1.57 2.36 1.12 2.94.86.09-.67.35-1.12.64-1.38-2.22-.26-4.56-1.13-4.56-5.03 0-1.11.38-2.02 1-2.73-.1-.26-.43-1.31.1-2.73 0 0 .82-.27 2.7 1.04a9.1 9.1 0 0 1 4.92 0c1.87-1.31 2.69-1.04 2.69-1.04.53 1.42.2 2.47.1 2.73.63.71 1 1.62 1 2.73 0 3.91-2.35 4.76-4.59 5.02.36.32.68.95.68 1.92 0 1.38-.01 2.49-.01 2.83 0 .27.18.6.69.49A10.24 10.24 0 0 0 22 12.25C22 6.58 17.52 2 12 2Z"
      />
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
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

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error } = await signInWithEmail(email, password);
      if (error) throw error;
      
      // Wait a moment for the session to be established, then redirect to callback
      // The callback page will handle onboarding logic
      setTimeout(() => {
        router.push('/auth/callback');
      }, 100);
    } catch (err: any) {
      setError(err.message || 'Failed to sign in');
      setLoading(false);
    }
  };

  const handleGitHubLogin = async () => {
    setLoading(true);
    setError(null);

    try {
      const { error } = await signInWithGitHub();
      if (error) throw error;
    } catch (err: any) {
      setError(err.message || 'Failed to sign in with GitHub');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);

    try {
      const { error } = await signInWithGoogle();
      if (error) throw error;
    } catch (err: any) {
      setError(err.message || 'Failed to sign in with Google');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black">
      <PublicNavbar showHomeButton />
      <div className="bg-gradient-to-b from-black via-zinc-950 to-black flex items-center justify-center p-4 min-h-[calc(100vh-80px)]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-center mb-8"
          >
            <div className="flex justify-center mb-4">
              <BrandLogo size="lg" subtitle={false} />
            </div>
            <p className="text-zinc-400">Cybersecurity Intelligence Dashboard</p>
          </motion.div>

          <GlassCard>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-2xl font-bold text-white mb-6 text-center">
                Sign In
              </h2>

              {/* Error Message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-4 p-3 bg-red-900/30 border border-red-700/50 rounded-lg"
                >
                  <p className="text-red-300 text-sm">{error}</p>
                </motion.div>
              )}

              {/* Email Login Form */}
              <form onSubmit={handleEmailLogin} className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm text-zinc-400 mb-2">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="user@example.com"
                    className="w-full bg-zinc-900/50 border border-zinc-700 rounded-lg px-4 py-2 text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20 transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm text-zinc-400 mb-2">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-zinc-900/50 border border-zinc-700 rounded-lg px-4 py-2 pr-10 text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20 transition-all"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((s) => !s)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-200"
                    >
                      {showPassword ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0 1 12 19c-5.523 0-10-4.478-10-10 0-1.067.172-2.096.488-3.06M3 3l18 18" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  className="w-full"
                  disabled={loading}
                >
                  {loading ? 'Signing in...' : 'Sign In'}
                </Button>
              </form>

              {/* OAuth Buttons */}
              <div className="mt-6 space-y-3">
                <button
                  onClick={handleGitHubLogin}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 bg-zinc-800/50 hover:bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white font-medium transition-all disabled:opacity-50"
                >
                  <GitHubIcon />
                  Sign in with GitHub
                </button>
                <button
                  onClick={handleGoogleLogin}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 bg-zinc-800/50 hover:bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white font-medium transition-all disabled:opacity-50"
                >
                  <GoogleIcon />
                  Sign in with Google
                </button>
              </div>

              {/* Signup Link */}
              <p className="text-center text-zinc-400 text-sm mt-6">
                Don't have an account?{' '}
                <Link href="/auth/signup" className="text-purple-400 hover:text-purple-300 font-medium">
                  Sign up
                </Link>
              </p>
            </motion.div>
          </GlassCard>

          {/* Decorative elements */}
          <motion.div
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="mt-12 text-center text-zinc-600/30 text-sm"
          >
            <p>Advanced Threat Intelligence Platform</p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
