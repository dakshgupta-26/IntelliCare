import React from 'react';
import { X, AlertTriangle, CheckCircle, Info, ArrowRight } from 'lucide-react';
import { useCopilotStore } from '../../store/useCopilotStore';

export const CopilotToasts: React.FC = () => {
  const toasts = useCopilotStore((state) => state.toasts);
  const dismissToast = useCopilotStore((state) => state.dismissToast);
  const sendMessage = useCopilotStore((state) => state.sendMessage);

  if (toasts.length === 0) return null;

  return (
    <div className="absolute top-16 left-3 right-3 z-20 space-y-2 pointer-events-none">
      {toasts.map((t) => {
        const getIcon = () => {
          if (t.type === 'alert' || t.type === 'warning') {
            return <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />;
          }
          if (t.type === 'success') {
            return <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />;
          }
          return <Info className="w-4 h-4 text-brand-cyan shrink-0" />;
        };

        return (
          <div
            key={t.id}
            className="pointer-events-auto flex items-start justify-between gap-2.5 p-3 rounded-2xl bg-midnight-950/95 border border-cyan-500/30 shadow-[0_10px_30px_rgba(0,0,0,0.6)] backdrop-blur-2xl text-xs text-slate-200 animate-in slide-in-from-top-2 duration-200"
          >
            <div className="flex items-start gap-2 min-w-0">
              <div className="mt-0.5">{getIcon()}</div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white font-display truncate">{t.title}</span>
                  <span className="text-[10px] font-mono text-slate-500 shrink-0">{t.timestamp}</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-tight mt-0.5">{t.description}</p>
                {t.actionLabel && (
                  <button
                    onClick={() => {
                      if (t.actionPayload) {
                        sendMessage(t.actionPayload);
                      }
                      dismissToast(t.id);
                    }}
                    className="mt-1.5 text-[11px] font-semibold text-brand-cyan hover:text-cyan-200 flex items-center gap-1 transition-colors"
                  >
                    <span>{t.actionLabel}</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>

            <button
              onClick={() => dismissToast(t.id)}
              className="p-1 text-slate-400 hover:text-white rounded-md transition-colors shrink-0"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
