import React, { useState, useRef, useEffect } from 'react';
import { 
  Maximize2, 
  Minimize2, 
  X, 
  MoreVertical, 
  MessageSquare, 
  Bookmark, 
  Mic, 
  Compass, 
  Volume2, 
  VolumeX, 
  Download, 
  Trash2 
} from 'lucide-react';
import { CopilotOrb } from './CopilotOrb';
import { useCopilotStore } from '../../store/useCopilotStore';

export const CopilotHeader: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const isExpanded = useCopilotStore((state) => state.isExpanded);
  const isStreaming = useCopilotStore((state) => state.isStreaming);

  const isSidebarOpen = useCopilotStore((state) => state.isSidebarOpen);
  const isBookmarksOpen = useCopilotStore((state) => state.isBookmarksOpen);
  const soundFxEnabled = useCopilotStore((state) => state.soundFxEnabled);

  const toggleOpen = useCopilotStore((state) => state.toggleOpen);
  const toggleExpanded = useCopilotStore((state) => state.toggleExpanded);
  const toggleVoiceMode = useCopilotStore((state) => state.toggleVoiceMode);
  const setSidebarOpen = useCopilotStore((state) => state.setSidebarOpen);
  const setBookmarksOpen = useCopilotStore((state) => state.setBookmarksOpen);
  const toggleSoundFx = useCopilotStore((state) => state.toggleSoundFx);
  const startTour = useCopilotStore((state) => state.startTour);
  const clearChat = useCopilotStore((state) => state.clearChat);
  const exportThread = useCopilotStore((state) => state.exportThread);

  // Close menu on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleExport = (format: 'markdown' | 'json') => {
    const content = exportThread(undefined, format);
    const blob = new Blob([content], { type: format === 'json' ? 'application/json' : 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `intellicare-copilot-${Date.now()}.${format === 'json' ? 'json' : 'md'}`;
    a.click();
    URL.revokeObjectURL(url);
    setMenuOpen(false);
  };

  return (
    <div className="relative flex items-center justify-between px-4 py-3 border-b border-cyan-500/15 bg-midnight-950/90 backdrop-blur-2xl text-slate-100 select-none z-20">
      {/* Left: AI Identity & Status */}
      <div className="flex items-center gap-3">
        <CopilotOrb size="sm" state={isStreaming ? 'streaming' : 'idle'} />

        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-xs font-bold text-white font-display tracking-tight flex items-center gap-1.5">
              IntelliCare AI Copilot
            </h3>
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[9px] font-mono text-emerald-300">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              ONLINE
            </span>
          </div>
          <p className="text-[10px] text-slate-400 font-sans">
            Hospital Operations Intelligence
          </p>
        </div>
      </div>

      {/* Right: Quick Action Controls */}
      <div className="flex items-center gap-1">
        {/* History Sidebar Button */}
        <button
          onClick={() => setSidebarOpen(!isSidebarOpen)}
          title="Chat History"
          className={`p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-surface-100 transition-colors ${
            isSidebarOpen ? 'bg-cyan-500/20 text-cyan-300' : ''
          }`}
        >
          <MessageSquare className="w-4 h-4" />
        </button>

        {/* Bookmarks Button */}
        <button
          onClick={() => setBookmarksOpen(!isBookmarksOpen)}
          title="Saved Bookmarks"
          className={`p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-surface-100 transition-colors ${
            isBookmarksOpen ? 'bg-purple-500/20 text-purple-300' : ''
          }`}
        >
          <Bookmark className="w-4 h-4" />
        </button>

        {/* Voice Mode Button */}
        <button
          onClick={() => toggleVoiceMode(true)}
          title="Voice Conversation Mode"
          className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-300 hover:bg-surface-100 transition-colors"
        >
          <Mic className="w-4 h-4" />
        </button>

        {/* Expand / Minimize Width */}
        <button
          onClick={toggleExpanded}
          title={isExpanded ? 'Standard View' : 'Expand Split View'}
          className="hidden sm:inline-flex p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-surface-100 transition-colors"
        >
          {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>

        {/* 3-Dot More Menu */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            title="More Options"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-surface-100 transition-colors"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {/* Dropdown Menu Popup */}
          {menuOpen && (
            <div className="absolute right-0 top-full mt-1.5 w-56 rounded-2xl bg-midnight-950/95 border border-slate-800 shadow-[0_15px_40px_rgba(0,0,0,0.6)] backdrop-blur-2xl p-1.5 text-xs text-slate-200 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <button
                onClick={() => {
                  startTour(0);
                  setMenuOpen(false);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-cyan-500/10 hover:text-cyan-300 transition-colors text-left"
              >
                <Compass className="w-4 h-4 text-brand-cyan" />
                <span>Start Interactive Tour</span>
              </button>

              <button
                onClick={() => {
                  toggleSoundFx();
                  setMenuOpen(false);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-surface-100 transition-colors text-left"
              >
                {soundFxEnabled ? (
                  <>
                    <Volume2 className="w-4 h-4 text-teal-400" />
                    <span>Mute Sound FX</span>
                  </>
                ) : (
                  <>
                    <VolumeX className="w-4 h-4 text-slate-400" />
                    <span>Enable Sound FX</span>
                  </>
                )}
              </button>

              <div className="h-px bg-slate-800 my-1" />

              <button
                onClick={() => handleExport('markdown')}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-surface-100 transition-colors text-left"
              >
                <Download className="w-4 h-4 text-slate-400" />
                <span>Export Session (Markdown)</span>
              </button>

              <button
                onClick={() => handleExport('json')}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-surface-100 transition-colors text-left"
              >
                <Download className="w-4 h-4 text-slate-400" />
                <span>Export Session (JSON)</span>
              </button>

              <div className="h-px bg-slate-800 my-1" />

              <button
                onClick={() => {
                  clearChat();
                  setMenuOpen(false);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-rose-500/10 text-rose-400 hover:text-rose-300 transition-colors text-left"
              >
                <Trash2 className="w-4 h-4" />
                <span>Clear Conversation</span>
              </button>
            </div>
          )}
        </div>

        {/* Close Button */}
        <button
          onClick={toggleOpen}
          title="Close Copilot (Esc)"
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-surface-100 transition-colors ml-1"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
