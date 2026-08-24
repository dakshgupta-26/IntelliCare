import React, { useState } from 'react';
import { 
  X, 
  Plus, 
  Search, 
  Pin, 
  Trash2, 
  Edit2, 
  Check, 
  MessageSquare 
} from 'lucide-react';
import { useCopilotStore } from '../../store/useCopilotStore';


export const CopilotSidebar: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');

  const isSidebarOpen = useCopilotStore((state) => state.isSidebarOpen);
  const setSidebarOpen = useCopilotStore((state) => state.setSidebarOpen);
  const threads = useCopilotStore((state) => state.threads);
  const activeThreadId = useCopilotStore((state) => state.activeThreadId);
  const switchThread = useCopilotStore((state) => state.switchThread);
  const createNewThread = useCopilotStore((state) => state.createNewThread);
  const renameThread = useCopilotStore((state) => state.renameThread);
  const deleteThread = useCopilotStore((state) => state.deleteThread);
  const pinThread = useCopilotStore((state) => state.pinThread);

  if (!isSidebarOpen) return null;

  const filteredThreads = threads.filter((t) =>
    t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.messages.some((m) => m.text.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const pinnedThreads = filteredThreads.filter((t) => t.pinned);
  const unpinnedThreads = filteredThreads.filter((t) => !t.pinned);

  const startEditing = (id: string, currentTitle: string) => {
    setEditingId(id);
    setEditTitle(currentTitle);
  };

  const saveEditing = (id: string) => {
    if (editTitle.trim()) {
      renameThread(id, editTitle.trim());
    }
    setEditingId(null);
  };

  return (
    <div className="absolute inset-0 z-30 flex bg-midnight-950/95 backdrop-blur-2xl animate-in slide-in-from-left duration-200">
      <div className="w-full flex flex-col p-4 text-slate-100">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-brand-cyan" />
            <h3 className="text-sm font-bold text-white font-display">Operational Sessions</h3>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-surface-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* New Chat Button */}
        <button
          onClick={() => createNewThread()}
          className="mt-3 w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-cyan-500/20 to-blue-600/20 border border-cyan-500/30 hover:border-cyan-400 text-cyan-300 text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-[0_0_15px_rgba(22,199,243,0.15)]"
        >
          <Plus className="w-4 h-4" />
          <span>New Operations Chat</span>
        </button>

        {/* Search Bar */}
        <div className="relative mt-3">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search conversations..."
            className="w-full bg-surface-50 border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500/50"
          />
        </div>

        {/* Thread List */}
        <div className="flex-1 overflow-y-auto custom-scrollbar mt-3 space-y-3">
          {/* Pinned Section */}
          {pinnedThreads.length > 0 && (
            <div>
              <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider px-1 mb-1 block">
                Pinned Sessions
              </span>
              <div className="space-y-1">
                {pinnedThreads.map((thread) => renderThreadItem(thread))}
              </div>
            </div>
          )}

          {/* Recent Section */}
          <div>
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider px-1 mb-1 block">
              Recent Sessions
            </span>
            <div className="space-y-1">
              {unpinnedThreads.map((thread) => renderThreadItem(thread))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  function renderThreadItem(thread: typeof threads[0]) {
    const isActive = thread.id === activeThreadId;
    const isEditing = editingId === thread.id;

    return (
      <div
        key={thread.id}
        className={`group flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all ${
          isActive
            ? 'bg-cyan-500/15 border border-cyan-500/40 text-white font-semibold'
            : 'text-slate-300 hover:bg-surface-100 hover:text-white border border-transparent'
        }`}
      >
        {isEditing ? (
          <div className="flex-1 flex items-center gap-1">
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && saveEditing(thread.id)}
              autoFocus
              className="flex-1 bg-midnight-950 px-2 py-0.5 rounded border border-cyan-400 text-xs text-white"
            />
            <button
              onClick={() => saveEditing(thread.id)}
              className="p-1 text-emerald-400 hover:text-emerald-300"
            >
              <Check className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <div
            onClick={() => switchThread(thread.id)}
            className="flex-1 min-w-0 cursor-pointer pr-2"
          >
            <div className="flex items-center gap-1.5">
              {thread.pinned && <Pin className="w-3 h-3 text-cyan-400 shrink-0 rotate-45" />}
              <span className="truncate">{thread.title}</span>
            </div>
            <span className="text-[10px] font-mono text-slate-500 block truncate">
              {thread.messages.length} message{thread.messages.length !== 1 ? 's' : ''}
            </span>
          </div>
        )}

        {/* Action Controls */}
        {!isEditing && (
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => pinThread(thread.id)}
              title={thread.pinned ? 'Unpin' : 'Pin to top'}
              className="p-1 text-slate-400 hover:text-cyan-300"
            >
              <Pin className={`w-3.5 h-3.5 ${thread.pinned ? 'fill-cyan-400 text-cyan-400' : ''}`} />
            </button>
            <button
              onClick={() => startEditing(thread.id, thread.title)}
              title="Rename"
              className="p-1 text-slate-400 hover:text-white"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
            {threads.length > 1 && (
              <button
                onClick={() => deleteThread(thread.id)}
                title="Delete"
                className="p-1 text-slate-400 hover:text-rose-400"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}
      </div>
    );
  }
};
