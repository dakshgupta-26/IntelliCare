import React, { useEffect, useRef } from 'react';
import { CopilotHeader } from './CopilotHeader';
import { CopilotContextBar } from './CopilotContextBar';
import { CopilotMessageList } from './CopilotMessageList';
import { CopilotInput } from './CopilotInput';
import { CopilotSidebar } from './CopilotSidebar';
import { CopilotBookmarksPanel } from './CopilotBookmarksPanel';
import { CopilotVoiceOverlay } from './CopilotVoiceOverlay';
import { CopilotToasts } from './CopilotToasts';
import { useCopilotStore } from '../../store/useCopilotStore';

export const CopilotWindow: React.FC = () => {
  const isOpen = useCopilotStore((state) => state.isOpen);
  const isExpanded = useCopilotStore((state) => state.isExpanded);
  const isTourActive = useCopilotStore((state) => state.isTourActive);
  const toggleOpen = useCopilotStore((state) => state.toggleOpen);

  const windowRef = useRef<HTMLDivElement>(null);

  // Keyboard shortcut listener: Cmd/Ctrl + K to toggle, Esc to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        toggleOpen();
      } else if (e.key === 'Escape' && isOpen) {
        toggleOpen();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, toggleOpen]);

  if (!isOpen || isTourActive) return null;

  return (
    <>
      {/* Desktop & Mobile Floating Window Container */}
      <div
        ref={windowRef}
        className={`fixed z-[80] transition-all duration-300 ease-out flex flex-col overflow-hidden shadow-[0_25px_80px_rgba(0,0,0,0.7)] backdrop-blur-3xl border border-cyan-500/25 bg-midnight-950/92 selection:bg-brand-cyan/20 selection:text-brand-cyan ${
          /* Mobile full bottom sheet */
          'inset-x-0 bottom-0 top-12 rounded-t-[32px] sm:top-auto sm:inset-x-auto sm:right-6 sm:bottom-6 sm:rounded-[28px]'
        } ${
          /* Desktop Width Expansion */
          isExpanded ? 'sm:w-[760px] sm:h-[720px]' : 'sm:w-[420px] sm:h-[680px]'
        }`}
        style={{
          boxShadow: '0 25px 80px -10px rgba(0, 0, 0, 0.8), 0 0 35px -5px rgba(22, 199, 243, 0.25)'
        }}
      >
        {/* Mobile Drag Handle */}
        <div className="sm:hidden w-full flex justify-center py-1.5 bg-midnight-950/90 border-b border-white/5 cursor-grab">
          <div className="w-12 h-1.5 rounded-full bg-slate-700/80" />
        </div>

        {/* 1. Header */}
        <CopilotHeader />

        {/* 2. Smart Context Scoping Bar */}
        <CopilotContextBar />

        {/* 3. In-Chat Realtime Toasts */}
        <CopilotToasts />

        {/* 4. Scrollable Message Feed */}
        <CopilotMessageList />

        {/* 5. Auto-Resize Input Area with Slash Commands & Autocomplete */}
        <CopilotInput />

        {/* Slide-in History Sidebar Drawer */}
        <CopilotSidebar />

        {/* Slide-in Bookmarks Panel Drawer */}
        <CopilotBookmarksPanel />
      </div>

      {/* Futuristic Full Voice Mode Overlay */}
      <CopilotVoiceOverlay />
    </>
  );
};
