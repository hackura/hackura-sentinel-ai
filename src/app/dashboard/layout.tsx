'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Sidebar } from '@/components/sidebar';
import { ProtectedRoute } from '@/components/protected-route';
import { SidebarProvider, useSidebar } from '@/context/sidebar-context';
import { BrandLogo } from '@/components/brand-logo';

function DashboardContent({ children }: { children: React.ReactNode }) {
  const { collapsed } = useSidebar();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="w-full h-screen overflow-hidden bg-black relative flex flex-col md:flex-row">
      <Sidebar />
      <div className="flex-1 flex flex-col bg-black text-white overflow-hidden relative">
        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between px-6 py-4 border-b border-zinc-800/50 bg-black/80 backdrop-blur-xl sticky top-0 z-40">
          <BrandLogo size="sm" />
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800/50 rounded-lg transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
          </button>
        </div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {sidebarOpen && (
            <>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSidebarOpen(false)}
                className="md:hidden fixed inset-0 z-[60] bg-black/60 backdrop-blur-md"
              />
              <motion.div 
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="md:hidden fixed left-0 top-0 bottom-0 w-[80%] max-w-[300px] z-[70] bg-zinc-950 border-r border-zinc-800 shadow-2xl flex flex-col"
              >
                <div className="p-6 border-b border-zinc-800 flex items-center justify-between">
                  <BrandLogo size="sm" />
                  <button onClick={() => setSidebarOpen(false)} className="text-zinc-500 hover:text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                  </button>
                </div>
                <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                  {[
                    { label: 'Dashboard', icon: '📊', href: '/dashboard' },
                    { label: 'Scan', icon: '🔍', href: '/dashboard/scan' },
                    { label: 'Graph Explorer', icon: '🕸️', href: '/dashboard/graph' },
                    { label: 'History', icon: '📜', href: '/dashboard/history' },
                    { label: 'Settings', icon: '⚙️', href: '/dashboard/settings' },
                  ].map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className="flex items-center gap-4 px-4 py-3.5 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800/50 transition-all active:scale-95 font-medium"
                    >
                      <span className="text-xl opacity-80">{item.icon}</span>
                      <span>{item.label}</span>
                    </Link>
                  ))}
                </nav>
                <div className="p-6 border-t border-zinc-800 bg-zinc-900/20">
                  <p className="text-[10px] text-zinc-600 font-bold tracking-widest uppercase">Hackura Sentinel v1.0</p>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        <main className="flex-1 overflow-y-auto overflow-x-hidden relative">
          <div className="max-w-7xl mx-auto p-4 md:p-8 w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <SidebarProvider>
        <DashboardContent>{children}</DashboardContent>
      </SidebarProvider>
    </ProtectedRoute>
  );
}
