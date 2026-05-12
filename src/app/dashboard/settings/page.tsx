'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { GlassCard, Button } from '@/components/ui';
import { signOut } from '@/lib/supabase';
import { getUserSettings, updateUserSettings, deleteAccount, type UserSettings } from '@/lib/api';

export default function SettingsPage() {
  const [user, setUser] = useState<UserSettings>({
    email: '',
    name: 'Security Analyst',
    email_notifications: true,
    two_factor_enabled: false,
    api_key_last4: null,
    api_key_created_at: null,
  });
  const [notificationEnabled, setNotificationEnabled] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  useEffect(() => {
    async function loadSettings() {
      try {
        const settings = await getUserSettings();
        setUser(settings);
        setNotificationEnabled(settings.email_notifications);
      } catch (error) {
        console.error('Failed to load settings:', error);
      } finally {
        setLoading(false);
      }
    }

    loadSettings();
  }, []);

  const handleSaveChanges = async () => {
    try {
      setSaving(true);
      setStatusMessage(null);
      const updated = await updateUserSettings({
        name: user.name,
        email: user.email,
        email_notifications: notificationEnabled,
      });
      setUser(updated);
      setNotificationEnabled(updated.email_notifications);
      setStatusMessage('Settings saved successfully. Note: If you changed your email, please check your inbox for a confirmation link.');
    } catch (error) {
      console.error('Failed to save settings:', error);
      setStatusMessage('Failed to save settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm('Are you absolutely sure you want to delete your account? This action is permanent and cannot be undone.');
    if (!confirmed) return;

    try {
      setSaving(true);
      setStatusMessage(null);
      await deleteAccount();
      await signOut();
      window.location.href = '/';
    } catch (error) {
      console.error('Failed to delete account:', error);
      setStatusMessage('Failed to delete account. Please contact support.');
      setSaving(false);
    }
  };

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

      {statusMessage && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <GlassCard>
            <p className="text-sm text-zinc-200">{statusMessage}</p>
          </GlassCard>
        </motion.div>
      )}

      {/* User Profile */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <GlassCard>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">User Profile</h3>
            <div className="w-12 h-12 rounded-full border border-zinc-700 overflow-hidden bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
              {user.avatar_url ? (
                <img src={user.avatar_url} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                user.name.charAt(0).toUpperCase()
              )}
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-zinc-400 mb-2">Name</label>
              <input
                type="text"
                value={user.name}
                onChange={(e) => setUser({ ...user, name: e.target.value })}
                disabled={loading || saving}
                className="w-full bg-zinc-900/50 border border-zinc-700 rounded-lg px-4 py-2 text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm text-zinc-400 mb-2">Email</label>
              <input
                type="email"
                value={user.email}
                onChange={(e) => setUser({ ...user, email: e.target.value })}
                disabled={loading || saving}
                className="w-full bg-zinc-900/50 border border-zinc-700 rounded-lg px-4 py-2 text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20 transition-all"
              />
              <p className="mt-2 text-xs text-zinc-500">Updating your email will require confirmation.</p>
            </div>
            <div className="pt-4">
              <Button variant="primary" onClick={handleSaveChanges} disabled={loading || saving}>
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
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
                <input
                  type="checkbox"
                  checked={notificationEnabled}
                  onChange={(e) => setNotificationEnabled(e.target.checked)}
                  className="w-4 h-4 cursor-pointer"
                />
              </label>
            </div>

            <div className="flex items-center justify-between p-4 bg-zinc-800/50 rounded-lg border border-zinc-700/50">
              <div>
                <p className="text-white font-medium">Dark Mode</p>
                <p className="text-zinc-400 text-sm">Always enabled</p>
              </div>
              <span className="text-purple-400">✓</span>
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* Danger Zone */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <GlassCard>
          <h3 className="text-lg font-semibold text-white mb-6 text-red-400">Danger Zone</h3>
          <div className="space-y-3">
            <div className="p-4 bg-red-900/10 rounded-lg border border-red-900/20">
              <p className="text-white font-medium mb-1">Logout</p>
              <p className="text-zinc-400 text-sm mb-4">End your current session safely.</p>
              <Button variant="secondary" onClick={handleLogout} className="border-red-900/30 hover:bg-red-900/20">
                Logout
              </Button>
            </div>

            <div className="p-4 bg-red-900/10 rounded-lg border border-red-900/20">
              <p className="text-white font-medium mb-1">Delete Account</p>
              <p className="text-zinc-400 text-sm mb-4">Permanently delete your account and all associated data.</p>
              <Button variant="danger" onClick={handleDeleteAccount} disabled={loading || saving}>
                {saving ? 'Deleting...' : 'Delete Account'}
              </Button>
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* Information */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
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
              <span className="text-white font-medium">May 12, 2026</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">Environment</span>
              <span className="text-white font-medium">Production</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">Last Updated</span>
              <span className="text-white font-medium">Recently</span>
            </div>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
}
