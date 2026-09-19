import React, { useState } from 'react';
import {
  Activity,
  Layers,
  Table as TableIcon,
  ChevronRight
} from 'lucide-react';
import { useHospitalStore } from '../../../store/useHospitalStore';
import { useRouterStore } from '../../../store/useRouterStore';
import { Badge } from '../../ui/Badge';

interface DepartmentItem {
  id: string;
  code: string;
  name: string;
  shortName: string;
  occupancy: number;
  totalBeds: number;
  availableBeds: number;
  activeStaff: number;
  requiredStaff: number;
  staffPercent: number;
  acuity: 'Critical' | 'High' | 'Elevated' | 'Normal';
  trend: 'up' | 'down' | 'stable';
  status: 'High Pressure' | 'Surge Watch' | 'Stable' | 'Optimal';
  statusVariant: 'rose' | 'amber' | 'teal' | 'emerald';
}

const DEPARTMENTS_EXTENDED: DepartmentItem[] = [
  {
    id: 'dept-icu',
    code: 'ICU-MED',
    name: 'Intensive Care Unit',
    shortName: 'ICU',
    occupancy: 92.4,
    totalBeds: 32,
    availableBeds: 3,
    activeStaff: 22,
    requiredStaff: 26,
    staffPercent: 84.6,
    acuity: 'Critical',
    trend: 'up',
    status: 'High Pressure',
    statusVariant: 'rose'
  },
  {
    id: 'dept-er',
    code: 'ED-TRAUMA',
    name: 'Emergency & Trauma',
    shortName: 'ED',
    occupancy: 93.8,
    totalBeds: 48,
    availableBeds: 3,
    activeStaff: 28,
    requiredStaff: 34,
    staffPercent: 82.4,
    acuity: 'High',
    trend: 'up',
    status: 'High Pressure',
    statusVariant: 'rose'
  },
  {
    id: 'dept-ward-a',
    code: 'WARD-A',
    name: 'Ward A (General Medicine)',
    shortName: 'Ward A',
    occupancy: 84.2,
    totalBeds: 60,
    availableBeds: 10,
    activeStaff: 22,
    requiredStaff: 24,
    staffPercent: 91.7,
    acuity: 'Elevated',
    trend: 'up',
    status: 'Surge Watch',
    statusVariant: 'amber'
  },
  {
    id: 'dept-ward-b',
    code: 'WARD-B',
    name: 'Ward B (Step-Down Telemetry)',
    shortName: 'Ward B',
    occupancy: 78.3,
    totalBeds: 40,
    availableBeds: 9,
    activeStaff: 18,
    requiredStaff: 19,
    staffPercent: 94.7,
    acuity: 'Normal',
    trend: 'stable',
    status: 'Stable',
    statusVariant: 'teal'
  },
  {
    id: 'dept-ot',
    code: 'OR-PACU',
    name: 'Operating Theatres & PACU',
    shortName: 'OR',
    occupancy: 75.0,
    totalBeds: 16,
    availableBeds: 4,
    activeStaff: 18,
    requiredStaff: 18,
    staffPercent: 100,
    acuity: 'Normal',
    trend: 'stable',
    status: 'Optimal',
    statusVariant: 'emerald'
  },
  {
    id: 'dept-diag',
    code: 'DIAG-RAD',
    name: 'Radiology & Diagnostics',
    shortName: 'Diagnostics',
    occupancy: 86.5,
    totalBeds: 12,
    availableBeds: 2,
    activeStaff: 14,
    requiredStaff: 16,
    staffPercent: 87.5,
    acuity: 'Elevated',
    trend: 'up',
    status: 'Surge Watch',
    statusVariant: 'amber'
  },
  {
    id: 'dept-pharm',
    code: 'PHARM-INF',
    name: 'Central Pharmacy & Infusion',
    shortName: 'Pharmacy',
    occupancy: 68.0,
    totalBeds: 8,
    availableBeds: 3,
    activeStaff: 12,
    requiredStaff: 12,
    staffPercent: 100,
    acuity: 'Normal',
    trend: 'stable',
    status: 'Optimal',
    statusVariant: 'emerald'
  }
];

export const OperationsOverview: React.FC = () => {
  const [viewMode, setViewMode] = useState<'network' | 'table'>('network');
  const [selectedDeptId, setSelectedDeptId] = useState<string>('dept-icu');
  const setSelectedDepartmentId = useHospitalStore((state) => state.setSelectedDepartmentId);
  const navigate = useRouterStore((state) => state.navigate);

  const selectedDept = DEPARTMENTS_EXTENDED.find((d) => d.id === selectedDeptId) || DEPARTMENTS_EXTENDED[0];

  const handleSelectDepartment = (id: string) => {
    setSelectedDeptId(id);
    setSelectedDepartmentId(id);
  };

  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-[#07111f] border border-slate-800/90 shadow-lg flex flex-col justify-between h-full">
      {/* Header */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-wider">
                Live Capacity Telemetry
              </span>
              <span className="text-slate-700">•</span>
              <span className="text-[10px] font-mono text-slate-400">7 ACTIVE UNITS</span>
              <span className="text-slate-700">•</span>
              <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-400">
                SIMULATED DATA
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-display font-bold text-white tracking-tight">
              Hospital Operations Overview
            </h2>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-1 bg-[#050c18] p-1 rounded-xl border border-slate-800 shrink-0">
            <button
              onClick={() => setViewMode('network')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                viewMode === 'network'
                  ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Network Grid</span>
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <TableIcon className="w-3.5 h-3.5" />
              <span>Metrics Table</span>
            </button>
          </div>
        </div>

        {/* Dynamic View: Network Grid or Table */}
        {viewMode === 'network' ? (
          <div className="mt-3.5 grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-2.5">
            {DEPARTMENTS_EXTENDED.map((dept) => {
              const isSelected = dept.id === selectedDeptId;
              return (
                <div
                  key={dept.id}
                  onClick={() => handleSelectDepartment(dept.id)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-cyan-950/30 border-cyan-500/60 shadow-[0_0_15px_rgba(22,199,243,0.15)] ring-1 ring-cyan-500/30'
                      : 'bg-[#0a1628] border-slate-800/90 hover:border-slate-700 hover:bg-[#0c1a30]'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="text-xs font-mono font-bold text-white truncate">
                        {dept.shortName}
                      </span>
                      <Badge variant={dept.statusVariant} size="sm">
                        {dept.occupancy}%
                      </Badge>
                    </div>
                    <div className="text-[10px] text-slate-400 truncate mb-2">
                      {dept.name}
                    </div>
                  </div>

                  <div className="space-y-1 pt-2 border-t border-slate-800/80 text-[10px] font-mono">
                    <div className="flex justify-between text-slate-400">
                      <span>Avail Beds:</span>
                      <span className={dept.availableBeds <= 3 ? 'text-rose-400 font-bold' : 'text-slate-200'}>
                        {dept.availableBeds} beds
                      </span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Staffing:</span>
                      <span className={dept.activeStaff < dept.requiredStaff ? 'text-amber-400 font-bold' : 'text-slate-200'}>
                        {dept.activeStaff}/{dept.requiredStaff} ({dept.staffPercent}%)
                      </span>
                    </div>
                    <div className="flex justify-between items-center pt-0.5">
                      <span className="text-slate-500">Acuity: {dept.acuity}</span>
                      <span className={dept.trend === 'up' ? 'text-rose-400 font-bold' : 'text-slate-400'}>
                        {dept.trend === 'up' ? '↑' : '→'}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Quick Summary Card */}
            <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-950/40 to-[#0a1628] border border-indigo-500/30 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-mono text-indigo-300 font-bold uppercase tracking-wider block mb-1">
                  Cross-Unit Status
                </span>
                <div className="text-xs text-slate-300 leading-relaxed">
                  2 departments under critical pressure. 24h bed transfer constraints active.
                </div>
              </div>
              <button
                onClick={() => navigate('/app/resources')}
                className="mt-2 text-[11px] font-mono text-cyan-400 hover:text-cyan-300 flex items-center justify-between cursor-pointer"
              >
                <span>Full Telemetry</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ) : (
          /* Table View */
          <div className="mt-3.5 overflow-x-auto custom-scrollbar">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="text-slate-400 border-b border-slate-800 text-[11px]">
                  <th className="pb-2 font-medium">Department</th>
                  <th className="pb-2 font-medium">Occupancy</th>
                  <th className="pb-2 font-medium">Available Beds</th>
                  <th className="pb-2 font-medium">Staff Ratio</th>
                  <th className="pb-2 font-medium">Acuity</th>
                  <th className="pb-2 font-medium">Trend</th>
                  <th className="pb-2 font-medium text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {DEPARTMENTS_EXTENDED.map((dept) => (
                  <tr
                    key={dept.id}
                    onClick={() => handleSelectDepartment(dept.id)}
                    className={`hover:bg-[#0c1a30] transition-colors cursor-pointer ${
                      dept.id === selectedDeptId ? 'bg-cyan-950/20' : ''
                    }`}
                  >
                    <td className="py-2.5 font-bold text-white pr-2">
                      <div>{dept.name}</div>
                      <div className="text-[10px] text-slate-500">{dept.code}</div>
                    </td>
                    <td className="py-2.5 font-bold text-white">
                      {dept.occupancy}%
                    </td>
                    <td className="py-2.5">
                      <span className={dept.availableBeds <= 3 ? 'text-rose-400 font-bold' : 'text-slate-300'}>
                        {dept.availableBeds} of {dept.totalBeds}
                      </span>
                    </td>
                    <td className="py-2.5 text-slate-300">
                      {dept.activeStaff}/{dept.requiredStaff} ({dept.staffPercent}%)
                    </td>
                    <td className="py-2.5">
                      <span
                        className={
                          dept.acuity === 'Critical'
                            ? 'text-rose-400 font-bold'
                            : dept.acuity === 'High' || dept.acuity === 'Elevated'
                            ? 'text-amber-400'
                            : 'text-slate-300'
                        }
                      >
                        {dept.acuity}
                      </span>
                    </td>
                    <td className="py-2.5">
                      <span className={dept.trend === 'up' ? 'text-rose-400 font-bold' : 'text-slate-400'}>
                        {dept.trend === 'up' ? '↑ Rising' : '→ Steady'}
                      </span>
                    </td>
                    <td className="py-2.5 text-right">
                      <Badge variant={dept.statusVariant} size="sm">
                        {dept.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Footer bar with selected department quick insight */}
      <div className="mt-3.5 pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
        <div className="flex items-center gap-2 text-slate-300">
          <Activity className="w-3.5 h-3.5 text-cyan-400" />
          <span>
            Selected: <strong className="text-white">{selectedDept.name}</strong> &bull; {selectedDept.availableBeds} beds free &bull; {selectedDept.activeStaff} staff active
          </span>
        </div>
        <button
          onClick={() => navigate('/app/resources')}
          className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
        >
          <span>Resource Details</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
