import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { CopilotOrb } from './CopilotOrb';
import { useCopilotStore } from '../../store/useCopilotStore';

export const CopilotFloatingButton: React.FC = () => {
  const [isHovered, setIsHovered] = useState(false);
  const isOpen = useCopilotStore((state) => state.isOpen);
  const isTourActive = useCopilotStore((state) => state.isTourActive);
  const unreadCount = useCopilotStore((state) => state.unreadCount);
  const isStreaming = useCopilotStore((state) => state.isStreaming);
  const toggleOpen = useCopilotStore((state) => state.toggleOpen);

  // Hide button if chat window is open or tour is actively highlighting sections
  if (isOpen || isTourActive) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[70] select-none">
      {/* Tooltip on hover */}
      {isHovered && (
        <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-midnight-950/95 border border-cyan-500/30 text-xs text-white shadow-[0_10px_25px_rgba(0,0,0,0.6)] backdrop-blur-xl pointer-events-none whitespace-nowrap animate-in fade-in slide-in-from-right-2 duration-150">
          <Sparkles className="w-3.5 h-3.5 text-brand-cyan animate-pulse" />
          <span className="font-display font-semibold">IntelliCare AI Copilot</span>
          <kbd className="px-1.5 py-0.5 rounded bg-surface-100 border border-slate-700 text-[10px] font-mono text-cyan-300">
            ⌘K
          </kbd>
        </div>
      )}

      {/* Floating Glass Orb Button */}
      <button
        onClick={toggleOpen}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        aria-label="Open IntelliCare AI Copilot"
        className="relative group w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center bg-midnight-950/80 border border-cyan-400/40 shadow-[0_10px_35px_rgba(0,0,0,0.6)] backdrop-blur-2xl transition-all duration-300 hover:scale-105 hover:border-cyan-300 active:scale-95 cursor-pointer"
        style={{
          boxShadow: '0 10px 35px -5px rgba(0, 0, 0, 0.7), 0 0 25px 0px rgba(22, 199, 243, 0.4)'
        }}
      >
        {/* Soft Radial Ambient Breathing Glow */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-cyan-500/20 via-indigo-500/20 to-teal-400/20 blur-md group-hover:scale-125 transition-transform duration-500" />

        {/* AI Neural Orb Core */}
        <CopilotOrb
          size="md"
          state={isStreaming ? 'streaming' : isHovered ? 'hover' : 'idle'}
        />

        {/* Unread Insights Notification Badge */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[20px] h-5 px-1 rounded-full bg-rose-500 text-white text-[10px] font-mono font-bold shadow-[0_0_12px_rgba(244,63,94,0.7)] border-2 border-midnight-950 animate-bounce">
            {unreadCount}
          </span>
        )}
      </button>
    </div>
  );
};
