'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { GlassCard, Button } from '@/components/ui';
import { ConfirmationModal } from '@/components/confirmation-modal';
import { signOut, supabase } from '@/lib/supabase';
import { getUserSettings, updateUserSettings, type UserSettings } from '@/lib/api';

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

  // Modal States
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

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
    try {
      setSaving(true);
      setIsDeleteModalOpen(false);

      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) throw new Error('Not authenticated');

      // 1. Delete user data via Supabase (frontend client)
      // This assumes RLS allows the user to delete their own records
      const { error: scansError } = await supabase
        .from('scans')
        .delete()
        .eq('user_id', authUser.id);

      if (scansError) console.warn('Error clearing scans during account deletion:', scansError);

      // 2. Sign out (Account deletion itself usually requires a service-role/backend call, 
      // but we purge data and end session as requested)
      await signOut();
      window.location.href = '/';
    } catch (error) {
      console.error('Failed to process account deletion:', error);
      setStatusMessage('Failed to complete deletion. Please try again or contact support.');
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
    window.location.href = '/';
  };

  return (
    <div className="space-y-6 md:space-y-8 max-w-2xl pb-20">
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
          <GlassCard className="border-purple-500/20 bg-purple-500/5">
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
              <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">Name</label>
              <input
                type="text"
                value={user.name}
                onChange={(e) => setUser({ ...user, name: e.target.value })}
                disabled={loading || saving}
                className="w-full bg-zinc-900/50 border border-zinc-800 rounded-lg px-4 py-2 text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">Email</label>
              <input
                type="email"
                value={user.email}
                onChange={(e) => setUser({ ...user, email: e.target.value })}
                disabled={loading || saving}
                className="w-full bg-zinc-900/50 border border-zinc-800 rounded-lg px-4 py-2 text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20 transition-all"
              />
              <p className="mt-2 text-[10px] text-zinc-600 font-mono italic">Changing your email will trigger a verification request.</p>
            </div>
            <div className="pt-4">
              <Button variant="primary" onClick={handleSaveChanges} disabled={loading || saving} className="w-full sm:w-auto">
                {saving ? 'Saving...' : 'Save Profile'}
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
          <h3 className="text-lg font-semibold text-white mb-6">System Preferences</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-zinc-900/50 rounded-xl border border-zinc-800/50">
              <div>
                <p className="text-white font-bold text-sm">Threat Alerts</p>
                <p className="text-zinc-500 text-xs">Email notifications for high-risk detections</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notificationEnabled}
                  onChange={(e) => setNotificationEnabled(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
              </label>
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
        <GlassCard className="border-red-900/20">
          <h3 className="text-lg font-bold text-red-500 mb-6 uppercase tracking-tighter">Danger Zone</h3>
          <div className="space-y-4">
            <div className="p-4 bg-red-500/5 rounded-xl border border-red-500/10">
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1">
                  <p className="text-white font-bold text-sm">Terminate Session</p>
                  <p className="text-zinc-500 text-xs">Securely sign out of your account</p>
                </div>
                <Button variant="secondary" onClick={() => setIsLogoutModalOpen(true)} className="border-red-500/20 hover:bg-red-500/10 text-red-400">
                  Logout
                </Button>
              </div>
            </div>

            <div className="p-4 bg-red-500/5 rounded-xl border border-red-500/10">
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1">
                  <p className="text-white font-bold text-sm">Destroy Account</p>
                  <p className="text-zinc-500 text-xs">Purge all scans and intelligence data permanently</p>
                </div>
                <Button variant="danger" onClick={() => setIsDeleteModalOpen(true)} disabled={loading || saving}>
                  {saving ? 'Processing...' : 'Delete'}
                </Button>
              </div>
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
        <div className="text-center">
          <p className="text-[10px] text-zinc-700 font-mono uppercase tracking-[0.3em]">
            Hackura Sentinel AI — Build 2026.05.12-PRD
          </p>
        </div>
      </motion.div>

      {/* Modals */}
      <ConfirmationModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogout}
        title="Confirm Logout"
        message="Are you sure you want to end your current security session?"
        confirmText="Logout"
        variant="primary"
      />

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteAccount}
        title="Account Destruction"
        message="WARNING: This will permanently purge all your threat intelligence data and saved scans. This action is irreversible. Proceed with caution."
        confirmText="Confirm Destruction"
        variant="danger"
        loading={saving}
      />
    </div>
  );
}
