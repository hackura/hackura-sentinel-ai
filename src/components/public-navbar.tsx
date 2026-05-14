'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { BrandLogo } from '@/components/brand-logo';
import { Button } from '@/components/ui';

type PublicNavbarProps = {
  showHomeButton?: boolean;
};

export function PublicNavbar({ showHomeButton = false }: PublicNavbarProps) {
  return (
    <nav className="border-b border-zinc-800/50 bg-black/50 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 flex items-center justify-between py-5">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
          <Link href="/" className="hover:opacity-80 transition flex items-center">
            <BrandLogo size="md" />
          </Link>
        </motion.div>
        <div className="flex items-center gap-6 text-sm text-zinc-400 font-medium">
          <Link href="/#features" className="hover:text-purple-300 transition hidden md:block">Features</Link>
          <Link href="/security" className="hover:text-purple-300 transition hidden md:block">Security</Link>
          <Link href="/docs" className="hover:text-purple-300 transition hidden md:block">Docs</Link>
          {showHomeButton ? (
            <Link
              href="/"
              className="rounded-full border border-purple-500/40 bg-purple-500/10 px-5 py-2 text-purple-200 hover:border-purple-300 hover:bg-purple-500/20 hover:text-white transition shadow-[0_0_15px_rgba(168,85,247,0.15)]"
            >
              Back to Home
            </Link>
          ) : (
            <Link href="/auth/login">
              <Button variant="secondary" size="sm" className="rounded-full px-6 border-zinc-700 bg-zinc-900/50 hover:bg-zinc-800 text-zinc-200">
                Login
              </Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}