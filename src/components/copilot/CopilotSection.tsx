import React, { useState } from 'react';
import { Sparkles, MessageSquare, CheckCircle2, ShieldCheck } from 'lucide-react';
import { useCopilotStore } from '../../store/useCopilotStore';

interface CopilotPreset {
  id: string;
  query: string;
  recommendation: string;
  reason: string;
  context: string;
  metrics: { label: string; value: string; trend?: 'up' | 'down' | 'neutral' }[];
  confidence: number;
  suggestedAction: string;
}

export const CopilotSection: React.FC = () => {
  const setOpen = useCopilotStore((state) => state.setOpen);
  const sendMessage = useCopilotStore((state) => state.sendMessage);

  const handleOpenPrompt = (prompt: string) => {
    setOpen(true);
    sendMessage(prompt);
  };

  const copilotPresets: CopilotPreset[] = [
    {
      id: 'icu-pressure',
      query: 'Why is ICU capacity under pressure?',
      recommendation: 'Preemptively mobilize 2 float nurses from Step-Down to ICU Wing A',
      reason: 'Projected acute admissions from Emergency triage spike at 20:00 will push nurse-to-patient ratio beyond the statutory 1:2 threshold.',
      context: 'Grounded in SOP-ICU-4.2 (Critical Care Staffing) and historical evening turnover patterns.',
      metrics: [
        { label: 'Current ICU Load', value: '92%' },
        { label: 'Projected Influx', value: '+14.8%' },
        { label: 'Tension Window', value: '19:00 - 23:00' },
        { label: 'Target Ratio', value: '1:2.0' },
      ],
      confidence: 94,
      suggestedAction: 'Authorize nurse transfer directive #DISP-2026-B4',
    },
    {
      id: 'forecast-tomorrow',
      query: "Forecast tomorrow's demand.",
      recommendation: 'Maintain +4 general ward buffer beds in anticipation of regional weather front',
      reason: 'Multi-horizon LSTM model predicts a +18.4% uptick in respiratory presentation presentations beginning at 06:00 tomorrow.',
      context: 'Correlated with regional meteorological drop (-8°C) and influenza surveillance index.',
      metrics: [
        { label: 'Expected Surge', value: '+18.4%' },
        { label: 'Peak Hour', value: '11:00 AM' },
        { label: 'Model Confidence', value: '91% (95% CI)' },
        { label: 'Surge Buffer Needed', value: '4 Beds' },
      ],
      confidence: 91,
      suggestedAction: 'Schedule elective discharge rounds at 08:30',
    },
    {
      id: 'optimize-staffing',
      query: 'Optimize staffing.',
      recommendation: 'Rebalance 3 float nurses to Emergency and release 1 surgical float to PACU standby',
      reason: 'Google OR-Tools MILP solver identified global optimal distribution satisfying statutory ratios with zero overtime penalty.',
      context: 'Formulated with hard nurse ratios and soft penalization on inter-department transfers.',
      metrics: [
        { label: 'Solve Latency', value: '84ms' },
        { label: 'Constraint Violations', value: '0' },
        { label: 'Wait Time Reduction', value: '↓ 18%' },
        { label: 'Staff Utilization', value: '82%' },
      ],
      confidence: 98,
      suggestedAction: 'Dispatch electronic shift rota update to ward charge nurses',
    },
    {
      id: 'surge-scenario',
      query: 'Run a +20% surge scenario.',
      recommendation: 'Execute Surge Tier 2 protocol: activate auxiliary triage bays 7–10',
      reason: 'At +20% presentation rate without intervention, emergency wait times reach 68 minutes within 45 minutes.',
      context: 'Derived from discrete-event stochastic simulation run against campus topology.',
      metrics: [
        { label: 'Unmitigated Wait Time', value: '68 min' },
        { label: 'IntelliCare Wait Time', value: '26 min' },
        { label: 'Diversion Prevented', value: '100%' },
        { label: 'Surge Cost Saved', value: '$18,400' },
      ],
      confidence: 93,
      suggestedAction: 'Pre-clear 3 step-down patients to general ward',
    },
    {
      id: 'explain-recommendation',
      query: 'Explain this recommendation.',
      recommendation: 'Audit reasoning chain for Directive #DISP-2026-B4',
      reason: 'Patient acuity vectors indicate 3 Level-2 patients arriving in Bay 4 with expected ICU escalation probability of 78%.',
      context: 'Verified against Clinical Policy ICU-SURGE-104 §4.2 and Attending Physician shift logs.',
      metrics: [
        { label: 'Vector Accuracy', value: '96.2%' },
        { label: 'Policy Match Score', value: '0.94' },
        { label: 'Audit Hash', value: 'sha256:d8a9e' },
        { label: 'Reviewer Required', value: 'Charge RN' },
      ],
      confidence: 96,
      suggestedAction: 'Sign digital dispatch verification in compliance ledger',
    },
  ];

  const [activePreset, setActivePreset] = useState<CopilotPreset>(copilotPresets[0]);
  const [isAuthorized, setIsAuthorized] = useState<boolean>(false);

  const handleSelectPreset = (preset: CopilotPreset) => {
    setActivePreset(preset);
    setIsAuthorized(false);
  };

  return (
    <section id="copilot" className="relative py-16 sm:py-20 lg:py-24 bg-[#050814] text-slate-100 border-t border-white/[0.08] overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-1/3 right-1/4 w-[600px] h-[500px] bg-cyan-500/[0.03] blur-[170px] pointer-events-none" />
      <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="max-w-4xl mx-auto text-center mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0B1220] border border-white/[0.08] mb-5 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span className="text-[11px] font-mono font-bold tracking-wider text-slate-200 uppercase">
              AI COPILOT COMMAND INTERFACE
            </span>
            <span className="text-slate-600">|</span>
            <span className="text-[10px] font-mono text-cyan-400 font-medium">NATURAL LANGUAGE OPS</span>
          </div>

          <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-[1.08]">
            Ask IntelliCare.
          </h2>

          <p className="mt-5 text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Query operational capacity, trigger scenario stress tests, and inspect mathematical rebalancing directives in real time.
          </p>
        </div>

        {/* Suggestion Chips */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 max-w-5xl mx-auto mb-10">
          {copilotPresets.map((preset) => {
            const isSelected = preset.id === activePreset.id;
            return (
              <button
                key={preset.id}
                onClick={() => handleSelectPreset(preset)}
                className={`px-4 py-2 rounded-xl text-xs font-mono transition-all duration-200 cursor-pointer flex items-center gap-2 border ${
                  isSelected
                    ? 'bg-cyan-500/10 border-cyan-400 text-cyan-300 shadow-[0_0_15px_rgba(25,199,243,0.15)] font-bold'
                    : 'bg-[#0B1220] border-white/[0.08] text-slate-400 hover:text-white hover:bg-[#0E1626]'
                }`}
              >
                <MessageSquare className={`w-3.5 h-3.5 ${isSelected ? 'text-cyan-400' : 'text-slate-500'}`} />
                <span>{preset.query}</span>
              </button>
            );
          })}
        </div>

        {/* Integrated Command Panel Window */}
        <div className="max-w-5xl mx-auto p-6 sm:p-10 rounded-2xl bg-[#0B1220] border border-white/[0.08] shadow-2xl space-y-6">
          {/* Active Query Display Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-white/[0.08]">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase text-slate-400 block tracking-wider">
                  Coordinator Command Prompt:
                </span>
                <span className="text-base sm:text-lg font-display font-bold text-white">
                  "{activePreset.query}"
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <span className="text-xs font-mono px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 font-bold">
                {activePreset.confidence}% Confidence
              </span>
              <button
                onClick={() => handleOpenPrompt(activePreset.query)}
                className="text-xs font-mono text-cyan-400 hover:text-cyan-300 underline underline-offset-4 cursor-pointer hidden sm:inline-block"
              >
                Open in Full Panel &rarr;
              </button>
            </div>
          </div>

          {/* Structured Intelligence Response Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left: Recommendation & Rationale (7 Cols) */}
            <div className="lg:col-span-7 space-y-4">
              <div className="p-4 rounded-xl bg-[#070B17] border border-white/[0.06]">
                <span className="text-[10px] font-mono uppercase text-cyan-400 tracking-wider block mb-1 font-bold">
                  IntelliCare Recommendation:
                </span>
                <div className="text-base sm:text-lg font-display font-bold text-white leading-snug">
                  {activePreset.recommendation}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#070B17] border border-white/[0.06] text-xs font-mono space-y-2">
                <div>
                  <span className="text-slate-400 uppercase text-[10px] block mb-0.5">Reason:</span>
                  <p className="text-slate-200 font-sans leading-relaxed">{activePreset.reason}</p>
                </div>
                <div className="pt-2 border-t border-white/[0.04]">
                  <span className="text-slate-400 uppercase text-[10px] block mb-0.5">Context Grounding:</span>
                  <p className="text-slate-300 font-sans leading-relaxed">{activePreset.context}</p>
                </div>
              </div>

              {/* Action Gate */}
              <div className="p-4 rounded-xl bg-[#070B17] border border-white/[0.06] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] font-mono uppercase text-slate-400 block mb-0.5">Suggested Action:</span>
                  <span className="text-xs font-mono font-bold text-cyan-300 block">{activePreset.suggestedAction}</span>
                </div>

                <button
                  onClick={() => setIsAuthorized(true)}
                  className={`px-4 py-2 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer shrink-0 flex items-center gap-1.5 ${
                    isAuthorized
                      ? 'bg-emerald-500 text-slate-950 shadow-md'
                      : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{isAuthorized ? 'Directive Signed' : 'Authorize Action'}</span>
                </button>
              </div>
            </div>

            {/* Right: Metrics & Governance Status (5 Cols) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="p-4 rounded-xl bg-[#070B17] border border-white/[0.06]">
                <span className="text-[10px] font-mono uppercase text-slate-400 tracking-wider block mb-3 font-bold">
                  Derived Operational Telemetry
                </span>
                <div className="grid grid-cols-2 gap-2.5">
                  {activePreset.metrics.map((m, idx) => (
                    <div key={idx} className="p-2.5 rounded-lg bg-[#0B1220] border border-white/[0.04] text-xs font-mono">
                      <span className="text-slate-400 text-[10px] block truncate">{m.label}</span>
                      <span className="text-sm font-bold text-white block mt-0.5">{m.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-blue-950/20 border border-blue-500/30 text-xs font-mono text-slate-300 flex items-start gap-3">
                <ShieldCheck className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="font-bold text-blue-300 block uppercase tracking-wider text-[10px]">
                    Operational Decision Support
                  </span>
                  <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
                    Human approval required for execution. IntelliCare assists coordinators and does not autonomously dispatch hospital staff.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
