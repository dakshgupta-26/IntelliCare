import React from 'react';
import { useSimStore } from '../../store/useSimStore';
import { CheckCircle2, Edit3, XCircle, ArrowRight, RotateCcw } from 'lucide-react';

export const HumanInTheLoop: React.FC = () => {
  const hitlStatus = useSimStore((state) => state.hitlStatus);
  const setHitlAction = useSimStore((state) => state.setHitlAction);
  const resetHitl = useSimStore((state) => state.resetHitl);

  const workflowSteps = [
    { step: '01', title: 'Telemetry Ingest', sub: 'EHR / HL7 Stream' },
    { step: '02', title: 'Neural Forecast', sub: 'LSTM Time-Series' },
    { step: '03', title: 'MILP Optimization', sub: 'OR-Tools Balancing' },
    { step: '04', title: 'Coordinator Review', sub: 'Human Gate', highlight: true },
    { step: '05', title: 'Signed Execution', sub: 'Immutable Audit Log' },
  ];

  return (
    <section id="governance" className="relative py-32 bg-[#070B17] text-[#F8FAFC] border-t border-white/[0.07] overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-emerald-500/10 blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono font-medium tracking-wide mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            CLINICAL GOVERNANCE & TRUST
          </div>

          <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-[1.1]">
            AI recommends. <span className="text-emerald-400">People decide.</span>
          </h2>

          <p className="mt-4 text-xl text-[#A7B4C8] font-normal leading-relaxed">
            IntelliCare is strictly an operational decision-support platform. Every predictive alert and staffing reallocation requires affirmative human authorization before execution.
          </p>
        </div>

        {/* 5-Step Governance Flow */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 p-3 rounded-2xl bg-[#0A1020] border border-white/[0.07] shadow-xl mb-12">
          {workflowSteps.map((w, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-xl border transition-all duration-300 ${
                w.highlight
                  ? 'bg-emerald-950/30 border-emerald-500/40 shadow-[0_0_12px_rgba(16,185,129,0.15)]'
                  : 'bg-[#0D1526] border-white/[0.07]'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-[#111B2D] text-[#A7B4C8] border border-white/10">
                  {w.step}
                </span>
                {w.highlight && (
                  <span className="text-[10px] font-mono text-emerald-300 font-bold bg-emerald-500/20 px-2 py-0.5 rounded border border-emerald-500/40">
                    HUMAN GATE
                  </span>
                )}
              </div>
              <span className="text-sm font-bold text-white block mb-1 font-display">
                {w.title}
              </span>
              <span className="text-xs font-mono text-[#64748B]">
                {w.sub}
              </span>
            </div>
          ))}
        </div>

        {/* Interactive Human Governance Authorization Terminal */}
        <div className="bg-[#0A1020] p-6 sm:p-10 rounded-3xl border border-white/[0.07] shadow-[0_12px_32px_rgba(0,0,0,0.5)]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-6 border-b border-white/[0.07]">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
                  OPERATIONAL DISPATCH AUTHORIZATION
                </span>
                <span className="text-[11px] font-mono text-[#64748B]">
                  ORDER ID: #DISP-2026-0818-B4
                </span>
              </div>
              <h3 className="font-display text-xl sm:text-2xl font-bold text-white mt-2">
                Pending Clinical Coordinator Authorization
              </h3>
            </div>

            {hitlStatus !== 'pending' && (
              <button
                onClick={resetHitl}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0D1526] hover:bg-[#111B2D] text-white border border-white/10 text-xs font-mono font-medium transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
                <span>Reset Order</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left: Summary Order & Constraint Checks (7 Cols) */}
            <div className="lg:col-span-7 flex flex-col gap-4">
              <div className="p-5 rounded-2xl bg-[#0D1526] border border-white/[0.07] text-xs font-mono">
                <div className="flex items-center justify-between text-[#A7B4C8] pb-2.5 border-b border-white/[0.07]">
                  <span className="font-bold">PROPOSED REALLOCATION SUMMARY</span>
                  <span className="text-emerald-400 font-bold">MILP Objective: 148.2</span>
                </div>
                <div className="mt-3.5 flex flex-col gap-2 text-[#F8FAFC]">
                  <div className="flex justify-between">
                    <span className="text-[#A7B4C8]">&bull; Reallocate Floater Nurses:</span>
                    <strong className="text-emerald-400 font-bold">+4 to ED (Intake Bay 6-9)</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#A7B4C8]">&bull; ICU Bed Standby Escalation:</span>
                    <strong className="text-cyan-400 font-bold">+2 Intensivists (Shift B)</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#A7B4C8]">&bull; Ward Early Discharge Protocol:</span>
                    <strong className="text-slate-300">Authorize 3 step-downs</strong>
                  </div>
                </div>
              </div>

              {/* Status Outcome Banner */}
              {hitlStatus === 'approved' && (
                <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-xs font-mono text-emerald-300 flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  <div>
                    <strong className="block text-white font-bold">DISPATCH ORDER AUTHORIZED & SIGNED</strong>
                    <span className="text-emerald-200/80">Logged to immutable audit ledger with Clinical Director cryptographic credentials.</span>
                  </div>
                </div>
              )}

              {hitlStatus === 'modified' && (
                <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-500/40 text-xs font-mono text-amber-300 flex items-center gap-3">
                  <Edit3 className="w-5 h-5 text-amber-400 shrink-0" />
                  <div>
                    <strong className="block text-white font-bold">DISPATCH MODIFIED BY CLINICAL COORDINATOR</strong>
                    <span className="text-amber-200/80">Nurse transfer reduced from +4 to +2. Re-solving secondary bounds with zero penalty.</span>
                  </div>
                </div>
              )}

              {hitlStatus === 'rejected' && (
                <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-500/40 text-xs font-mono text-rose-300 flex items-center gap-3">
                  <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                  <div>
                    <strong className="block text-white font-bold">DISPATCH OVERRULED BY SUPERVISOR</strong>
                    <span className="text-rose-200/80">Current shift roster maintained. Overrule justification recorded in compliance log.</span>
                  </div>
                </div>
              )}
            </div>

            {/* Right: Interactive Action Buttons (5 Cols) */}
            <div className="lg:col-span-5 flex flex-col gap-3 bg-[#0D1526] p-6 rounded-2xl border border-white/[0.07]">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#A7B4C8] mb-1">
                Coordinator Action Gates
              </span>

              <button
                onClick={() => setHitlAction('approved', 'Clinical Director approved full reallocation plan.')}
                disabled={hitlStatus === 'approved'}
                className="w-full flex items-center justify-between p-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono font-bold transition-all cursor-pointer shadow-[0_0_15px_rgba(16,185,129,0.25)] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Approve Full Reallocation</span>
                </div>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setHitlAction('modified', 'Adjusted nurse allocation to maintain PACU buffer.')}
                disabled={hitlStatus === 'modified'}
                className="w-full flex items-center justify-between p-3.5 rounded-xl bg-[#111B2D] hover:bg-[#142038] border border-amber-500/30 hover:border-amber-500/60 text-white text-xs font-mono font-bold transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="flex items-center gap-2">
                  <Edit3 className="w-4 h-4 text-amber-400" />
                  <span>Modify Resource Bounds</span>
                </div>
                <ArrowRight className="w-4 h-4 text-amber-400" />
              </button>

              <button
                onClick={() => setHitlAction('rejected', 'Clinical supervisor opted for internal ward deferral.')}
                disabled={hitlStatus === 'rejected'}
                className="w-full flex items-center justify-between p-3.5 rounded-xl bg-[#111B2D] hover:bg-[#142038] border border-rose-500/30 hover:border-rose-500/60 text-white text-xs font-mono font-bold transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="flex items-center gap-2">
                  <XCircle className="w-4 h-4 text-rose-400" />
                  <span>Overrule Recommendation</span>
                </div>
                <ArrowRight className="w-4 h-4 text-rose-400" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
