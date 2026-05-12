'use client';

import { Sidebar } from '@/components/sidebar';
import { ProtectedRoute } from '@/components/protected-route';
import { useState } from 'react';
import { SidebarProvider, useSidebar } from '@/context/sidebar-context';

function DashboardContent({ children }: { children: React.ReactNode }) {
  const { collapsed } = useSidebar();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="w-full h-screen overflow-hidden bg-black relative">
      <Sidebar />
      <div className={`absolute top-0 bottom-0 left-0 right-0 flex flex-col bg-black text-white overflow-hidden transition-all duration-300 ${collapsed ? 'md:left-20' : 'md:left-64'}`}>
        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between px-4 py-4 border-b border-zinc-800/50 bg-zinc-950/50 flex-shrink-0">
          <h1 className="text-xl font-bold flex items-center gap-2">
            <span className="text-xl">🛡️</span>
            Hackura
          </h1>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-zinc-800/50 rounded-lg transition-colors"
          >
            <span className="text-2xl">☰</span>
          </button>
        </div>

        {/* Mobile Navigation */}
        {sidebarOpen && (
          <div className="md:hidden fixed inset-0 z-50 bg-black/80 backdrop-blur-sm">
            <div className="fixed left-0 top-0 w-64 h-screen bg-gradient-to-b from-zinc-950 to-black border-r border-zinc-800/50 backdrop-blur-xl flex flex-col">
              {/* Logo */}
              <div className="p-6 border-b border-zinc-800/50">
                <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                  <span className="text-2xl">🛡️</span>
                  <span>Hackura</span>
                </h1>
                <p className="text-xs text-purple-400 mt-1">Sentinel AI</p>
              </div>

              {/* Mobile Navigation Items */}
              <nav className="flex-1 p-4 space-y-2">
                {[
                  { label: 'Dashboard', icon: '📊', href: '/dashboard' },
                  { label: 'Scan', icon: '🔍', href: '/dashboard/scan' },
                  { label: 'Graph Explorer', icon: '🕸️', href: '/dashboard/graph' },
                  { label: 'History', icon: '📜', href: '/dashboard/history' },
                  { label: 'Settings', icon: '⚙️', href: '/dashboard/settings' },
                ].map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className="w-full text-left px-4 py-3 rounded-lg font-medium transition-all flex items-center gap-3 text-zinc-300 hover:bg-zinc-800/50"
                  >
                    <span className="text-xl">{item.icon}</span>
                    {item.label}
                  </a>
                ))}
              </nav>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="absolute inset-0 z-[-1]"
            />
          </div>
        )}

        <main className="flex-1 overflow-y-auto overflow-x-hidden">
          <div className="p-4 md:p-8 w-full">
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
