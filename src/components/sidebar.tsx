'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { useSidebar } from '@/context/sidebar-context';
import { useAuth } from '@/context/auth-context';
import { signOut } from '@/lib/supabase';
import type { User } from '@supabase/supabase-js';
import { BrandLogo } from '@/components/brand-logo';

export function Sidebar() {
  const pathname = usePathname();
  const { collapsed, toggleCollapsed } = useSidebar();
  const { user } = useAuth();

  const getUserDisplay = () => {
    const email = user?.email || '';
    const metadata = (user as any)?.user_metadata || {};
    const name = metadata.full_name || email.split('@')[0];
    const avatar = metadata.avatar_url;
    return { name, email, avatar };
  };

  const { name, email, avatar } = getUserDisplay();

  const menuItems = [
    { label: 'Dashboard', icon: '📊', href: '/dashboard' },
    { label: 'Scan', icon: '🔍', href: '/dashboard/scan' },
    { label: 'Graph Explorer', icon: '🕸️', href: '/dashboard/graph' },
    { label: 'History', icon: '📜', href: '/dashboard/history' },
    { label: 'Settings', icon: '⚙️', href: '/dashboard/settings' },
  ];

  return (
    <motion.div
      initial={{ x: -256 }}
      animate={{ x: 0 }}
      className={`hidden md:flex md:fixed md:left-0 md:top-0 md:h-screen bg-gradient-to-b from-zinc-950 to-black border-r border-zinc-800/50 backdrop-blur-xl flex-col transition-all duration-300 ${
        collapsed ? 'md:w-20' : 'md:w-64'
      }`}
    >
      {/* Logo */}
      <div className="p-4 border-b border-zinc-800/50 flex items-center justify-between gap-2">
        <Link href="/" className="flex items-center flex-1 hover:opacity-80 transition-opacity">
          {!collapsed && (
            <BrandLogo size="md" className="flex-1" />
          )}
          {collapsed && <BrandLogo size="sm" showText={false} />}
        </Link>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleCollapsed}
          className="p-2 hover:bg-zinc-800/50 rounded-lg transition-colors ml-auto"
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <span className="text-lg">{collapsed ? '→' : '←'}</span>
        </motion.button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2 space-y-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href}>
              <motion.button
                whileHover={{ x: collapsed ? 0 : 4 }}
                whileTap={{ scale: 0.98 }}
                className={`
                  w-full text-left px-3 py-3 rounded-lg font-medium transition-all
                  flex items-center gap-3 justify-center md:justify-start
                  ${
                    isActive
                      ? 'bg-purple-600/20 text-purple-300 border border-purple-500/50'
                      : 'text-zinc-300 hover:bg-zinc-800/50 border border-transparent'
                  }
                `}
                title={collapsed ? item.label : undefined}
              >
                <span className="text-xl flex-shrink-0">{item.icon}</span>
                {!collapsed && <span>{item.label}</span>}
              </motion.button>
            </Link>
          );
        })}
      </nav>

      {/* User Profile */}
      {user && (
        <div className={`${collapsed ? 'p-2' : 'p-3'} border-t border-zinc-800/50`}>
          {collapsed ? (
            <div className="flex justify-center">
              <div className="w-10 h-10 rounded-full border border-zinc-700 overflow-hidden bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-lg">
                {avatar ? (
                  <img src={avatar} alt={name} className="w-full h-full object-cover" />
                ) : (
                  name.charAt(0).toUpperCase()
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full border border-zinc-700 overflow-hidden bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                {avatar ? (
                  <img src={avatar} alt={name} className="w-full h-full object-cover" />
                ) : (
                  name.charAt(0).toUpperCase()
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{name}</p>
                <p className="text-xs text-zinc-400 truncate">{email}</p>
              </div>
            </div>
          )}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => signOut()}
            className={`w-full text-left md:text-center px-3 py-2 rounded-lg text-sm text-zinc-300 hover:bg-zinc-800/50 hover:text-red-400 transition-all ${collapsed ? 'flex justify-center' : ''}`}
            title={collapsed ? 'Logout' : undefined}
          >
            {collapsed ? '⏻' : 'Logout'}
          </motion.button>
        </div>
      )}

      {/* Footer */}
      <div className="p-4 border-t border-zinc-800/50">
        {!collapsed && (
          <>
            <div className="flex justify-center mb-2">
              <BrandLogo size="sm" showText={false} />
            </div>
            <p className="text-xs text-zinc-500 text-center">Hackura Sentinel AI v1.0</p>
            <p className="text-xs text-zinc-600 text-center mt-1">
              AI-Powered Threat Intelligence
            </p>
          </>
        )}
      </div>
    </motion.div>
  );
}
