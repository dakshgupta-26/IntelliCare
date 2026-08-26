import React, { useEffect } from 'react';
import { AppSidebar } from './AppSidebar';
import { AppHeader } from './AppHeader';
import { CommandPalette } from '../ui/CommandPalette';
import { RoleSwitcherModal } from '../ui/RoleSwitcherModal';
import { useLayoutStore } from '../../store/useLayoutStore';
import { useRouterStore } from '../../store/useRouterStore';

interface AppShellProps {
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const isMobileSidebarOpen = useLayoutStore((state) => state.isMobileSidebarOpen);
  const setMobileSidebarOpen = useLayoutStore((state) => state.setMobileSidebarOpen);
  const currentPath = useRouterStore((state) => state.currentPath);

  // Auto-close mobile sidebar when path changes
  useEffect(() => {
    setMobileSidebarOpen(false);
  }, [currentPath, setMobileSidebarOpen]);

  return (
    <div className="flex h-screen w-full bg-[#f8fafc] dark:bg-[#060f1c] text-slate-900 dark:text-slate-100 overflow-hidden font-sans selection:bg-brand-cyan/20 selection:text-brand-cyan">
      {/* Desktop Left Application Sidebar (lg and up) */}
      <div className="hidden lg:flex h-full shrink-0">
        <AppSidebar />
      </div>

      {/* Mobile Drawer Overlay Sidebar (< lg) */}
      {isMobileSidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-navy-950/80 backdrop-blur-sm transition-opacity duration-300 animate-fade-in"
            onClick={() => setMobileSidebarOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer Panel */}
          <div className="relative z-10 h-full animate-slide-in-right shadow-2xl flex">
            <AppSidebar isMobile />
          </div>
        </div>
      )}

      {/* Main App Container */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Top Command & Scoping Header */}
        <AppHeader />

        {/* Dynamic View Scroll Area */}
        <main className="flex-1 overflow-y-auto custom-scrollbar p-3.5 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            {children}
          </div>
        </main>
      </div>

      {/* Global Command Palette (Cmd+K) */}
      <CommandPalette />

      {/* Global Interactive RBAC Switcher Modal */}
      <RoleSwitcherModal />
    </div>
  );
};
