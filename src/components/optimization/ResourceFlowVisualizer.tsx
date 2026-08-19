import React from 'react';
import { useSimStore } from '../../store/useSimStore';
import { Bed, Users } from 'lucide-react';

export const ResourceFlowVisualizer: React.FC = () => {
  const departments = useSimStore((state) => state.departments);
  const optResult = useSimStore((state) => state.optResult);

  return (
    <div className="w-full bg-surface-100/90 rounded-3xl border border-slate-800 p-6 sm:p-8 shadow-2xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-6 border-b border-slate-800 gap-2">
        <div>
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-teal-400 block mb-1">
            CROSS-DEPARTMENT RESOURCE ALLOCATION VECTORS
          </span>
          <span className="text-xs text-slate-400">
            Real-time MILP rebalance vectors dynamically neutralizing clinical bottlenecks
          </span>
        </div>
        <span className="text-xs font-mono px-3 py-1 rounded-full bg-teal-500/10 text-teal-300 border border-teal-500/30 shrink-0">
          SOLVER CONVERGENCE: {optResult.milpSolveTimeMs}ms
        </span>
      </div>

      {/* 4 Department Rebalancing Nodes Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {departments.slice(0, 4).map((dept) => {
          const nurseDelta = optResult.recommendedNurseReallocation[dept.name.split(' ')[0]] || 0;
          const docDelta = optResult.recommendedDoctorReallocation[dept.name.split(' ')[0]] || 0;

          return (
            <div
              key={dept.id}
              className={`p-5 rounded-2xl border transition-all duration-300 flex flex-col justify-between ${
                dept.status === 'critical'
                  ? 'bg-rose-950/25 border-rose-500/40 shadow-[0_0_20px_rgba(244,63,94,0.12)]'
                  : dept.status === 'warning'
                  ? 'bg-amber-950/20 border-amber-500/40'
                  : 'bg-surface-200/60 border-slate-800'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono font-bold text-white truncate max-w-[130px]">
                    {dept.name}
                  </span>
                  <span
                    className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                      dept.status === 'critical'
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        : dept.status === 'warning'
                        ? 'bg-amber-500/20 text-amber-300'
                        : 'bg-emerald-500/20 text-emerald-300'
                    }`}
                  >
                    {dept.utilization}% OCCUPIED
                  </span>
                </div>

                {/* Utilization Progress Bar */}
                <div className="w-full bg-surface-300 h-2 rounded-full overflow-hidden mb-4">
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
                  <span className="flex items-center gap-1.5">
                    <Bed className="w-3.5 h-3.5 text-slate-500" />
                    <span>{dept.bedsOccupied}/{dept.bedCapacity} Beds</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-slate-500" />
                    <span>{dept.activeStaff} Staff</span>
                  </span>
                </div>
              </div>

              {/* Rebalance Vector Delta */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-mono">
                <span className="text-[11px] text-slate-400">Rebalance:</span>
                <div className="flex items-center gap-1.5">
                  {nurseDelta !== 0 && (
                    <span
                      className={`px-2 py-0.5 rounded font-bold ${
                        nurseDelta > 0
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {nurseDelta > 0 ? `+${nurseDelta}` : nurseDelta} RNs
                    </span>
                  )}
                  {docDelta !== 0 && (
                    <span
                      className={`px-2 py-0.5 rounded font-bold ${
                        docDelta > 0
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {docDelta > 0 ? `+${docDelta}` : docDelta} MDs
                    </span>
                  )}
                  {nurseDelta === 0 && docDelta === 0 && (
                    <span className="text-slate-500 text-[11px]">Equilibrium</span>
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
