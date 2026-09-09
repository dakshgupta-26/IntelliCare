import React from 'react';
import { useCopilotStore } from '../../store/useCopilotStore';

export const CopilotFloatingButton: React.FC = () => {
  const isOpen = useCopilotStore((state) => state.isOpen);
  const isTourActive = useCopilotStore((state) => state.isTourActive);
  const unreadCount = useCopilotStore((state) => state.unreadCount);
  const toggleOpen = useCopilotStore((state) => state.toggleOpen);

  // Hide button if chat window is open or tour is actively highlighting sections
  if (isOpen || isTourActive) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[70] select-none">
      {/* Collapsed Pill: ✦ IntelliCare Copilot */}
      <button
        onClick={toggleOpen}
        aria-label="Open IntelliCare Copilot"
        className="relative group inline-flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-[#0B1220]/95 hover:bg-[#0E1626] border border-cyan-400/40 hover:border-cyan-300 shadow-[0_8px_32px_rgba(0,0,0,0.7)] backdrop-blur-2xl transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer text-xs font-mono font-bold text-white"
        style={{
          boxShadow: '0 8px 30px -4px rgba(0, 0, 0, 0.8), 0 0 16px 0px rgba(25, 199, 243, 0.25)'
        }}
      >
        <span className="text-cyan-400 text-sm animate-pulse">✦</span>
        <span className="tracking-tight">IntelliCare Copilot</span>
        <kbd className="hidden sm:inline-block px-1.5 py-0.5 rounded bg-white/[0.06] border border-white/[0.1] text-[9px] text-slate-400 font-normal">
          ⌘K
        </kbd>

        {/* Unread notification badge */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-rose-500 text-white text-[9px] font-mono font-bold shadow-[0_0_10px_rgba(251,113,133,0.8)] border-2 border-[#050814]">
            {unreadCount}
          </span>
        )}
      </button>
    </div>
  );
};
