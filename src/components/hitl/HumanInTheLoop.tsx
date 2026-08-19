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
    { step: '01', title: 'Telemetry Ingest', sub: 'EHR / HL7 Stream' },
    { step: '02', title: 'Neural Forecast', sub: 'LSTM Time-Series' },
    { step: '03', title: 'MILP Optimization', sub: 'OR-Tools Balancing' },
    { step: '04', title: 'Coordinator Review', sub: 'Human Gate', highlight: true },
    { step: '05', title: 'Signed Execution', sub: 'Immutable Audit Log' },
  ];

  return (
    <section className="relative py-32 bg-section-softMint text-slate-900 border-t border-emerald-100 overflow-hidden">
      {/* Background soft glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-emerald-200/40 blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <Badge variant="emerald" size="md" className="mb-4 bg-emerald-100 text-emerald-800 border-emerald-300">
            CLINICAL GOVERNANCE & TRUST
          </Badge>

          <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.1]">
            AI recommends. <span className="text-emerald-700">People decide.</span>
          </h2>

          <p className="mt-4 text-xl text-slate-600 font-normal leading-relaxed">
            IntelliCare is strictly an operational decision-support platform. Every predictive alert and staffing reallocation requires affirmative human authorization before execution.
          </p>
        </div>

        {/* 5-Step Governance Flow */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 p-3 rounded-2xl bg-white border border-emerald-200/80 shadow-md mb-12">
          {workflowSteps.map((w, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-xl border transition-all duration-300 ${
                w.highlight
                  ? 'bg-emerald-50 border-emerald-400 shadow-sm'
                  : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-200 text-slate-700">
                  {w.step}
                </span>
                {w.highlight && (
                  <span className="text-[10px] font-mono text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded">
                    HUMAN GATE
                  </span>
                )}
              </div>
              <span className="text-sm font-bold text-slate-900 block mb-1 font-display">
                {w.title}
              </span>
              <span className="text-xs font-mono text-slate-500">
                {w.sub}
              </span>
            </div>
          ))}
        </div>

        {/* Interactive Human Governance Authorization Terminal */}
        <div className="bg-white p-6 sm:p-10 rounded-3xl border border-emerald-200/80 shadow-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-6 border-b border-emerald-100">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
                  OPERATIONAL DISPATCH AUTHORIZATION
                </span>
                <span className="text-[11px] font-mono text-slate-500">
                  ORDER ID: #DISP-2026-0818-B4
                </span>
              </div>
              <h3 className="font-display text-xl sm:text-2xl font-bold text-slate-900 mt-2">
                Pending Clinical Coordinator Authorization
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
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-mono">
                <div className="flex items-center justify-between text-slate-600 pb-2.5 border-b border-slate-200">
                  <span className="font-bold">PROPOSED REALLOCATION SUMMARY</span>
                  <span className="text-emerald-700 font-bold">MILP Objective: 148.2</span>
                </div>
                <div className="mt-3.5 flex flex-col gap-2 text-slate-800">
                  <div className="flex justify-between">
                    <span>&bull; Reallocate Floater Nurses:</span>
                    <strong className="text-emerald-800 font-bold">+4 to ED (Intake Bay 6-9)</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>&bull; ICU Bed Standby Escalation:</span>
                    <strong className="text-cyan-800 font-bold">+2 Intensivists (Shift B)</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>&bull; Ward Early Discharge Protocol:</span>
                    <strong className="text-slate-700">Authorize 3 step-downs</strong>
                  </div>
                </div>
              </div>

              {/* Status Outcome Banner */}
              {hitlStatus === 'approved' && (
                <div className="p-4 rounded-xl bg-emerald-100 border border-emerald-300 text-xs font-mono text-emerald-900 flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
                  <div>
                    <strong className="block text-slate-900 font-bold">DISPATCH ORDER AUTHORIZED & SIGNED</strong>
                    <span>Logged to immutable audit ledger with Clinical Director cryptographic credentials.</span>
                  </div>
                </div>
              )}

              {hitlStatus === 'modified' && (
                <div className="p-4 rounded-xl bg-amber-100 border border-amber-300 text-xs font-mono text-amber-900 flex items-center gap-3">
                  <Edit3 className="w-5 h-5 text-amber-700 shrink-0" />
                  <div>
                    <strong className="block text-slate-900 font-bold">DISPATCH MODIFIED BY CLINICAL COORDINATOR</strong>
                    <span>Nurse transfer reduced from +4 to +2. Re-solving secondary bounds with zero penalty.</span>
                  </div>
                </div>
              )}

              {hitlStatus === 'rejected' && (
                <div className="p-4 rounded-xl bg-rose-100 border border-rose-300 text-xs font-mono text-rose-900 flex items-center gap-3">
                  <XCircle className="w-5 h-5 text-rose-700 shrink-0" />
                  <div>
                    <strong className="block text-slate-900 font-bold">DISPATCH OVERRULED BY SUPERVISOR</strong>
                    <span>Current shift roster maintained. Overrule justification recorded in compliance log.</span>
                  </div>
                </div>
              )}
            </div>

            {/* Right: Interactive Action Buttons (5 Cols) */}
            <div className="lg:col-span-5 flex flex-col gap-3 bg-slate-50 p-6 rounded-2xl border border-slate-200">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-700 mb-1">
                Coordinator Action Gates
              </span>

              <button
                onClick={() => setHitlAction('approved', 'Clinical Director approved full reallocation plan.')}
                disabled={hitlStatus === 'approved'}
                className="w-full flex items-center justify-between p-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-mono font-bold transition-all cursor-pointer shadow-sm disabled:opacity-50"
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
                className="w-full flex items-center justify-between p-3.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 text-xs font-mono font-bold transition-all cursor-pointer disabled:opacity-50"
              >
                <div className="flex items-center gap-2">
                  <Edit3 className="w-4 h-4 text-amber-600" />
                  <span>Modify Resource Bounds</span>
                </div>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setHitlAction('rejected', 'Clinical supervisor opted for internal ward deferral.')}
                disabled={hitlStatus === 'rejected'}
                className="w-full flex items-center justify-between p-3.5 rounded-xl bg-white hover:bg-rose-50 border border-rose-200 text-rose-700 text-xs font-mono font-bold transition-all cursor-pointer disabled:opacity-50"
              >
                <div className="flex items-center gap-2">
                  <XCircle className="w-4 h-4 text-rose-600" />
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
