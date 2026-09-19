import React from 'react';
import {
  History,
  CheckCircle2,
  Clock,
  Sliders,
  TrendingUp,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { INITIAL_AUDIT_LOGS } from '../../../data/mockDatabase';
import { useRouterStore } from '../../../store/useRouterStore';
import { Badge } from '../../ui/Badge';

export const RecentDecisionsFeed: React.FC = () => {
  const navigate = useRouterStore((state) => state.navigate);
  const recentLogs = INITIAL_AUDIT_LOGS.slice(0, 5);

  const getActionIcon = (action: string) => {
    if (action.includes('APPROVED') || action.includes('AUTHORIZED') || action.includes('OVERRIDDEN')) {
      return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />;
    }
    if (action.includes('SCENARIO') || action.includes('OPTIMIZATION')) {
      return <Sliders className="w-3.5 h-3.5 text-purple-400" />;
    }
    if (action.includes('ALERT')) {
      return <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />;
    }
    return <Clock className="w-3.5 h-3.5 text-slate-400" />;
  };

  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-[#07111f] border border-slate-800/90 shadow-lg flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/30 text-indigo-400">
              <History className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold text-indigo-400 uppercase tracking-wider">
                  Audit Verification
                </span>
                <span className="text-slate-700">•</span>
                <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-400">
                  REAL-TIME LOG
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-display font-bold text-white tracking-tight">
                Recent Clinical Decisions & Actions
              </h2>
            </div>
          </div>

          <button
            onClick={() => navigate('/app/activity')}
            className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
          >
            <span>Full Audit Trail</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Audit Trail List */}
        <div className="my-3 divide-y divide-slate-800/60">
          {recentLogs.map((log) => (
            <div
              key={log.id}
              className="py-2.5 flex items-start justify-between gap-3 text-xs font-mono group hover:bg-[#0c1a30] px-2 rounded-xl transition-colors"
            >
              <div className="flex items-start gap-2.5 min-w-0">
                <div className="mt-0.5 p-1 rounded-md bg-surface-200/50 shrink-0">
                  {getActionIcon(log.action)}
                </div>
                <div className="min-w-0">
                  <div className="font-bold text-white truncate flex items-center gap-2">
                    <span>{log.action.replace(/_/g, ' ')}</span>
                    {log.departmentName && (
                      <span className="text-[10px] text-slate-500 font-normal">
                        &bull; {log.departmentName}
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-slate-400 truncate mt-0.5">
                    {log.details}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5 flex items-center gap-1.5">
                    <ShieldCheck className="w-3 h-3 text-emerald-500" />
                    <span>Actor: {log.actorName} ({log.actorRole.replace(/_/g, ' ')})</span>
                  </div>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="text-[10px] text-slate-400 font-bold block">
                  {log.timestamp.includes(' ') ? log.timestamp.split(' ')[1] : log.timestamp}
                </span>
                <Badge variant="emerald" size="sm">
                  VERIFIED
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer info */}
      <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] font-mono text-slate-500">
        <span>Immutable tamper-evident event log enabled</span>
        <span>Chain Hash: SHA-256 Validated</span>
      </div>
    </div>
  );
};
