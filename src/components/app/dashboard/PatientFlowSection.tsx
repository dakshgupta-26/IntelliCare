import React from 'react';
import {
  AlertTriangle,
  ArrowRight
} from 'lucide-react';
import { useRouterStore } from '../../../store/useRouterStore';
import { Badge } from '../../ui/Badge';

interface PatientFlowSectionProps {
  onRunScenario?: () => void;
}

export const PatientFlowSection: React.FC<PatientFlowSectionProps> = ({ onRunScenario }) => {
  const navigate = useRouterStore((state) => state.navigate);

  const flowNodes = [
    { id: 'ed', name: 'Emergency Intake', rate: '124 pts/hr', status: 'Surge', statusColor: 'amber' },
    { id: 'triage', name: 'Clinical Triage', rate: 'Avg 8m wait', status: 'Optimal', statusColor: 'emerald' },
    { id: 'diag', name: 'Diagnostics & CT', rate: 'Avg 42m wait', status: 'Bottleneck', statusColor: 'rose' },
    { id: 'adm', name: 'Bed Admission', rate: '14 Pending', status: 'Watch', statusColor: 'amber' },
    { id: 'units', name: 'ICU & Inpatient', rate: '92.4% Occupancy', status: 'High Acuity', statusColor: 'rose' },
    { id: 'disch', name: 'Discharge / Step-Down', rate: '12 Discharges Pending', status: 'Active', statusColor: 'teal' }
  ];

  const bottlenecks = [
    {
      id: 'bn-diag',
      source: 'Emergency Resuscitation',
      destination: 'Radiology / CT Scan',
      delayMetric: '+24m Delay vs Target',
      severity: 'HIGH',
      severityVariant: 'rose' as const,
      trend: '↑ Rising',
      description: 'Trauma CT scanner queue has backed up by 4 acute cases following highway multi-casualty incident.',
      recommendedAction: 'Stage secondary mobile imaging unit and notify on-call teleradiologist for expedited trauma reads.'
    },
    {
      id: 'bn-stepdown',
      source: 'Intensive Care Unit',
      destination: 'General Ward Telemetry',
      delayMetric: '3 Patients Boarded',
      severity: 'MODERATE',
      severityVariant: 'amber' as const,
      trend: '→ Steady',
      description: 'Stabilized ICU patients (NEWS2 ≤ 2) unable to step down due to delayed general ward room turnovers.',
      recommendedAction: 'Authorize rapid discharge protocol for 2 stabilized ward patients to free telemetry telemetry buffer.'
    }
  ];

  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-[#07111f] border border-slate-800/90 shadow-lg flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-wider">
                Clinical Throughput Telemetry
              </span>
              <span className="text-slate-700">•</span>
              <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-400">
                SIMULATED DATA
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-display font-bold text-white tracking-tight">
              Patient Flow & Bottleneck Detection
            </h2>
          </div>

          <Badge variant="amber" size="sm">
            2 ACTIVE BOTTLENECKS
          </Badge>
        </div>

        {/* Interactive SVG Flow Pipeline */}
        <div className="my-4 p-4 rounded-xl bg-[#0a1628] border border-slate-800/90 overflow-x-auto custom-scrollbar">
          <div className="min-w-[680px] flex items-center justify-between gap-2 relative">
            {flowNodes.map((node, idx) => (
              <React.Fragment key={node.id}>
                {/* Node Box */}
                <div
                  className={`p-2.5 rounded-xl border flex-1 transition-all ${
                    node.statusColor === 'rose'
                      ? 'bg-rose-950/20 border-rose-500/40 shadow-[0_0_12px_rgba(244,63,94,0.15)]'
                      : node.statusColor === 'amber'
                      ? 'bg-amber-950/20 border-amber-500/30'
                      : 'bg-[#07111f] border-slate-800'
                  }`}
                >
                  <div className="text-[10px] font-mono text-slate-400 mb-0.5 truncate">
                    Step 0{idx + 1}
                  </div>
                  <div className="text-xs font-bold text-white truncate font-display">
                    {node.name}
                  </div>
                  <div className="text-[11px] font-mono font-extrabold text-cyan-300 mt-1 truncate">
                    {node.rate}
                  </div>
                  <div className="mt-1.5 pt-1 border-t border-slate-800/60 flex items-center justify-between text-[9px] font-mono">
                    <span className="text-slate-400">Status:</span>
                    <span
                      className={
                        node.statusColor === 'rose'
                          ? 'text-rose-400 font-bold'
                          : node.statusColor === 'amber'
                          ? 'text-amber-400'
                          : 'text-emerald-400'
                      }
                    >
                      {node.status}
                    </span>
                  </div>
                </div>

                {/* Flow Connector Arrow with animated pulse */}
                {idx < flowNodes.length - 1 && (
                  <div className="flex items-center text-slate-600 shrink-0 px-1 relative">
                    <ArrowRight className="w-4 h-4 text-cyan-400/80 animate-pulse" />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Bottleneck Alert Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {bottlenecks.map((bn) => (
            <div
              key={bn.id}
              className="p-3.5 rounded-xl bg-[#081324] border border-slate-800/90 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>{bn.source} ➔ {bn.destination}</span>
                  </div>
                  <Badge variant={bn.severityVariant} size="sm">
                    {bn.severity}
                  </Badge>
                </div>

                <div className="text-[11px] font-mono text-rose-400 font-bold mb-1">
                  Delay: {bn.delayMetric} &bull; Trend: {bn.trend}
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {bn.description}
                </p>
              </div>

              <div className="mt-3 pt-2.5 border-t border-slate-800/80">
                <div className="text-[11px] font-mono text-cyan-300 mb-2">
                  <strong>Action:</strong> {bn.recommendedAction}
                </div>
                <div className="flex items-center justify-end gap-2">
                  <button
                    onClick={() => {
                      if (onRunScenario) onRunScenario();
                      else navigate('/app/scenarios');
                    }}
                    className="px-2.5 py-1 rounded-lg bg-purple-500/15 hover:bg-purple-500/25 border border-purple-500/30 text-purple-300 text-[11px] font-mono transition-colors cursor-pointer"
                  >
                    Simulate Impact
                  </button>
                  <button
                    onClick={() => navigate('/app/alerts')}
                    className="px-2.5 py-1 rounded-lg bg-surface-200 hover:bg-surface-300 text-slate-200 text-[11px] font-mono border border-slate-700 transition-colors cursor-pointer"
                  >
                    Triage Alert
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
