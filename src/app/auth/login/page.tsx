'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { signInWithEmail, signInWithGoogle, signInWithGitHub } from '@/lib/supabase';
import { GlassCard, Button } from '@/components/ui';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error } = await signInWithEmail(email, password);
      if (error) throw error;
      
      // Redirect to dashboard on success
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to sign in');
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-zinc-950 to-black flex items-center justify-center p-4">
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
          <div className="text-4xl mb-4">🛡️</div>
          <h1 className="text-3xl font-bold text-white mb-2">Hackura Sentinel</h1>
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
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-zinc-900/50 border border-zinc-700 rounded-lg px-4 py-2 text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20 transition-all"
                  required
                />
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

            {/* Divider */}
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-zinc-700/50"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-black text-zinc-500">Or continue with</span>
              </div>
            </div>

            {/* OAuth Buttons */}
            <div className="space-y-3">
              <button
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-zinc-800/50 hover:bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white font-medium transition-all disabled:opacity-50"
              >
                <span>🔵</span>
                Sign in with Google
              </button>

              <button
                onClick={handleGitHubLogin}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-zinc-800/50 hover:bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white font-medium transition-all disabled:opacity-50"
              >
                <span>⚫</span>
                Sign in with GitHub
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
  );
}
