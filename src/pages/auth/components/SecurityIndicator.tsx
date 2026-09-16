import React from 'react';
import { ShieldCheck, Lock, RefreshCw, KeyRound } from 'lucide-react';

export const SecurityIndicator: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`pt-4 border-t border-white/[0.08] select-none text-left ${className}`}>
      <div className="flex items-center gap-2 pb-2">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
        </span>
        <span className="text-[11px] font-mono font-bold tracking-wider text-slate-300 uppercase">
          Zero-Trust Security Controls Active
        </span>
      </div>

      <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-[10px] font-mono text-slate-400">
        <div className="flex items-center gap-1.5 truncate">
          <ShieldCheck className="w-3 h-3 text-emerald-400 shrink-0" />
          <span className="truncate">HttpOnly Cookie Rotation</span>
        </div>
        <div className="flex items-center gap-1.5 truncate">
          <Lock className="w-3 h-3 text-cyan-400 shrink-0" />
          <span className="truncate">In-Memory Token Isolation</span>
        </div>
        <div className="flex items-center gap-1.5 truncate">
          <RefreshCw className="w-3 h-3 text-blue-400 shrink-0" />
          <span className="truncate">Active Session Tracking</span>
        </div>
        <div className="flex items-center gap-1.5 truncate">
          <KeyRound className="w-3 h-3 text-teal-400 shrink-0" />
          <span className="truncate">Immutable Audit Ledger</span>
        </div>
      </div>
    </div>
  );
};
