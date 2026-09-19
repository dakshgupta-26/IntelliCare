import React from 'react';
import {
  Bed,
  Users,
  Cpu,
  ChevronRight
} from 'lucide-react';
import { useRouterStore } from '../../../store/useRouterStore';
import { Badge } from '../../ui/Badge';

export const ResourcePressureSection: React.FC = () => {
  const navigate = useRouterStore((state) => state.navigate);

  // Bed metrics
  const totalBeds = 240;
  const occupiedBeds = 212;
  const availableBeds = 28;
  const reservedBeds = 12;
  const projectedDemandBeds = 18;

  const occupiedPct = ((occupiedBeds / totalBeds) * 100).toFixed(1);
  const availablePct = ((availableBeds / totalBeds) * 100).toFixed(1);
  const reservedPct = ((reservedBeds / totalBeds) * 100).toFixed(1);

  // Staff metrics
  const availableStaff = 82;
  const requiredStaff = 89;
  const staffGap = requiredStaff - availableStaff;
  const overtimeRisk = 'Medium (2 Floaters on Standby)';

  // Equipment telemetry
  const equipment = [
    { name: 'ICU Ventilators', inUse: 24, available: 2, maintenance: 2, total: 28, critical: true },
    { name: 'Patient Monitors', inUse: 29, available: 3, maintenance: 0, total: 32, critical: false },
    { name: 'Infusion Pumps', inUse: 68, available: 12, maintenance: 0, total: 80, critical: false },
    { name: 'CT Scanners', inUse: 2, available: 0, maintenance: 0, total: 2, critical: true },
    { name: '3T MRI Units', inUse: 1, available: 0, maintenance: 0, total: 1, critical: false }
  ];

  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-[#07111f] border border-slate-800/90 shadow-lg flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-wider">
                Multi-Asset Balancing
              </span>
              <span className="text-slate-700">•</span>
              <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-400">
                SIMULATED DATA
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-display font-bold text-white tracking-tight">
              Resource Pressure & Bottlenecks
            </h2>
          </div>

          <button
            onClick={() => navigate('/app/resources')}
            className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
          >
            <span>All Assets ({totalBeds + 143})</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 3-Column Resource Intelligence Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 mt-3.5">
          {/* 1. Bed Capacity Breakdown */}
          <div className="p-3.5 rounded-xl bg-[#0a1628] border border-slate-800/90 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-1 mb-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                  <Bed className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Bed Capacity Distribution</span>
                </div>
                <Badge variant="amber" size="sm">
                  88.3% OCC
                </Badge>
              </div>

              {/* Segmented Capacity Bar */}
              <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden flex my-2">
                <div
                  className="h-full bg-cyan-500 transition-all"
                  style={{ width: `${occupiedPct}%` }}
                  title={`Occupied: ${occupiedBeds} beds (${occupiedPct}%)`}
                />
                <div
                  className="h-full bg-amber-400 transition-all"
                  style={{ width: `${reservedPct}%` }}
                  title={`Reserved: ${reservedBeds} beds (${reservedPct}%)`}
                />
                <div
                  className="h-full bg-emerald-400 transition-all"
                  style={{ width: `${availablePct}%` }}
                  title={`Available: ${availableBeds} beds (${availablePct}%)`}
                />
              </div>

              {/* Legend Metrics */}
              <div className="grid grid-cols-3 gap-1 pt-2 text-[10px] font-mono border-t border-slate-800">
                <div>
                  <span className="text-slate-400 block">Occupied</span>
                  <strong className="text-cyan-400">{occupiedBeds}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block">Reserved</span>
                  <strong className="text-amber-400">{reservedBeds}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block">Available</span>
                  <strong className="text-emerald-400">{availableBeds}</strong>
                </div>
              </div>
            </div>

            <div className="mt-3 p-2 rounded-lg bg-surface-200/40 text-[10px] font-mono text-slate-300 flex items-center justify-between">
              <span>Forecast Intake Surge:</span>
              <span className="text-rose-400 font-bold">+{projectedDemandBeds} Beds Required</span>
            </div>
          </div>

          {/* 2. Staff Utilization & Gap */}
          <div className="p-3.5 rounded-xl bg-[#0a1628] border border-slate-800/90 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-1 mb-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                  <Users className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Staffing Ratios & Gaps</span>
                </div>
                <Badge variant="rose" size="sm">
                  -7 DEFICIT
                </Badge>
              </div>

              {/* Staff Gap Visual Bar */}
              <div className="my-2 space-y-1.5 text-xs font-mono">
                <div className="flex justify-between text-slate-300">
                  <span>Available on Shift:</span>
                  <strong className="text-white">{availableStaff} Nurses</strong>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Required per Patient Load:</span>
                  <strong className="text-rose-400">{requiredStaff} Nurses</strong>
                </div>

                {/* Gap Visual Bar */}
                <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden flex">
                  <div
                    className="h-full bg-indigo-500"
                    style={{ width: `${(availableStaff / requiredStaff) * 100}%` }}
                  />
                  <div
                    className="h-full bg-rose-500 animate-pulse"
                    style={{ width: `${(staffGap / requiredStaff) * 100}%` }}
                  />
                </div>
              </div>

              <div className="text-[10px] font-mono text-slate-400 pt-1">
                Acute Care Deficit: <strong className="text-rose-400">7 Critical Care Nurses</strong>
              </div>
            </div>

            <div className="mt-3 p-2 rounded-lg bg-surface-200/40 text-[10px] font-mono text-slate-300 flex items-center justify-between">
              <span>Overtime Pressure:</span>
              <span className="text-amber-400 font-bold">{overtimeRisk}</span>
            </div>
          </div>

          {/* 3. Critical Equipment */}
          <div className="p-3.5 rounded-xl bg-[#0a1628] border border-slate-800/90 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-1 mb-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                  <Cpu className="w-3.5 h-3.5 text-teal-400" />
                  <span>Critical Equipment Pool</span>
                </div>
                <Badge variant="teal" size="sm">
                  88.5% LOAD
                </Badge>
              </div>

              <div className="space-y-1.5 text-[11px] font-mono">
                {equipment.map((eq, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between text-slate-300 py-0.5 border-b border-slate-800/50"
                  >
                    <span className="text-slate-300">{eq.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-cyan-400 font-bold">{eq.inUse}/{eq.total}</span>
                      {eq.maintenance > 0 ? (
                        <span className="text-[10px] text-amber-400">({eq.maintenance} maint)</span>
                      ) : eq.available === 0 ? (
                        <span className="text-[10px] text-rose-400 font-bold">0 avail</span>
                      ) : (
                        <span className="text-[10px] text-emerald-400">({eq.available} avail)</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-2 text-[10px] font-mono text-slate-400 flex items-center justify-between">
              <span>Preventive Service:</span>
              <span className="text-slate-300">All Scheduled On Track</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
