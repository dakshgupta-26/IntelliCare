import React from 'react';
import { useSimStore } from '../../store/useSimStore';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { CheckCircle2, Edit3, XCircle, ArrowRight, RotateCcw } from 'lucide-react';

export const HumanInTheLoop: React.FC = () => {
  const hitlStatus = useSimStore((state) => state.hitlStatus);
  const setHitlAction = useSimStore((state) => state.setHitlAction);
  const resetHitl = useSimStore((state) => state.resetHitl);

  const workflowSteps = [
    { step: '01', title: 'Telemetry & Forecast', sub: 'LSTM Ingestion' },
    { step: '02', title: 'MILP Optimization', sub: 'OR-Tools Solver' },
    { step: '03', title: 'Contextual RAG', sub: 'SOP Justification' },
    { step: '04', title: 'Clinical Coordinator Review', sub: 'Human Authority', highlight: true },
    { step: '05', title: 'Authorized Execution', sub: 'Signed Action Log' },
  ];

  return (
    <section className="relative py-28 bg-navy-900/70 border-t border-b border-slate-800/80 overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-emerald-500/5 blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <Badge variant="emerald" size="md" className="mb-4">
            GOVERNANCE & CLINICAL TRUST
          </Badge>

          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight">
            AI recommends. <span className="text-gradient-cyan">Humans decide.</span>
          </h2>

          <p className="mt-4 text-base sm:text-lg text-slate-400 leading-relaxed">
            IntelliCare is strictly an operational decision-support system. Every automated forecast, resource reallocation, and bed transfer advisory requires explicit human verification, authorization, or modification before execution.
          </p>
        </div>

        {/* 5-Step Visual Workflow */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 p-3 rounded-2xl bg-surface-100/80 border border-slate-800 backdrop-blur-md mb-12">
          {workflowSteps.map((w, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-xl border transition-all duration-300 ${
                w.highlight
                  ? 'bg-emerald-950/30 border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.15)]'
                  : 'bg-surface-200/50 border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                  {w.step}
                </span>
                {w.highlight && (
                  <span className="text-[10px] font-mono text-emerald-400 font-bold">
                    HUMAN GATE
                  </span>
                )}
              </div>
              <span className="text-sm font-bold text-white block mb-1">
                {w.title}
              </span>
              <span className="text-xs font-mono text-slate-400">
                {w.sub}
              </span>
            </div>
          ))}
        </div>

        {/* Interactive Human Governance Approval Terminal */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-emerald-500/30 shadow-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-6 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="emerald" size="sm">
                  OPERATIONAL DISPATCH AUTHORIZATION
                </Badge>
                <span className="text-[11px] font-mono text-slate-500">
                  ORDER ID: #DISP-2026-0818-B4
                </span>
              </div>
              <h3 className="font-display text-xl sm:text-2xl font-bold text-white">
                Pending Coordinator Authorization
              </h3>
            </div>

            {hitlStatus !== 'pending' && (
              <Button
                size="sm"
                variant="secondary"
                icon={<RotateCcw className="w-3.5 h-3.5" />}
                iconPosition="left"
                onClick={resetHitl}
              >
                Reset Order
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left: Summary Order & Constraint Checks (7 Cols) */}
            <div className="lg:col-span-7 flex flex-col gap-4">
              <div className="p-4 rounded-xl bg-surface-100 border border-slate-800 text-xs font-mono">
                <div className="flex items-center justify-between text-slate-400 pb-2 border-b border-slate-800">
                  <span>PROPOSED DISPATCH SUMMARY</span>
                  <span className="text-cyan-400">MILP Objective: 148.2</span>
                </div>
                <div className="mt-3 flex flex-col gap-1.5 text-slate-200">
                  <div className="flex justify-between">
                    <span>&bull; Reallocate Floater Nurses:</span>
                    <strong className="text-emerald-400">+4 to ED (Intake Bay 6-9)</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>&bull; ICU Bed Standby Escalation:</span>
                    <strong className="text-cyan-400">+2 Intensivists (Shift B)</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>&bull; Ward Early Discharge Protocol:</span>
                    <strong className="text-slate-300">Authorize 3 step-downs</strong>
                  </div>
                </div>
              </div>

              {/* Status Outcome Banner */}
              {hitlStatus === 'approved' && (
                <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/50 text-xs font-mono text-emerald-300 flex items-center gap-3 animate-fade-in">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  <div>
                    <strong className="block text-white font-bold">DISPATCH ORDER AUTHORIZED & SIGNED</strong>
                    <span>Logged to immutable audit ledger with Clinical Director cryptographic token.</span>
                  </div>
                </div>
              )}

              {hitlStatus === 'modified' && (
                <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-500/50 text-xs font-mono text-amber-300 flex items-center gap-3 animate-fade-in">
                  <Edit3 className="w-5 h-5 text-amber-400 shrink-0" />
                  <div>
                    <strong className="block text-white font-bold">DISPATCH MODIFIED BY CLINICAL COORDINATOR</strong>
                    <span>Nurse transfer reduced from +4 to +2. Re-solving secondary bounds with zero penalty.</span>
                  </div>
                </div>
              )}

              {hitlStatus === 'rejected' && (
                <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-500/50 text-xs font-mono text-rose-300 flex items-center gap-3 animate-fade-in">
                  <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                  <div>
                    <strong className="block text-white font-bold">DISPATCH OVERRULED BY SUPERVISOR</strong>
                    <span>Current shift roster maintained. Overrule justification recorded in compliance log.</span>
                  </div>
                </div>
              )}
            </div>

            {/* Right: Interactive Action Buttons (5 Cols) */}
            <div className="lg:col-span-5 flex flex-col gap-3 bg-surface-50/70 p-6 rounded-2xl border border-slate-800">
              <span className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-300">
                Coordinator Action Gates
              </span>

              <button
                onClick={() => setHitlAction('approved', 'Clinical Director approved full reallocation plan.')}
                disabled={hitlStatus === 'approved'}
                className="w-full flex items-center justify-between p-3.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-bold transition-all cursor-pointer disabled:opacity-50"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Approve Full Reallocation</span>
                </div>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setHitlAction('modified', 'Adjusted nurse allocation to maintain PACU buffer.')}
                disabled={hitlStatus === 'modified'}
                className="w-full flex items-center justify-between p-3.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-mono font-bold transition-all cursor-pointer disabled:opacity-50"
              >
                <div className="flex items-center gap-2">
                  <Edit3 className="w-4 h-4 text-amber-400" />
                  <span>Modify Resource Bounds</span>
                </div>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setHitlAction('rejected', 'Clinical supervisor opted for internal ward deferral.')}
                disabled={hitlStatus === 'rejected'}
                className="w-full flex items-center justify-between p-3.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-mono font-bold transition-all cursor-pointer disabled:opacity-50"
              >
                <div className="flex items-center gap-2">
                  <XCircle className="w-4 h-4 text-rose-400" />
                  <span>Overrule Recommendation</span>
                </div>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
