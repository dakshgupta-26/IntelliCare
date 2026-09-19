import React from 'react';
import {
  AlertTriangle,
  X,
  Activity,
  Bed,
  Users,
  Clock,
  ShieldAlert,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';
import { useRouterStore } from '../../../store/useRouterStore';

interface OperationalRiskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRunScenario?: () => void;
}

export const OperationalRiskModal: React.FC<OperationalRiskModalProps> = ({
  isOpen,
  onClose,
  onRunScenario
}) => {
  const navigate = useRouterStore((state) => state.navigate);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 animate-fade-in select-none">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-navy-950/80 backdrop-blur-md transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog */}
      <div className="relative z-10 w-full max-w-2xl rounded-3xl bg-[#07111f] border border-amber-500/30 shadow-[0_25px_70px_rgba(0,0,0,0.85)] p-5 sm:p-6 text-slate-100 max-h-[90vh] overflow-y-auto custom-scrollbar">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <ShieldAlert className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-wider">
                  Operational Risk Overview
                </span>
                <span className="text-slate-600">•</span>
                <span className="text-[10px] font-mono text-slate-400">DEMO ENVIRONMENT</span>
              </div>
              <h3 className="text-lg font-display font-extrabold text-white">
                Elevated Acuity & Capacity Warning
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-surface-200/50 hover:bg-surface-200 text-slate-400 hover:text-white transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Risk Summary Banner */}
        <div className="mt-4 p-4 rounded-2xl bg-gradient-to-r from-amber-950/30 via-surface-100 to-surface-100 border border-amber-500/20 text-xs text-slate-300 leading-relaxed">
          <div className="flex items-center gap-2 text-amber-300 font-bold mb-1">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>High Acuity Convergence Triggered (Code Orange Threshold: 95% ICU)</span>
          </div>
          IntelliCare multi-horizon models predict ICU bed demand will reach <strong className="text-white font-mono">94.8%</strong> by 22:00 due to simultaneous multi-trauma presentations in Emergency and delayed post-surgical PACU step-downs.
        </div>

        {/* Core Risk Indicators Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-4">
          <div className="p-3.5 rounded-xl bg-[#0a1628] border border-slate-800">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[11px] font-mono">ICU Buffer Remaining</span>
              <Activity className="w-3.5 h-3.5 text-rose-400" />
            </div>
            <div className="text-xl font-mono font-bold text-rose-400">3 Beds</div>
            <span className="text-[10px] text-slate-400 font-mono">Exhaustion: ~3h 40m</span>
          </div>

          <div className="p-3.5 rounded-xl bg-[#0a1628] border border-slate-800">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[11px] font-mono">ED Intake Surge</span>
              <Bed className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <div className="text-xl font-mono font-bold text-amber-400">+18.4%</div>
            <span className="text-[10px] text-slate-400 font-mono">146 pts/hr peak at 20:00</span>
          </div>

          <div className="p-3.5 rounded-xl bg-[#0a1628] border border-slate-800">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[11px] font-mono">Staffing Shortfall</span>
              <Users className="w-3.5 h-3.5 text-cyan-400" />
            </div>
            <div className="text-xl font-mono font-bold text-cyan-300">-7 Nurses</div>
            <span className="text-[10px] text-slate-400 font-mono">Critical Care Floaters Req.</span>
          </div>
        </div>

        {/* Recommended Immediate Actions */}
        <div className="space-y-2 mb-4">
          <div className="text-[11px] font-mono uppercase text-slate-400 font-bold tracking-wider">
            Protocol Directives (SOP-ICU-2024.3)
          </div>

          <div className="p-3 rounded-xl bg-[#0a1628] border border-slate-800 flex items-start gap-3">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div className="text-xs">
              <div className="font-bold text-white">Authorize Step-Down Discharge Protocol</div>
              <p className="text-slate-400 mt-0.5">
                Transfer 2 stabilized ICU step-down patients with NEWS2 ≤ 2 to Ward 4 to preserve acute negative-pressure capacity.
              </p>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[#0a1628] border border-slate-800 flex items-start gap-3">
            <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <div className="text-xs">
              <div className="font-bold text-white">Deploy Central Floater Reserve</div>
              <p className="text-slate-400 mt-0.5">
                Reassign 2 float registered nurses to Emergency Resuscitation Bay B for 18:00–23:00 shift.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span>Audit telemetry synced &bull; Real-time model LSTM v2.4</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                if (onRunScenario) onRunScenario();
                else navigate('/app/scenarios');
              }}
              className="px-3.5 py-1.5 rounded-xl bg-purple-500/15 hover:bg-purple-500/25 border border-purple-500/30 text-purple-300 text-xs font-mono transition-colors cursor-pointer"
            >
              Simulate Mitigations
            </button>

            <button
              onClick={() => {
                onClose();
                navigate('/app/recommendations');
              }}
              className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-400 hover:to-cyan-500 text-slate-950 text-xs font-bold font-sans transition-all flex items-center gap-1.5 shadow-[0_0_15px_rgba(22,199,243,0.3)] cursor-pointer"
            >
              <span>Review Directives</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
