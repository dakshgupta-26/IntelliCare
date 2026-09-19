import React, { useState } from 'react';
import { FileText, Search, ShieldCheck, Hash, Clock, User, ArrowUpRight } from 'lucide-react';
import { INITIAL_AUDIT_LOGS } from '../../../../data/mockDatabase';
import { AuditLogRecord } from '../../../../types/activity';
import { Drawer } from '../../../ui/Drawer';

export const AuditLogSection: React.FC = () => {
  const [logs] = useState<AuditLogRecord[]>(INITIAL_AUDIT_LOGS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [inspectingLog, setInspectingLog] = useState<AuditLogRecord | null>(null);

  const filteredLogs = logs.filter((log) => {
    const matchesCategory = selectedCategory === 'ALL' || log.action.includes(selectedCategory);
    const matchesSearch =
      searchQuery === '' ||
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.actorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.details.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header & Filter Bar */}
      <div className="p-6 rounded-3xl bg-[#070D1A] border border-white/[0.08] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/[0.06]">
          <div>
            <h3 className="text-base font-display font-bold text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-cyan-400" />
              <span>Immutable Governance & Decision Audit Trail</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Tamper-evident record of all solver runs, recommendation approvals, and manual overrides.
            </p>
          </div>

          <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold flex items-center gap-1.5 self-start sm:self-auto">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Cryptographically Verified</span>
          </span>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search audit actions, clinicians, or entity IDs..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-black/40 border border-white/[0.08] rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 font-mono"
            />
          </div>

          <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto custom-scrollbar pb-1 sm:pb-0">
            {['ALL', 'OPTIMIZATION', 'RECOMMENDATION', 'SCENARIO', 'RESOURCE'].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 text-xs font-mono rounded-xl border transition-colors cursor-pointer shrink-0 ${
                  selectedCategory === cat
                    ? 'bg-cyan-500/15 border-cyan-500/30 text-cyan-300 font-bold'
                    : 'bg-black/30 border-white/[0.06] text-slate-400 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Audit Log Rows */}
        <div className="space-y-2.5 pt-1">
          {filteredLogs.map((log) => (
            <div
              key={log.id}
              onClick={() => setInspectingLog(log)}
              className="p-4 rounded-2xl bg-black/40 border border-white/[0.06] hover:border-cyan-500/30 transition-all cursor-pointer group flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-xs font-mono text-cyan-300">
                    {log.action}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.06] text-slate-400">
                    {log.targetEntityType} #{log.targetEntityId}
                  </span>
                </div>

                <p className="text-xs text-slate-300 font-sans leading-relaxed">
                  {log.details}
                </p>

                <div className="flex items-center gap-3 text-[11px] font-mono text-slate-400 flex-wrap">
                  <span className="flex items-center gap-1">
                    <User className="w-3 h-3 text-slate-500" />
                    <span className="text-slate-200">{log.actorName}</span> ({log.actorRole})
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-500" />
                    <span>{log.timestamp}</span>
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 self-end sm:self-center text-xs font-mono text-slate-400 group-hover:text-cyan-400 transition-colors">
                <span>Inspect Record</span>
                <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Audit Detail Drawer */}
      {inspectingLog && (
        <Drawer
          isOpen={true}
          onClose={() => setInspectingLog(null)}
          title={`Audit Record #${inspectingLog.id}`}
          subtitle={`Action: ${inspectingLog.action} • Timestamp: ${inspectingLog.timestamp}`}
        >
          <div className="space-y-5 text-xs font-mono">
            <div className="p-4 rounded-2xl bg-black/40 border border-white/[0.08] space-y-2">
              <span className="text-slate-400 uppercase text-[10px] block">Actor Attribution</span>
              <div className="text-sm font-bold text-white">{inspectingLog.actorName}</div>
              <div className="text-slate-400">Email: {inspectingLog.actorEmail}</div>
              <div className="text-cyan-400">Role: {inspectingLog.actorRole}</div>
              <div className="text-slate-400">Origin IP: {inspectingLog.ipAddress}</div>
            </div>

            <div className="p-4 rounded-2xl bg-black/40 border border-white/[0.08] space-y-2">
              <span className="text-slate-400 uppercase text-[10px] block">Target Entity & Scope</span>
              <div className="text-white font-bold">{inspectingLog.targetEntityType} ({inspectingLog.targetEntityId})</div>
              <div className="text-slate-300 font-sans">{inspectingLog.details}</div>
              <div className="text-slate-400">Department: {inspectingLog.departmentName}</div>
            </div>

            <div className="p-4 rounded-2xl bg-black/40 border border-cyan-500/25 space-y-2">
              <span className="text-cyan-400 uppercase text-[10px] block font-bold flex items-center gap-1.5">
                <Hash className="w-3.5 h-3.5" />
                <span>Cryptographic SHA-256 Signature</span>
              </span>
              <div className="p-2.5 rounded-xl bg-black/60 border border-white/[0.06] text-[11px] text-emerald-400 break-all select-all font-mono">
                {inspectingLog.cryptographicHash}
              </div>
              <span className="text-[10px] text-slate-400 block">
                Verification: Validated in immutable merkle tree.
              </span>
            </div>
          </div>
        </Drawer>
      )}
    </div>
  );
};
