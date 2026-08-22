import React from 'react';
import { AppSidebar } from './AppSidebar';
import { AppHeader } from './AppHeader';
import { CommandPalette } from '../ui/CommandPalette';
import { RoleSwitcherModal } from '../ui/RoleSwitcherModal';

interface AppShellProps {
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  return (
    <div className="flex h-screen w-full bg-[#f8fafc] dark:bg-[#060f1c] text-slate-900 dark:text-slate-100 overflow-hidden font-sans selection:bg-brand-cyan/20 selection:text-brand-cyan">
      {/* Left Application Sidebar */}
      <AppSidebar />

      {/* Main App Container */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Top Command & Scoping Header */}
        <AppHeader />

        {/* Dynamic View Scroll Area */}
        <main className="flex-1 overflow-y-auto custom-scrollbar p-4 sm:p-6 lg:p-8">
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
