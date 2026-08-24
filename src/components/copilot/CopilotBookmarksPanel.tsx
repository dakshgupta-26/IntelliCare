import React from 'react';
import { X, Bookmark, Trash2, Copy, Check, Sparkles } from 'lucide-react';
import { useCopilotStore } from '../../store/useCopilotStore';

export const CopilotBookmarksPanel: React.FC = () => {
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  const isBookmarksOpen = useCopilotStore((state) => state.isBookmarksOpen);
  const setBookmarksOpen = useCopilotStore((state) => state.setBookmarksOpen);
  const bookmarks = useCopilotStore((state) => state.bookmarks);
  const removeBookmark = useCopilotStore((state) => state.removeBookmark);

  if (!isBookmarksOpen) return null;

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="absolute inset-0 z-30 flex bg-midnight-950/95 backdrop-blur-2xl animate-in slide-in-from-right duration-200">
      <div className="w-full flex flex-col p-4 text-slate-100">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Bookmark className="w-4 h-4 text-purple-400" />
            <h3 className="text-sm font-bold text-white font-display">Saved Insights & SOPs</h3>
          </div>
          <button
            onClick={() => setBookmarksOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-surface-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Bookmarks List */}
        <div className="flex-1 overflow-y-auto custom-scrollbar mt-3 space-y-2.5">
          {bookmarks.length === 0 ? (
            <div className="py-12 text-center text-slate-500 space-y-2">
              <Bookmark className="w-8 h-8 mx-auto opacity-40 text-purple-400" />
              <p className="text-xs">No bookmarked insights yet.</p>
              <p className="text-[11px] text-slate-600">
                Click the bookmark icon on any AI assistant response to save it here.
              </p>
            </div>
          ) : (
            bookmarks.map((bm) => (
              <div
                key={bm.id}
                className="p-3 rounded-2xl bg-midnight-900/90 border border-slate-800 text-xs space-y-2 group hover:border-purple-500/40 transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-1.5 text-purple-300 font-semibold">
                    <Sparkles className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{bm.title}</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500 shrink-0">{bm.timestamp}</span>
                </div>

                <p className="text-slate-300 text-[11px] line-clamp-3 leading-relaxed">
                  {bm.text}
                </p>

                <div className="flex items-center justify-end gap-2 pt-1 border-t border-slate-800/60">
                  <button
                    onClick={() => handleCopy(bm.id, bm.text)}
                    className="p-1 text-slate-400 hover:text-white flex items-center gap-1 text-[10px]"
                  >
                    {copiedId === bm.id ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span className="text-emerald-400">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => removeBookmark(bm.id)}
                    className="p-1 text-slate-400 hover:text-rose-400 text-[10px] flex items-center gap-1"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Remove</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
