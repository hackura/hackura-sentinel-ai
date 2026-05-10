'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';

export function Sidebar() {
  const pathname = usePathname();

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
      className="fixed left-0 top-0 w-64 h-screen bg-gradient-to-b from-zinc-950 to-black border-r border-zinc-800/50 backdrop-blur-xl flex flex-col"
    >
      {/* Logo */}
      <div className="p-6 border-b border-zinc-800/50">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <span className="text-2xl">🛡️</span>
          <span>Hackura</span>
        </h1>
        <p className="text-xs text-purple-400 mt-1">Sentinel AI</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link key={item.href} href={item.href}>
              <motion.button
                whileHover={{ x: 4 }}
                className={`
                  w-full text-left px-4 py-3 rounded-lg font-medium transition-all
                  flex items-center gap-3
                  ${
                    isActive
                      ? 'bg-purple-600/20 text-purple-300 border border-purple-500/50'
                      : 'text-zinc-300 hover:bg-zinc-800/50 border border-transparent'
                  }
                `}
              >
                <span className="text-xl">{item.icon}</span>
                {item.label}
              </motion.button>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-zinc-800/50">
        <p className="text-xs text-zinc-500 text-center">
          Hackura Sentinel AI v1.0
        </p>
        <p className="text-xs text-zinc-600 text-center mt-1">
          AI-Powered Threat Intelligence
        </p>
      </div>
    </motion.div>
  );
}
