import React, { useState } from 'react';
import {
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { useHospitalStore } from '../../store/useHospitalStore';
import { Badge } from '../../components/ui/Badge';

export const AnalyticsPage: React.FC = () => {
  const departments = useHospitalStore((state) => state.departments);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('7d');

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider font-bold">
              Operational Retrospective & Intelligence
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-xs font-mono text-slate-400">
              30-Day Aggregated Rolling Window
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-white tracking-tight">
            Operational Analytics
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Narrative insights into resource utilization trends, forecast calibration accuracy, and OR-Tools optimization solver impact.
          </p>
        </div>

        {/* Time range filters */}
        <div className="flex items-center gap-2 bg-surface-100 dark:bg-[#0a1628] p-1 rounded-xl border border-slate-800 shrink-0 text-xs font-mono">
          {(['7d', '30d', '90d'] as const).map((r) => (
            <button
              key={r}
              onClick={() => setTimeRange(r)}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                timeRange === r
                  ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Past {r.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Narrative Insight Cards: What is happening? Why is it happening? */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Narrative Card 1 */}
        <div className="p-6 rounded-3xl bg-surface-100 dark:bg-[#0a1628] border border-slate-700/80 dark:border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-cyan-400 font-bold uppercase">ICU Bed Pressure</span>
            <div className="flex items-center text-rose-400 text-xs font-mono font-bold">
              <ArrowUpRight className="w-4 h-4" />
              <span>+8.4%</span>
            </div>
          </div>
          <h3 className="text-lg font-display font-bold text-white">
            ICU utilization climbed to 90.6% average over peak evening shifts.
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Correlated with a 14% increase in post-surgical high-acuity step-downs. Pre-emptive PACU discharge acceleration reduced overflow risk by 62%.
          </p>
        </div>

        {/* Narrative Card 2 */}
        <div className="p-6 rounded-3xl bg-surface-100 dark:bg-[#0a1628] border border-slate-700/80 dark:border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-teal-400 font-bold uppercase">Solver Impact</span>
            <div className="flex items-center text-emerald-400 text-xs font-mono font-bold">
              <ArrowDownRight className="w-4 h-4" />
              <span>-52 mins</span>
            </div>
          </div>
          <h3 className="text-lg font-display font-bold text-white">
            Average ED triage wait time decreased by 52 minutes during surge windows.
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            By shifting 4 floater nurses from Inpatient General Medicine during the 18:00–22:00 peak, triage queue backlogs were successfully prevented.
          </p>
        </div>

        {/* Narrative Card 3 */}
        <div className="p-6 rounded-3xl bg-surface-100 dark:bg-[#0a1628] border border-slate-700/80 dark:border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-indigo-400 font-bold uppercase">Forecast Reliability</span>
            <Badge variant="cyan" size="sm">94.8% ACCURACY</Badge>
          </div>
          <h3 className="text-lg font-display font-bold text-white">
            LSTM multi-horizon neural forecasting maintained 2.38 pts MAE.
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Conformal prediction intervals (95% CI) bounded 96.2% of actual patient presentations across all 5 operational clinical departments.
          </p>
        </div>
      </div>

      {/* 3. Primary Multi-Department Utilization Comparison Visual */}
      <div className="p-6 rounded-3xl bg-surface-100 dark:bg-[#0a1628] border border-slate-700/80 dark:border-slate-800 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-lg font-display font-bold text-white tracking-tight">
              Department Utilization & Surge Capacity Variance
            </h3>
            <p className="text-xs font-mono text-slate-400">
              Cross-department comparison of active census vs statutory capacity bounds
            </p>
          </div>
        </div>

        {/* Department Visual Bars */}
        <div className="space-y-4 pt-2">
          {departments.map((d) => (
            <div key={d.id} className="p-4 rounded-2xl bg-surface-200/40 dark:bg-[#07111f] border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white">{d.name}</span>
                  <span className="text-slate-500">({d.code})</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-slate-400">{d.occupiedBeds} of {d.totalBeds} beds occupied</span>
                  <span className={`font-bold ${d.utilizationRate >= 90 ? 'text-rose-400' : d.utilizationRate >= 75 ? 'text-amber-400' : 'text-cyan-400'}`}>
                    {d.utilizationRate}%
                  </span>
                </div>
              </div>

              <div className="h-3 bg-surface-300 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    d.utilizationRate >= 90
                      ? 'bg-gradient-to-r from-amber-500 to-rose-500'
                      : d.utilizationRate >= 75
                      ? 'bg-gradient-to-r from-teal-400 to-amber-400'
                      : 'bg-gradient-to-r from-cyan-400 to-teal-400'
                  }`}
                  style={{ width: `${Math.min(100, d.utilizationRate)}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 pt-1">
                <span>Active Staff: {d.activeStaff} / {d.requiredStaff}</span>
                <span>Acuity Index: {d.acuityScore} / 5.0</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
