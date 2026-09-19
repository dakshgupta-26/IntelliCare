import React from 'react';
import {
  CheckCircle2,
  ExternalLink,
  Check
} from 'lucide-react';
import { useAlertStore } from '../../store/useAlertStore';
import { useHospitalStore } from '../../store/useHospitalStore';
import { useRouterStore } from '../../store/useRouterStore';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';

export const AlertsPage: React.FC = () => {
  const alerts = useAlertStore((state) => state.alerts);
  const severityFilter = useAlertStore((state) => state.severityFilter);
  const setSeverityFilter = useAlertStore((state) => state.setSeverityFilter);
  const statusFilter = useAlertStore((state) => state.statusFilter);
  const setStatusFilter = useAlertStore((state) => state.setStatusFilter);
  const departmentFilter = useAlertStore((state) => state.departmentFilter);
  const setDepartmentFilter = useAlertStore((state) => state.setDepartmentFilter);
  const acknowledgeAlert = useAlertStore((state) => state.acknowledgeAlert);
  const resolveAlert = useAlertStore((state) => state.resolveAlert);
  const departments = useHospitalStore((state) => state.departments);
  const navigate = useRouterStore((state) => state.navigate);

  const filteredAlerts = alerts.filter((a) => {
    const matchesSev = severityFilter === 'ALL' || a.severity === severityFilter;
    const matchesStat = statusFilter === 'ALL' || a.status === statusFilter;
    const matchesDept = departmentFilter === 'all' || a.departmentId === departmentFilter;
    return matchesSev && matchesStat && matchesDept;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider font-bold">
              Real-Time Triage & Thresholds
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-xs font-mono text-slate-400">
              {alerts.filter((a) => a.status !== 'RESOLVED').length} Active Unresolved
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-white tracking-tight">
            Operational Alert Center
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Intelligent threshold alerts for bed saturation, staffing ratio breaches, and emergency arrival surges.
          </p>
        </div>
      </div>

      {/* 2. Severity Summary Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div
          onClick={() => setSeverityFilter(severityFilter === 'CRITICAL' ? 'ALL' : 'CRITICAL')}
          className={`p-5 rounded-2xl border transition-all cursor-pointer ${
            severityFilter === 'CRITICAL'
              ? 'bg-rose-500/15 border-rose-500/50 shadow-md'
              : 'bg-surface-100 dark:bg-[#0a1628] border-slate-700/80 dark:border-slate-800'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400">Critical Acuity Alerts</span>
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
          </div>
          <div className="text-2xl font-bold font-mono text-rose-400 mt-2">
            {alerts.filter((a) => a.severity === 'CRITICAL' && a.status !== 'RESOLVED').length}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">Requires immediate supervisor attention</span>
        </div>

        <div
          onClick={() => setSeverityFilter(severityFilter === 'WARNING' ? 'ALL' : 'WARNING')}
          className={`p-5 rounded-2xl border transition-all cursor-pointer ${
            severityFilter === 'WARNING'
              ? 'bg-amber-500/15 border-amber-500/50 shadow-md'
              : 'bg-surface-100 dark:bg-[#0a1628] border-slate-700/80 dark:border-slate-800'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400">Surge Warning Alerts</span>
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-amber-400 mt-2">
            {alerts.filter((a) => a.severity === 'WARNING' && a.status !== 'RESOLVED').length}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">Impending capacity bottleneck</span>
        </div>

        <div
          onClick={() => setSeverityFilter(severityFilter === 'INFO' ? 'ALL' : 'INFO')}
          className={`p-5 rounded-2xl border transition-all cursor-pointer ${
            severityFilter === 'INFO'
              ? 'bg-cyan-500/15 border-cyan-500/50 shadow-md'
              : 'bg-surface-100 dark:bg-[#0a1628] border-slate-700/80 dark:border-slate-800'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400">Operational Notices</span>
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-cyan-400 mt-2">
            {alerts.filter((a) => a.severity === 'INFO' && a.status !== 'RESOLVED').length}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">Scheduled maintenance and transfers</span>
        </div>
      </div>

      {/* 3. Filter Controls */}
      <div className="p-4 rounded-2xl bg-surface-100 dark:bg-[#0a1628] border border-slate-700/80 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-slate-400">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="bg-surface-200/80 dark:bg-[#07111f] border border-slate-700/80 rounded-xl py-1.5 px-3 text-slate-200 focus:outline-none"
          >
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="ACKNOWLEDGED">Acknowledged</option>
            <option value="RESOLVED">Resolved</option>
          </select>

          <span className="text-slate-400 ml-2">Department:</span>
          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="bg-surface-200/80 dark:bg-[#07111f] border border-slate-700/80 rounded-xl py-1.5 px-3 text-slate-200 focus:outline-none"
          >
            <option value="all">All Departments</option>
            {departments.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={() => {
            setSeverityFilter('ALL');
            setStatusFilter('ALL');
            setDepartmentFilter('all');
          }}
          className="text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer"
        >
          Clear Filters
        </button>
      </div>

      {/* 4. Alerts List */}
      <div className="space-y-3">
        {filteredAlerts.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-surface-100 dark:bg-[#0a1628] border border-slate-700/80 dark:border-slate-800 text-slate-400">
            <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-slate-600" />
            <p className="text-sm font-medium text-slate-300">No alerts found</p>
            <p className="text-xs text-slate-500 mt-1">All thresholds within nominal limits.</p>
          </div>
        ) : (
          filteredAlerts.map((alt) => (
            <div
              key={alt.id}
              className={`p-5 rounded-2xl bg-surface-100 dark:bg-[#0a1628] border transition-all space-y-3 ${
                alt.status === 'RESOLVED'
                  ? 'opacity-60 border-slate-800'
                  : alt.severity === 'CRITICAL'
                  ? 'border-rose-500/40 shadow-lg'
                  : 'border-slate-700/80 dark:border-slate-800'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <span
                    className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                      alt.severity === 'CRITICAL'
                        ? 'bg-rose-500 animate-ping'
                        : alt.severity === 'WARNING'
                        ? 'bg-amber-400'
                        : 'bg-cyan-400'
                    }`}
                  />
                  <h3 className="text-sm font-bold text-white truncate">
                    {alt.title}
                  </h3>
                  <Badge
                    variant={alt.severity === 'CRITICAL' ? 'rose' : alt.severity === 'WARNING' ? 'amber' : 'cyan'}
                    size="sm"
                  >
                    {alt.severity}
                  </Badge>
                </div>

                <span className="text-[11px] font-mono text-slate-400">
                  {alt.createdAt} • {alt.departmentName}
                </span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                {alt.description}
              </p>

              {/* Suggested Action Pill */}
              {alt.suggestedAction && (
                <div className="p-2.5 rounded-xl bg-surface-200/50 dark:bg-[#07111f] border border-slate-800 text-[11px] font-mono text-cyan-300 flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>Action: {alt.suggestedAction}</span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
                <div className="text-[11px] font-mono text-slate-400">
                  {alt.status === 'ACKNOWLEDGED' && (
                    <span>Acknowledged by {alt.acknowledgedBy} ({alt.acknowledgedAt})</span>
                  )}
                  {alt.status === 'RESOLVED' && (
                    <span className="text-emerald-400">Resolved by {alt.resolvedBy}</span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {alt.targetUrl && (
                    <button
                      onClick={() => navigate(alt.targetUrl!)}
                      className="px-3 py-1 text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
                    >
                      <span>Inspect Entity</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  )}

                  {alt.status === 'ACTIVE' && (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => acknowledgeAlert(alt.id)}
                    >
                      Acknowledge
                    </Button>
                  )}

                  {alt.status !== 'RESOLVED' && (
                    <Button
                      variant="primary"
                      size="sm"
                      icon={<Check className="w-3.5 h-3.5" />}
                      onClick={() => resolveAlert(alt.id)}
                    >
                      Mark Resolved
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
