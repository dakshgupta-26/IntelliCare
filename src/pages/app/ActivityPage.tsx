import React, { useState } from 'react';
import {
  ShieldCheck,
  Search
} from 'lucide-react';
import { INITIAL_AUDIT_LOGS } from '../../data/mockDatabase';
import { AuditActionType } from '../../types/activity';
import { Badge } from '../../components/ui/Badge';

export const ActivityPage: React.FC = () => {
  const logs = INITIAL_AUDIT_LOGS;
  const [searchQuery, setSearchQuery] = useState('');
  const [actionFilter, setActionFilter] = useState<string>('ALL');

  const filteredLogs = logs.filter((l) => {
    const matchesSearch =
      searchQuery === '' ||
      l.actorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.action.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesAction = actionFilter === 'ALL' || l.action === actionFilter;
    return matchesSearch && matchesAction;
  });

  const getActionBadge = (action: AuditActionType) => {
    switch (action) {
      case 'RECOMMENDATION_APPROVED':
        return <Badge variant="emerald" size="sm">RECOMMENDATION SIGNED OFF</Badge>;
      case 'OPTIMIZATION_EXECUTED':
        return <Badge variant="cyan" size="sm">OR-TOOLS SOLVER RUN</Badge>;
      case 'SCENARIO_SIMULATED':
        return <Badge variant="purple" size="sm">SANDBOX SIMULATION</Badge>;
      case 'RESOURCE_OVERRIDDEN':
        return <Badge variant="amber" size="sm">MANUAL OVERRIDE</Badge>;
      default:
        return <Badge variant="slate" size="sm">{action}</Badge>;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider font-bold">
              Compliance & Non-Repudiation
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-xs font-mono text-slate-400">
              SHA-256 Tamper-Evident Ledger
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-white tracking-tight">
            Activity & Audit Ledger
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Immutable chronological record of all supervisor decisions, optimization runs, scenario simulations, and resource reallocations.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs font-mono text-emerald-400 shrink-0">
          <ShieldCheck className="w-4 h-4" />
          <span>CRYPTOGRAPHIC HASH CHAIN VERIFIED</span>
        </div>
      </div>

      {/* 2. Filter & Search Controls */}
      <div className="p-4 rounded-2xl bg-surface-100 dark:bg-[#0a1628] border border-slate-700/80 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search audit logs by actor, action, or details..."
            className="w-full bg-surface-200/60 dark:bg-[#07111f] border border-slate-700/80 dark:border-slate-800 rounded-xl py-2 pl-10 pr-4 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-cyan/40"
          />
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="text-slate-400">Action:</span>
          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="bg-surface-200/80 dark:bg-[#07111f] border border-slate-700/80 rounded-xl py-1.5 px-3 text-slate-200 focus:outline-none"
          >
            <option value="ALL">All Actions</option>
            <option value="RECOMMENDATION_APPROVED">Recommendation Approvals</option>
            <option value="OPTIMIZATION_EXECUTED">Optimization Runs</option>
            <option value="SCENARIO_SIMULATED">Scenario Simulations</option>
            <option value="RESOURCE_OVERRIDDEN">Resource Overrides</option>
          </select>
        </div>
      </div>

      {/* 3. Audit Records Table */}
      <div className="rounded-2xl bg-surface-100 dark:bg-[#0a1628] border border-slate-700/80 dark:border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-surface-200/40 text-[11px] font-mono uppercase text-slate-400">
                <th className="py-3.5 px-4">Timestamp & Hash</th>
                <th className="py-3.5 px-4">Actor</th>
                <th className="py-3.5 px-4">Action</th>
                <th className="py-3.5 px-4">Department & Target</th>
                <th className="py-3.5 px-4">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-surface-200/40 transition-colors">
                  {/* Timestamp & Hash */}
                  <td className="py-3.5 px-4 font-mono">
                    <span className="text-white font-bold block">{log.timestamp}</span>
                    <span className="text-[10px] text-slate-500 truncate max-w-[120px] block" title={log.cryptographicHash}>
                      SHA: {log.cryptographicHash.slice(0, 12)}...
                    </span>
                  </td>

                  {/* Actor */}
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-white">{log.actorName}</div>
                    <span className="text-[10px] font-mono text-cyan-400">{log.actorRole}</span>
                  </td>

                  {/* Action */}
                  <td className="py-3.5 px-4">
                    {getActionBadge(log.action)}
                  </td>

                  {/* Department */}
                  <td className="py-3.5 px-4 font-mono text-slate-300">
                    <div>{log.departmentName || 'Hospital-Wide'}</div>
                    <span className="text-[10px] text-slate-500">{log.targetEntityType} #{log.targetEntityId}</span>
                  </td>

                  {/* Details */}
                  <td className="py-3.5 px-4 text-slate-300 max-w-xs leading-relaxed">
                    {log.details}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
