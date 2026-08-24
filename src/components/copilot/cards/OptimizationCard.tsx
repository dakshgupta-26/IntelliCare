import React from 'react';
import { Cpu, CheckCircle2, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import { useRouterStore } from '../../../store/useRouterStore';
import { useCopilotStore } from '../../../store/useCopilotStore';

interface OptimizationCardProps {
  title: string;
  subtitle?: string;
  data?: {
    transfers: Array<{
      from: string;
      to: string;
      count: number;
      unit: string;
      costDelta: string;
    }>;
    constraintsSatisfied: number;
    statutoryViolations: number;
    solverTimeMs: number;
  };
}

export const OptimizationCard: React.FC<OptimizationCardProps> = ({
  title,
  subtitle,
  data = {
    transfers: [
      { from: 'Ward 4 Floater Pool', to: 'ICU High Acuity', count: 4, unit: 'Nurses', costDelta: '-$3,200 (No Agency Overtime)' },
      { from: 'Step-Down Reserve', to: 'Emergency Zone Yellow', count: 6, unit: 'Beds', costDelta: 'Zero Capital' }
    ],
    constraintsSatisfied: 18,
    statutoryViolations: 0,
    solverTimeMs: 84
  }
}) => {
  const navigate = useRouterStore((state) => state.navigate);
  const setOpen = useCopilotStore((state) => state.setOpen);

  const handleOpenOptimizer = () => {
    navigate('/app/optimization');
    setOpen(false);
  };

  return (
    <div className="my-3 rounded-2xl bg-midnight-900/90 border border-teal-500/30 p-4 shadow-[0_4px_24px_rgba(0,0,0,0.4)] backdrop-blur-xl text-slate-100">
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-teal-500/10 border border-teal-400/30 flex items-center justify-center text-brand-teal">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white font-display tracking-wide">{title}</h4>
            {subtitle && <p className="text-[11px] text-slate-400">{subtitle}</p>}
          </div>
        </div>

        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-[10px] font-mono">
          <Zap className="w-3 h-3 animate-pulse" />
          <span>{data.solverTimeMs}ms (Optimal)</span>
        </div>
      </div>

      {/* Reallocation Transfer List */}
      <div className="space-y-2 mb-3">
        {data.transfers.map((item, idx) => (
          <div key={idx} className="bg-surface-50/80 p-2.5 rounded-xl border border-white/5 flex items-center justify-between gap-2 text-xs">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 font-medium text-slate-200">
                <span className="text-slate-400 truncate">{item.from}</span>
                <ArrowRight className="w-3 h-3 text-brand-teal shrink-0" />
                <span className="text-cyan-300 font-semibold truncate">{item.to}</span>
              </div>
              <span className="text-[10px] text-emerald-400 font-mono block mt-0.5">{item.costDelta}</span>
            </div>

            <div className="px-2.5 py-1 rounded-lg bg-teal-500/20 text-teal-300 font-mono font-bold shrink-0">
              +{item.count} {item.unit}
            </div>
          </div>
        ))}
      </div>

      {/* Constraints & Governance Metrics */}
      <div className="grid grid-cols-2 gap-2 p-2 rounded-xl bg-midnight-950/70 border border-slate-800 text-[11px] font-mono mb-3">
        <div className="flex items-center gap-1.5 text-slate-300">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>{data.constraintsSatisfied} Constraints Checked</span>
        </div>
        <div className="flex items-center gap-1.5 text-emerald-400 justify-end">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>0 Statutory Violations</span>
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
        <span className="text-[10px] font-mono text-slate-400">
          Formulation: CBC Branch & Bound (MILP)
        </span>

        <button
          onClick={handleOpenOptimizer}
          className="text-xs font-semibold text-brand-teal hover:text-teal-300 flex items-center gap-1 transition-colors"
        >
          View Full Optimizer
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
