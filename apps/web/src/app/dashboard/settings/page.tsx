'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { GlassCard, Button } from '@/components/ui';
import { signOut } from '@/lib/supabase';

export default function SettingsPage() {
  const [user, setUser] = useState({
    email: 'user@example.com',
    name: 'Security Analyst',
  });

  const handleLogout = async () => {
    await signOut();
    window.location.href = '/';
  };

  return (
    <div className="space-y-6 md:space-y-8 max-w-2xl">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Settings</h1>
        <p className="text-sm md:text-base text-zinc-400">Manage your account and system settings</p>
      </motion.div>

      {/* User Profile */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <GlassCard>
          <h3 className="text-lg font-semibold text-white mb-6">User Profile</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-zinc-400 mb-2">Name</label>
              <input
                type="text"
                value={user.name}
                onChange={(e) => setUser({ ...user, name: e.target.value })}
                className="w-full bg-zinc-900/50 border border-zinc-700 rounded-lg px-4 py-2 text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm text-zinc-400 mb-2">Email</label>
              <input
                type="email"
                value={user.email}
                onChange={(e) => setUser({ ...user, email: e.target.value })}
                className="w-full bg-zinc-900/50 border border-zinc-700 rounded-lg px-4 py-2 text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20 transition-all"
              />
            </div>
            <div className="pt-4">
              <Button variant="primary">Save Changes</Button>
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* Preferences */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <GlassCard>
          <h3 className="text-lg font-semibold text-white mb-6">Preferences</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-zinc-800/50 rounded-lg border border-zinc-700/50">
              <div>
                <p className="text-white font-medium">Email Notifications</p>
                <p className="text-zinc-400 text-sm">Receive alerts for high-risk threats</p>
              </div>
              <label className="flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked className="w-4 h-4" />
              </label>
            </div>

            <div className="flex items-center justify-between p-4 bg-zinc-800/50 rounded-lg border border-zinc-700/50">
              <div>
                <p className="text-white font-medium">Dark Mode</p>
                <p className="text-zinc-400 text-sm">Always enabled</p>
              </div>
              <span className="text-purple-400">✓</span>
            </div>

            <div className="flex items-center justify-between p-4 bg-zinc-800/50 rounded-lg border border-zinc-700/50">
              <div>
                <p className="text-white font-medium">Two-Factor Authentication</p>
                <p className="text-zinc-400 text-sm">Enhanced security</p>
              </div>
              <Button variant="secondary" size="sm">Enable</Button>
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* API Keys */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <GlassCard>
          <h3 className="text-lg font-semibold text-white mb-6">API Keys</h3>
          <div className="space-y-3">
            <div className="p-4 bg-zinc-800/50 rounded-lg border border-zinc-700/50">
              <div className="flex items-center justify-between mb-2">
                <p className="text-white font-medium text-sm">Development Key</p>
                <span className="text-xs text-zinc-500">Created 30 days ago</span>
              </div>
              <div className="flex items-center gap-2 mb-3">
                <code className="text-xs text-zinc-400 bg-black/50 px-3 py-2 rounded flex-1 font-mono">
                  sk_dev_••••••••••••••••••••
                </code>
                <Button variant="secondary" size="sm">Copy</Button>
              </div>
            </div>
          </div>
          <Button variant="secondary" className="mt-4">+ Generate New Key</Button>
        </GlassCard>
      </motion.div>

      {/* Danger Zone */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <GlassCard>
          <h3 className="text-lg font-semibold text-white mb-6">Danger Zone</h3>
          <div className="space-y-3">
            <div className="p-4 bg-red-900/10 rounded-lg border border-red-700/50">
              <p className="text-white font-medium mb-2">Logout</p>
              <p className="text-zinc-400 text-sm mb-4">End your current session</p>
              <Button variant="danger" onClick={handleLogout}>
                Logout
              </Button>
            </div>

            <div className="p-4 bg-red-900/10 rounded-lg border border-red-700/50">
              <p className="text-white font-medium mb-2">Delete Account</p>
              <p className="text-zinc-400 text-sm mb-4">Permanently delete your account and all data</p>
              <Button variant="danger" disabled>
                Delete Account
              </Button>
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* Information */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <GlassCard>
          <h3 className="text-lg font-semibold text-white mb-4">System Information</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-zinc-400">Application Version</span>
              <span className="text-white font-medium">1.0.0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">Build Date</span>
              <span className="text-white font-medium">May 10, 2026</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">Environment</span>
              <span className="text-white font-medium">Production</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">Last Updated</span>
              <span className="text-white font-medium">2 hours ago</span>
            </div>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
}
