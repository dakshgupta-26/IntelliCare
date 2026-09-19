import React from 'react';
import {
  ShieldCheck,
  Building2,
  Users,
  Sliders,
  TrendingUp,
  Cpu,
  Bot,
  Workflow,
  ArrowRight,
  Layers
} from 'lucide-react';
import { SettingsSectionId } from '../types';
import { useAuthStore } from '../../../../store/useAuthStore';
import { useHospitalStore } from '../../../../store/useHospitalStore';
import { useOptimizationStore } from '../../../../store/useOptimizationStore';
import { useForecastStore } from '../../../../store/useForecastStore';

interface OverviewSectionProps {
  onNavigate: (section: SettingsSectionId) => void;
}

export const OverviewSection: React.FC<OverviewSectionProps> = ({ onNavigate }) => {
  const currentUser = useAuthStore((state) => state.currentUser);
  const activeSessions = useAuthStore((state) => state.activeSessions);
  const departments = useHospitalStore((state) => state.departments);
  const objectiveWeights = useOptimizationStore((state) => state.objectiveWeights);
  const selectedModel = useForecastStore((state) => state.selectedModel);
  const selectedHorizon = useForecastStore((state) => state.selectedHorizon);

  const totalBeds = departments.reduce((acc, d) => acc + d.totalBeds, 0);

  const OVERVIEW_CARDS = [
    {
      id: 'profile' as SettingsSectionId,
      title: 'Clinical Identity',
      icon: <Users className="w-4 h-4 text-cyan-400" />,
      status: 'Active Credentials',
      statusColor: 'text-emerald-400',
      description: `${currentUser?.name || 'Dr. Sarah Chen, MD'} • ${currentUser?.role || 'HOSPITAL_ADMIN'}`,
      actionText: 'Configure Identity'
    },
    {
      id: 'organization' as SettingsSectionId,
      title: 'Hospital Facility',
      icon: <Building2 className="w-4 h-4 text-cyan-400" />,
      status: 'Campus Online',
      statusColor: 'text-emerald-400',
      description: 'IntelliCare Metropolitan Medical Center • Timezone EST',
      actionText: 'Manage Facility'
    },
    {
      id: 'departments' as SettingsSectionId,
      title: 'Department Units',
      icon: <Layers className="w-4 h-4 text-cyan-400" />,
      status: `${departments.length} Units Active`,
      statusColor: 'text-cyan-400',
      description: `${totalBeds} Total inpatient beds configured across ED, ICU, and surgical wards.`,
      actionText: 'Manage Departments'
    },
    {
      id: 'security' as SettingsSectionId,
      title: 'Security & Sessions',
      icon: <ShieldCheck className="w-4 h-4 text-emerald-400" />,
      status: `${Math.max(1, activeSessions.length)} Active Sessions`,
      statusColor: 'text-cyan-400',
      description: 'Zero unauthorized device access detected. TLS 1.3 encrypted.',
      actionText: 'Review Sessions'
    },
    {
      id: 'thresholds' as SettingsSectionId,
      title: 'Alerting Thresholds',
      icon: <Sliders className="w-4 h-4 text-amber-400" />,
      status: 'Multi-Stage Active',
      statusColor: 'text-amber-400',
      description: 'ICU Critical: 90% • ED Surge Delta: +15% • Nurse Ratios enforced.',
      actionText: 'Configure Scales'
    },
    {
      id: 'forecasting' as SettingsSectionId,
      title: 'Neural Forecasting',
      icon: <TrendingUp className="w-4 h-4 text-indigo-400" />,
      status: `${selectedModel} Operational`,
      statusColor: 'text-indigo-400',
      description: `Horizon: ${selectedHorizon} • 94.2% historical accuracy on emergency arrival tensors.`,
      actionText: 'Tune Parameters'
    },
    {
      id: 'optimization' as SettingsSectionId,
      title: 'OR-Tools MILP Solver',
      icon: <Cpu className="w-4 h-4 text-cyan-400" />,
      status: 'Feasible Allocation',
      statusColor: 'text-emerald-400',
      description: `Unmet Demand: ${objectiveWeights.MINIMIZE_UNMET_DEMAND}% • Wait Time: ${objectiveWeights.MINIMIZE_WAIT_TIME}%`,
      actionText: 'Adjust Weights'
    },
    {
      id: 'ai' as SettingsSectionId,
      title: 'AI Decision Support',
      icon: <Bot className="w-4 h-4 text-purple-400" />,
      status: 'Decision Support Only',
      statusColor: 'text-purple-400',
      description: 'Mandatory human clinician sign-off active. 4 Clinical SOPs indexed.',
      actionText: 'Review Governance'
    },
    {
      id: 'integrations' as SettingsSectionId,
      title: 'EHR & FHIR Connectors',
      icon: <Workflow className="w-4 h-4 text-blue-400" />,
      status: 'Connected',
      statusColor: 'text-emerald-400',
      description: 'HL7 FHIR R4 Active • Epic Systems Interconnect Live.',
      actionText: 'API & Integrations'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Console Welcome Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-[#071326] via-[#091833] to-[#060c18] border border-cyan-500/20 relative overflow-hidden shadow-[0_0_30px_rgba(34,211,238,0.06)]">
        <div className="relative z-10 max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            <span>CENTRAL GOVERNANCE REPOSITORY</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-display font-extrabold text-white tracking-tight">
            IntelliCare Decision OS Configuration
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Configure clinical parameters, statutory staffing constraints, mathematical optimizer objective functions, and hospital security policies across all connected medical facilities.
          </p>
        </div>

        {/* System Telemetry Stats in corner */}
        <div className="mt-4 pt-4 border-t border-white/[0.08] grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
          <div>
            <span className="text-slate-400 block text-[10px] uppercase">Telemetry Latency</span>
            <span className="text-emerald-400 font-bold">14ms (Direct Pipe)</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase">RBAC Mode</span>
            <span className="text-white font-bold">Role-Based Mandatory</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase">Audit Ledger</span>
            <span className="text-cyan-400 font-bold">Cryptographic SHA-256</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase">System State</span>
            <span className="text-emerald-400 font-bold">Nominal Feasible</span>
          </div>
        </div>
      </div>

      {/* Grid of Domain Modules */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-display font-bold text-white uppercase tracking-wider">
            Operational Subsystems & Governance Domains
          </h3>
          <span className="text-xs font-mono text-slate-500">
            Click any subsystem to inspect or edit
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {OVERVIEW_CARDS.map((card) => (
            <div
              key={card.id}
              onClick={() => onNavigate(card.id)}
              className="p-4 rounded-2xl bg-[#070D1A] hover:bg-[#0a1426] border border-white/[0.08] hover:border-cyan-500/30 transition-all duration-150 cursor-pointer group flex flex-col justify-between shadow-sm hover:shadow-[0_0_20px_rgba(34,211,238,0.06)]"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-black/40 border border-white/[0.08] group-hover:border-cyan-500/30 transition-colors">
                      {card.icon}
                    </div>
                    <span className="font-display font-bold text-sm text-white group-hover:text-cyan-300 transition-colors">
                      {card.title}
                    </span>
                  </div>
                  <span className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-black/40 border border-white/[0.08] ${card.statusColor}`}>
                    {card.status}
                  </span>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed font-sans line-clamp-2">
                  {card.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-white/[0.05] flex items-center justify-between text-xs font-mono text-slate-400 group-hover:text-cyan-400 transition-colors">
                <span>{card.actionText}</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
