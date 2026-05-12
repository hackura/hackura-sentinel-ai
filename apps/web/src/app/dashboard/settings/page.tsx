'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { GlassCard, Button } from '@/components/ui';
import { signOut } from '@/lib/supabase';
import { generateApiKey, getUserSettings, updateUserSettings, type UserSettings } from '@/lib/api';

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
  const [generatedKey, setGeneratedKey] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [generatingKey, setGeneratingKey] = useState(false);
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
        email_notifications: notificationEnabled,
        two_factor_enabled: user.two_factor_enabled,
      });
      setUser(updated);
      setNotificationEnabled(updated.email_notifications);
      setStatusMessage('Settings saved successfully.');
    } catch (error) {
      console.error('Failed to save settings:', error);
      setStatusMessage('Failed to save settings.');
    } finally {
      setSaving(false);
    }
  };

  const handleGenerateApiKey = async () => {
    try {
      setGeneratingKey(true);
      setStatusMessage(null);
      const apiKey = await generateApiKey();
      setGeneratedKey(apiKey.key);
      setUser((current) => ({
        ...current,
        api_key_last4: apiKey.last4,
        api_key_created_at: apiKey.created_at,
      }));
      setStatusMessage('New API key generated. Copy it now; it will not be shown again.');
    } catch (error) {
      console.error('Failed to generate API key:', error);
      setStatusMessage('Failed to generate API key.');
    } finally {
      setGeneratingKey(false);
    }
  };

  const handleToggleTwoFactor = async () => {
    try {
      setSaving(true);
      setStatusMessage(null);
      const updated = await updateUserSettings({
        name: user.name,
        email_notifications: notificationEnabled,
        two_factor_enabled: !user.two_factor_enabled,
      });
      setUser(updated);
      setNotificationEnabled(updated.email_notifications);
      setStatusMessage(updated.two_factor_enabled ? 'Two-factor authentication enabled.' : 'Two-factor authentication disabled.');
    } catch (error) {
      console.error('Failed to toggle two-factor auth:', error);
      setStatusMessage('Failed to update two-factor authentication.');
    } finally {
      setSaving(false);
    }
  };

  const handleCopyApiKey = async () => {
    if (!generatedKey) {
      return;
    }

    await navigator.clipboard.writeText(generatedKey);
    setStatusMessage('API key copied to clipboard.');
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
          <h3 className="text-lg font-semibold text-white mb-6">User Profile</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-zinc-400 mb-2">Name</label>
              <input
                type="text"
                value={user.name}
                onChange={(e) => setUser({ ...user, name: e.target.value })}
                disabled={loading}
                className="w-full bg-zinc-900/50 border border-zinc-700 rounded-lg px-4 py-2 text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm text-zinc-400 mb-2">Email</label>
              <input
                type="email"
                value={user.email}
                readOnly
                className="w-full bg-zinc-900/30 border border-zinc-700 rounded-lg px-4 py-2 text-zinc-400"
              />
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
                  className="w-4 h-4"
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

            <div className="flex items-center justify-between p-4 bg-zinc-800/50 rounded-lg border border-zinc-700/50">
              <div>
                <p className="text-white font-medium">Two-Factor Authentication</p>
                <p className="text-zinc-400 text-sm">Enhanced security</p>
              </div>
              <Button
                variant="secondary"
                size="sm"
                onClick={handleToggleTwoFactor}
                disabled={loading || saving}
              >
                {saving ? 'Updating...' : user.two_factor_enabled ? 'Enabled' : 'Enable'}
              </Button>
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
                <span className="text-xs text-zinc-500">
                  {user.api_key_created_at ? `Created ${new Date(user.api_key_created_at).toLocaleDateString()}` : 'No key generated yet'}
                </span>
              </div>
              <div className="flex items-center gap-2 mb-3">
                <code className="text-xs text-zinc-400 bg-black/50 px-3 py-2 rounded flex-1 font-mono">
                  {generatedKey ? generatedKey : user.api_key_last4 ? `sk_live_••••••••${user.api_key_last4}` : 'No API key generated yet'}
                </code>
                <Button variant="secondary" size="sm" onClick={handleCopyApiKey} disabled={!generatedKey}>
                  Copy
                </Button>
              </div>
            </div>
          </div>
          <Button variant="secondary" className="mt-4" onClick={handleGenerateApiKey} disabled={generatingKey}>
            {generatingKey ? 'Generating...' : '+ Generate New Key'}
          </Button>
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
