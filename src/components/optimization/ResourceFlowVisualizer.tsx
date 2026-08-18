import React from 'react';
import { useSimStore } from '../../store/useSimStore';
import { Bed } from 'lucide-react';

export const ResourceFlowVisualizer: React.FC = () => {
  const departments = useSimStore((state) => state.departments);
  const optResult = useSimStore((state) => state.optResult);

  return (
    <div className="w-full bg-surface-100/90 rounded-2xl border border-slate-800 p-6 shadow-2xl">
      <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-800">
        <div>
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-teal-400 block mb-1">
            CROSS-DEPARTMENT RESOURCE ALLOCATION VECTOR
          </span>
          <span className="text-xs text-slate-400">
            Real-time MILP reallocation recommendations to prevent bottleneck propagation
          </span>
        </div>
        <span className="text-xs font-mono px-2.5 py-1 rounded bg-teal-500/10 text-teal-300 border border-teal-500/20">
          SOLVE TIME: {optResult.milpSolveTimeMs}ms
        </span>
      </div>

      {/* Department Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {departments.slice(0, 4).map((dept) => {
          const nurseDelta = optResult.recommendedNurseReallocation[dept.name.split(' ')[0]] || 0;
          const docDelta = optResult.recommendedDoctorReallocation[dept.name.split(' ')[0]] || 0;

          return (
            <div
              key={dept.id}
              className={`p-4 rounded-xl border transition-all duration-300 ${
                dept.status === 'critical'
                  ? 'bg-rose-950/20 border-rose-500/40 shadow-[0_0_15px_rgba(244,63,94,0.1)]'
                  : dept.status === 'warning'
                  ? 'bg-amber-950/20 border-amber-500/40'
                  : 'bg-surface-200/60 border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono font-bold text-white truncate max-w-[130px]">
                  {dept.name}
                </span>
                <span
                  className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                    dept.status === 'critical'
                      ? 'bg-rose-500/20 text-rose-300'
                      : dept.status === 'warning'
                      ? 'bg-amber-500/20 text-amber-300'
                      : 'bg-emerald-500/20 text-emerald-300'
                  }`}
                >
                  {dept.utilization}% OCCUPIED
                </span>
              </div>

              {/* Bed Utilization Bar */}
              <div className="w-full bg-surface-300 h-1.5 rounded-full overflow-hidden mb-3">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    dept.utilization > 90
                      ? 'bg-rose-500'
                      : dept.utilization > 80
                      ? 'bg-amber-500'
                      : 'bg-teal-400'
                  }`}
                  style={{ width: `${dept.utilization}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-3">
                <span className="flex items-center gap-1">
                  <Bed className="w-3.5 h-3.5 text-slate-500" />
                  <span>{dept.bedsOccupied}/{dept.bedCapacity} Beds</span>
                </span>
                <span>Active: {dept.activeStaff}</span>
              </div>

              {/* Recommended Reallocation Delta */}
              <div className="pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono">
                <span className="text-[11px] text-slate-400">Rebalance:</span>
                <div className="flex items-center gap-1.5">
                  {nurseDelta !== 0 && (
                    <span
                      className={`px-1.5 py-0.5 rounded font-bold ${
                        nurseDelta > 0
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {nurseDelta > 0 ? `+${nurseDelta}` : nurseDelta} Nurses
                    </span>
                  )}
                  {docDelta !== 0 && (
                    <span
                      className={`px-1.5 py-0.5 rounded font-bold ${
                        docDelta > 0
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {docDelta > 0 ? `+${docDelta}` : docDelta} MDs
                    </span>
                  )}
                  {nurseDelta === 0 && docDelta === 0 && (
                    <span className="text-slate-500 text-[11px]">Balanced</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
