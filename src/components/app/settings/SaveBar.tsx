import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, RotateCcw, Loader2, AlertCircle } from 'lucide-react';

interface SaveBarProps {
  isVisible: boolean;
  isSaving: boolean;
  onSave: () => void;
  onDiscard: () => void;
  changesCount?: number;
}

export const SaveBar: React.FC<SaveBarProps> = ({
  isVisible,
  isSaving,
  onSave,
  onDiscard,
  changesCount = 1
}) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.96 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-11/12 max-w-2xl"
        >
          <div className="p-3.5 sm:p-4 rounded-2xl bg-[#091428]/95 border border-cyan-500/40 shadow-[0_8px_32px_rgba(0,0,0,0.6),0_0_24px_rgba(34,211,238,0.15)] backdrop-blur-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center shrink-0">
                <AlertCircle className="w-4 h-4 text-amber-400" />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-semibold text-white leading-tight">
                  Careful — you have unsaved configuration changes!
                </p>
                <p className="text-[11px] font-mono text-slate-400">
                  {changesCount} parameter{changesCount > 1 ? 's' : ''} modified. Don't forget to commit your changes.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
              <button
                type="button"
                onClick={onDiscard}
                disabled={isSaving}
                className="px-3 py-1.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08] text-slate-300 hover:text-white text-xs font-mono transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Discard</span>
              </button>

              <button
                type="button"
                onClick={onSave}
                disabled={isSaving}
                className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-bold text-xs font-mono shadow-[0_0_16px_rgba(34,211,238,0.3)] transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Changes</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
