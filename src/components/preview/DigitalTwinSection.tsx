import React, { useState } from 'react';
import { Layers, Maximize2, CheckCircle2, ArrowRight } from 'lucide-react';
import { useRouterStore } from '../../store/useRouterStore';

type DepartmentId = 'icu' | 'ed' | 'or' | 'ward';
type LayerId = 'flow' | 'beds' | 'staff' | 'demand' | 'capacity' | 'risk';

interface DepartmentData {
  id: DepartmentId;
  name: string;
  fullName: string;
  occupancy: number;
  occupancyLabel: string;
  staffOnDuty: string;
  demandVector: string;
  riskScore: number;
  status: 'critical' | 'surge' | 'optimal' | 'stable';
  details: string;
  coordinates: { x: number; y: number };
}

export const DigitalTwinSection: React.FC = () => {
  const [activeDept, setActiveDept] = useState<DepartmentId>('icu');
  const [hoveredDept, setHoveredDept] = useState<DepartmentId | null>(null);
  const [activeLayers, setActiveLayers] = useState<Record<LayerId, boolean>>({
    flow: true,
    beds: true,
    staff: true,
    demand: true,
    capacity: true,
    risk: true,
  });

  const navigate = useRouterStore((state) => state.navigate);

  const departments: Record<DepartmentId, DepartmentData> = {
    icu: {
      id: 'icu',
      name: 'ICU Critical Care',
      fullName: 'Intensive Care Unit (Wings A & B)',
      occupancy: 92,
      occupancyLabel: '29 / 32 Beds Allocated',
      staffOnDuty: '14 RNs, 4 Intensivists (Ratio 1:2.1)',
      demandVector: '+14.8% Projected Surge (T+4h)',
      riskScore: 88,
      status: 'critical',
      details: 'High acuity overload risk. Two step-down authorizations pending to free isolation capacity before shift turnaround.',
      coordinates: { x: 50, y: 35 },
    },
    ed: {
      id: 'ed',
      name: 'Emergency & Triage',
      fullName: 'Emergency Department & Acute Intake',
      occupancy: 94,
      occupancyLabel: '42 / 38 Treatment Bays (Over-capacity)',
      staffOnDuty: '18 RNs, 6 Attending Physicians',
      demandVector: '+18.4% Arrival Velocity (48 pts/hr)',
      riskScore: 92,
      status: 'surge',
      details: 'Ambulance diversion threshold within 30 minutes unless 4 floater nurses are dispatched from lower-acuity wards.',
      coordinates: { x: 22, y: 68 },
    },
    or: {
      id: 'or',
      name: 'Surgical Suites & OR',
      fullName: 'Operating Rooms & Post-Anesthesia Care (PACU)',
      occupancy: 84,
      occupancyLabel: '6 / 7 Active Surgical Theatres',
      staffOnDuty: '12 Surgical RNs, 8 Anesthesiologists',
      demandVector: 'Scheduled elective block clearance',
      riskScore: 54,
      status: 'optimal',
      details: 'Surgical block utilization on target. 1 floater nurse can be safely released to Emergency post-morning rounds.',
      coordinates: { x: 78, y: 38 },
    },
    ward: {
      id: 'ward',
      name: 'General Medicine Ward',
      fullName: 'Acute Medical & Step-Down Units',
      occupancy: 78,
      occupancyLabel: '78 / 100 Ward Beds',
      staffOnDuty: '22 RNs, 8 Residents, 4 Floaters',
      demandVector: 'Stable presentation rate',
      riskScore: 32,
      status: 'stable',
      details: 'Ward operations stable. 4 floater nurses available for MILP reallocation to relieve Emergency triage pressure.',
      coordinates: { x: 50, y: 78 },
    },
  };

  const toggleLayer = (layer: LayerId) => {
    setActiveLayers((prev) => ({ ...prev, [layer]: !prev[layer] }));
  };

  const current = departments[hoveredDept || activeDept];

  return (
    <section id="digital-twin" className="relative py-28 sm:py-36 bg-[#050814] text-slate-100 border-t border-white/[0.08] overflow-hidden">
      {/* Precision ambient lighting */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[800px] h-[550px] bg-cyan-500/[0.03] blur-[180px] pointer-events-none" />
      <div className="absolute inset-0 bg-grid-pattern opacity-15 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-14">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0B1220] border border-white/[0.08] mb-5 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              <span className="text-[11px] font-mono font-bold tracking-wider text-slate-200 uppercase">
                CAMPUS SPATIAL INTELLIGENCE
              </span>
              <span className="text-slate-600">|</span>
              <span className="text-[10px] font-mono text-cyan-400 font-medium">LIVING MODEL</span>
            </div>

            <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-[1.08] uppercase">
              A Digital Twin of Hospital Operations.
            </h2>

            <p className="mt-4 text-base sm:text-lg text-slate-400 font-normal leading-relaxed">
              A living computational topology modeling beds, clinical staff, patient flow splines, and acute capacity stress across every department.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => navigate('/app/dashboard')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs font-mono transition-all shadow-md cursor-pointer"
            >
              <span>Launch Live Twin</span>
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Operational Layer Control Strip (6 Controls: Patient Flow, Beds, Staff, Demand, Capacity, Risk) */}
        <div className="p-3.5 sm:p-4 rounded-xl bg-[#0B1220] border border-white/[0.08] mb-8 flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
          <div className="flex items-center gap-2 text-slate-400">
            <Layers className="w-4 h-4 text-cyan-400" />
            <span className="font-bold text-slate-200 uppercase tracking-wider text-[11px]">
              Active Spatial Layers:
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {(
              [
                ['flow', 'Patient Flow'],
                ['beds', 'Beds'],
                ['staff', 'Staff'],
                ['demand', 'Demand'],
                ['capacity', 'Capacity'],
                ['risk', 'Risk'],
              ] as [LayerId, string][]
            ).map(([key, label]) => {
              const active = activeLayers[key];
              return (
                <button
                  key={key}
                  onClick={() => toggleLayer(key)}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer border ${
                    active
                      ? 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30 font-bold'
                      : 'bg-white/[0.02] text-slate-500 border-white/[0.06] hover:text-slate-300'
                  }`}
                >
                  <span>{label}</span>
                </button>
              );
            })}
          </div>

          <span className="text-[10px] text-slate-400 bg-white/[0.06] px-2 py-0.5 rounded font-mono">
            SIMULATED TWIN &bull; DEMO MODE
          </span>
        </div>

        {/* 12-Column Interactive Digital Twin Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Column: Interactive Spatial Topological Schematic (7 Cols) */}
          <div className="lg:col-span-7 bg-[#070B17] p-6 sm:p-8 rounded-2xl border border-white/[0.08] flex flex-col justify-between relative min-h-[440px] overflow-hidden shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08] z-10">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
                Hospital Campus Topology (Building 4 Floorplan)
              </span>
              <span className="text-[10px] font-mono text-cyan-400 font-bold">
                HOVER OR CLICK TO INSPECT
              </span>
            </div>

            {/* SVG Background Schematic Network */}
            <div className="relative w-full h-[330px] my-4 flex items-center justify-center">
              <svg className="w-full h-full" viewBox="0 0 500 300" preserveAspectRatio="xMidYMid meet">
                {/* Connecting Patient Flow Splines */}
                {activeLayers.flow && (
                  <>
                    <path
                      d="M 120,200 Q 250,220 250,110"
                      fill="none"
                      stroke="#19C7F3"
                      strokeWidth="2"
                      strokeDasharray="4 4"
                      className="animate-pulse"
                    />
                    <path
                      d="M 250,110 Q 320,110 380,120"
                      fill="none"
                      stroke="#2DD4BF"
                      strokeWidth="2"
                      strokeDasharray="4 4"
                    />
                    <path
                      d="M 250,240 Q 250,180 250,110"
                      fill="none"
                      stroke="#94A3B8"
                      strokeWidth="1.5"
                      strokeDasharray="3 3"
                    />
                  </>
                )}

                {/* Department Node: Emergency */}
                <g 
                  onClick={() => setActiveDept('ed')}
                  onMouseEnter={() => setHoveredDept('ed')}
                  onMouseLeave={() => setHoveredDept(null)}
                  className="cursor-pointer group"
                >
                  <circle cx="120" cy="200" r="34" fill="#0B1220" stroke={activeDept === 'ed' || hoveredDept === 'ed' ? '#FB7185' : '#334155'} strokeWidth="2.5" />
                  <text x="120" y="196" textAnchor="middle" fill="#FFFFFF" fontSize="12" fontWeight="bold" fontFamily="monospace">EMERGENCY</text>
                  <text x="120" y="213" textAnchor="middle" fill="#FB7185" fontSize="10" fontFamily="monospace">94% LOAD</text>
                </g>

                {/* Department Node: ICU */}
                <g 
                  onClick={() => setActiveDept('icu')}
                  onMouseEnter={() => setHoveredDept('icu')}
                  onMouseLeave={() => setHoveredDept(null)}
                  className="cursor-pointer group"
                >
                  <circle cx="250" cy="110" r="40" fill="#0B1220" stroke={activeDept === 'icu' || hoveredDept === 'icu' ? '#19C7F3' : '#334155'} strokeWidth="2.5" />
                  <text x="250" y="105" textAnchor="middle" fill="#FFFFFF" fontSize="14" fontWeight="bold" fontFamily="monospace">ICU</text>
                  <text x="250" y="123" textAnchor="middle" fill="#4DD8FF" fontSize="10" fontFamily="monospace">92% OCC</text>
                </g>

                {/* Department Node: Operating Theatres */}
                <g 
                  onClick={() => setActiveDept('or')}
                  onMouseEnter={() => setHoveredDept('or')}
                  onMouseLeave={() => setHoveredDept(null)}
                  className="cursor-pointer group"
                >
                  <circle cx="380" cy="120" r="34" fill="#0B1220" stroke={activeDept === 'or' || hoveredDept === 'or' ? '#2DD4BF' : '#334155'} strokeWidth="2.5" />
                  <text x="380" y="116" textAnchor="middle" fill="#FFFFFF" fontSize="12" fontWeight="bold" fontFamily="monospace">OR</text>
                  <text x="380" y="133" textAnchor="middle" fill="#2DD4BF" fontSize="10" fontFamily="monospace">84% CAP</text>
                </g>

                {/* Department Node: General Ward */}
                <g 
                  onClick={() => setActiveDept('ward')}
                  onMouseEnter={() => setHoveredDept('ward')}
                  onMouseLeave={() => setHoveredDept(null)}
                  className="cursor-pointer group"
                >
                  <circle cx="250" cy="240" r="34" fill="#0B1220" stroke={activeDept === 'ward' || hoveredDept === 'ward' ? '#38BDF8' : '#334155'} strokeWidth="2.5" />
                  <text x="250" y="236" textAnchor="middle" fill="#FFFFFF" fontSize="12" fontWeight="bold" fontFamily="monospace">WARD</text>
                  <text x="250" y="253" textAnchor="middle" fill="#38BDF8" fontSize="10" fontFamily="monospace">78% OCC</text>
                </g>
              </svg>
            </div>

            {/* Department Selection Strip */}
            <div className="grid grid-cols-4 gap-2 pt-3 border-t border-white/[0.08] z-10 text-xs font-mono">
              {(Object.keys(departments) as DepartmentId[]).map((id) => (
                <button
                  key={id}
                  onClick={() => setActiveDept(id)}
                  className={`py-2 px-1 text-center rounded-lg transition-all cursor-pointer truncate ${
                    activeDept === id
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold'
                      : 'bg-white/[0.02] text-slate-400 hover:text-white'
                  }`}
                >
                  {departments[id].name.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: Department Detailed Telemetry Inspector (5 Cols) */}
          <div className="lg:col-span-5 bg-[#0B1220] p-6 sm:p-8 rounded-2xl border border-white/[0.08] flex flex-col justify-between gap-6 shadow-xl">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
                <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">
                  Live Unit Inspector
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.06] text-slate-300">
                  ID: #{current.id.toUpperCase()}-FLOOR-4
                </span>
              </div>

              <div className="mt-4">
                <h3 className="font-display text-2xl font-bold text-white">
                  {current.fullName}
                </h3>
                <p className="text-xs text-slate-400 mt-1.5 font-sans leading-relaxed">
                  {current.details}
                </p>
              </div>

              {/* Department Metrics HUD */}
              <div className="grid grid-cols-2 gap-3 mt-6">
                <div className="p-3.5 rounded-xl bg-[#070B17] border border-white/[0.06]">
                  <span className="text-[10px] font-mono text-slate-400 uppercase block mb-1">
                    Occupancy / Load
                  </span>
                  <span className="text-2xl font-display font-bold text-white">
                    {current.occupancy}%
                  </span>
                  <span className="text-[10px] font-mono text-slate-400 block mt-1 truncate">
                    {current.occupancyLabel}
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-[#070B17] border border-white/[0.06]">
                  <span className="text-[10px] font-mono text-slate-400 uppercase block mb-1">
                    Acuity Risk Index
                  </span>
                  <span className={`text-2xl font-display font-bold ${
                    current.riskScore > 85 ? 'text-rose-400' : current.riskScore > 60 ? 'text-amber-400' : 'text-emerald-400'
                  }`}>
                    {current.riskScore} / 100
                  </span>
                  <span className="text-[10px] font-mono text-slate-400 block mt-1 uppercase">
                    Status: {current.status}
                  </span>
                </div>
              </div>

              <div className="mt-4 space-y-2.5 text-xs font-mono">
                <div className="p-3 rounded-lg bg-[#070B17] border border-white/[0.06] flex items-center justify-between">
                  <span className="text-slate-400">Staff on Duty:</span>
                  <span className="text-slate-200 font-bold">{current.staffOnDuty}</span>
                </div>
                <div className="p-3 rounded-lg bg-[#070B17] border border-white/[0.06] flex items-center justify-between">
                  <span className="text-slate-400">Demand Vector:</span>
                  <span className="text-cyan-300 font-bold">{current.demandVector}</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between text-xs font-mono text-slate-400">
              <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Synchronized
              </span>
              <button
                onClick={() => navigate('/app/resources')}
                className="text-cyan-400 hover:text-cyan-300 transition-colors font-bold cursor-pointer inline-flex items-center gap-1"
              >
                <span>Inspect Telemetry</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
