import React, { useState, useEffect } from 'react';
import { X, Play, Pause, ArrowRight } from 'lucide-react';
import { useRouterStore } from '../../store/useRouterStore';
import { IntelliCareMark } from '../brand/IntelliCareMark';

interface HeroWatchDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface DemoStep {
  step: string;
  title: string;
  subtitle: string;
  badge: string;
  code: string;
  details: string;
  metrics: { label: string; value: string; color: string }[];
}

const DEMO_STEPS: DemoStep[] = [
  {
    step: '01',
    title: 'Real-Time Telemetry Ingestion',
    subtitle: 'Streaming 250Hz vitals from 32 ICU beds & 7 OR suites',
    badge: 'KAFKA EVENT BUS',
    code: 'INGEST: topic=hospital.telemetry.v1 bed_id=ICU-04 hr=74 spo2=98 bp="118/76" status=NOMINAL',
    details: 'IntelliCare ingests continuous medical telemetry with sub-50ms latency, filtering sensor artifacts and normalizing time-series across disparate HL7/FHIR hospital vendors.',
    metrics: [
      { label: 'Event Ingestion Rate', value: '4,200 msg/sec', color: 'text-cyan-400' },
      { label: 'Stream Latency', value: '18 ms', color: 'text-emerald-400' },
      { label: 'Active Beds Tracked', value: '32 / 32 Beds', color: 'text-white' }
    ]
  },
  {
    step: '02',
    title: 'Neural Demand & Deterioration Forecasting',
    subtitle: 'DeepAR + Temporal Fusion Transformers projecting 6h ahead',
    badge: 'LSTM NEURAL ENGINE',
    code: 'PREDICT: model=DeepAR_v3.2 horizon=6h target=ICU_OCCUPANCY p50=92.4% p90=96.1% confidence=0.984',
    details: 'Multi-horizon neural models forecast census surges, emergency department admissions, and patient deterioration risk hours before physical bed bottlenecks occur.',
    metrics: [
      { label: 'Forecast Horizon', value: '6 Hours', color: 'text-cyan-400' },
      { label: 'Forecast Accuracy', value: '99.4%', color: 'text-emerald-400' },
      { label: 'Surge Warning Lead Time', value: '4.2 Hours', color: 'text-amber-400' }
    ]
  },
  {
    step: '03',
    title: 'Mathematical MILP Resource Optimization',
    subtitle: 'Google OR-Tools Mixed Integer Linear Programming solver',
    badge: 'OR-TOOLS MILP SOLVER',
    code: 'SOLVE: solver=CBC_MIXED_INTEGER variables=142 constraints=89 objective=MIN_OVERFLOW solve_time=84ms',
    details: 'The solver evaluates thousands of staffing combinations, bed transfers, and elective surgery schedules against clinical constraints, producing the mathematically proven optimal resource allocation.',
    metrics: [
      { label: 'Solve Execution Time', value: '84 ms', color: 'text-cyan-400' },
      { label: 'Hard Constraints Met', value: '100%', color: 'text-emerald-400' },
      { label: 'Optimality Gap', value: '0.00%', color: 'text-purple-400' }
    ]
  },
  {
    step: '04',
    title: 'Human-in-the-Loop Clinical Governance',
    subtitle: 'Clinician-supervised action with cryptographic audit trail',
    badge: 'HUMAN-IN-THE-LOOP',
    code: 'GOVERN: status=PENDING_APPROVAL reviewer="Dr. Sarah Chen" action=TRANSFER_DISCHARGE hash=sha256_0x8f2a...',
    details: 'AI recommendations are never executed blindly. Hospital clinical directors review complete counterfactual explanations, projected impact, and sign off with a single click.',
    metrics: [
      { label: 'Clinical Review Time', value: '42 sec avg', color: 'text-cyan-400' },
      { label: 'Approval Rate', value: '94.2%', color: 'text-emerald-400' },
      { label: 'Audit Compliance', value: '100% HIPAA/FDA', color: 'text-indigo-400' }
    ]
  }
];

export const HeroWatchDemoModal: React.FC<HeroWatchDemoModalProps> = ({ isOpen, onClose }) => {
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const navigate = useRouterStore((state) => state.navigate);

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Auto step progression if playing
  useEffect(() => {
    if (!isOpen || !isPlaying) return;
    const timer = setInterval(() => {
      setActiveStepIndex((prev) => (prev + 1) % DEMO_STEPS.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [isOpen, isPlaying]);

  if (!isOpen) return null;

  const currentStep = DEMO_STEPS[activeStepIndex];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 select-none animate-in fade-in duration-200">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-black/85 backdrop-blur-md transition-opacity"
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-3xl rounded-2xl bg-[#060D1A] border border-cyan-500/30 shadow-[0_24px_60px_rgba(0,0,0,0.9)] overflow-hidden z-10 text-left">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.08] bg-[#040813]">
          <div className="flex items-center gap-3">
            <IntelliCareMark size={22} glow />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display font-bold text-white text-base">
                  IntelliCare Decision Pipeline Walkthrough
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 font-bold">
                  INTERACTIVE DEMO
                </span>
              </div>
              <p className="text-xs text-slate-400">
                End-to-end intelligence cycle: Telemetry → Forecasting → Optimization → Governance
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.08] transition-colors cursor-pointer"
            aria-label="Close demo"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stepper Tabs Bar */}
        <div className="grid grid-cols-4 border-b border-white/[0.08] bg-[#070E1E]/70">
          {DEMO_STEPS.map((s, idx) => {
            const isActive = idx === activeStepIndex;
            return (
              <button
                key={s.step}
                onClick={() => {
                  setActiveStepIndex(idx);
                  setIsPlaying(false);
                }}
                className={`py-3 px-3 text-left transition-all border-b-2 cursor-pointer ${
                  isActive
                    ? 'border-cyan-400 bg-cyan-500/[0.08] text-white'
                    : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-white/[0.02]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-mono font-bold ${isActive ? 'text-cyan-400' : 'text-slate-500'}`}>
                    STEP {s.step}
                  </span>
                  {isActive && <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />}
                </div>
                <div className="text-xs font-sans font-semibold truncate mt-0.5">
                  {s.title.split(' ')[0]} {s.title.split(' ')[1]}
                </div>
              </button>
            );
          })}
        </div>

        {/* Step Content Body */}
        <div className="p-6 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 font-bold">
                {currentStep.badge}
              </span>
              <h4 className="text-xl font-display font-bold text-white mt-1.5">
                {currentStep.title}
              </h4>
              <p className="text-xs text-slate-300 font-sans mt-0.5">
                {currentStep.subtitle}
              </p>
            </div>

            {/* Play/Pause control */}
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.1] text-xs font-mono text-slate-300 hover:text-white transition-colors cursor-pointer self-start sm:self-auto"
            >
              {isPlaying ? (
                <>
                  <Pause className="w-3.5 h-3.5 text-amber-400" />
                  <span>Pause Walkthrough</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Auto-Advance</span>
                </>
              )}
            </button>
          </div>

          {/* Terminal / Live Pipeline Code Execution Snippet */}
          <div className="p-3.5 rounded-xl bg-black/60 border border-white/[0.08] font-mono text-xs text-cyan-300 overflow-x-auto shadow-inner">
            <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-white/[0.06] text-[10px] text-slate-400">
              <span>LIVE PIPELINE LOGS</span>
              <span className="text-emerald-400">STATUS: RUNNING</span>
            </div>
            <code>{currentStep.code}</code>
          </div>

          <p className="text-sm text-slate-300 leading-relaxed font-sans">
            {currentStep.details}
          </p>

          {/* Real-time KPI Metric Badges */}
          <div className="grid grid-cols-3 gap-3 pt-1">
            {currentStep.metrics.map((m) => (
              <div key={m.label} className="p-3 rounded-xl bg-[#081122] border border-white/[0.08]">
                <div className="text-[10px] font-mono text-slate-400">{m.label}</div>
                <div className={`text-base font-display font-bold ${m.color} mt-0.5`}>
                  {m.value}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Modal Footer Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-6 py-4 border-t border-white/[0.08] bg-[#040813]">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setActiveStepIndex((prev) => (prev > 0 ? prev - 1 : DEMO_STEPS.length - 1));
                setIsPlaying(false);
              }}
              className="px-3 py-1.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.1] text-xs font-mono text-slate-300 transition-colors cursor-pointer"
            >
              Previous
            </button>
            <button
              onClick={() => {
                setActiveStepIndex((prev) => (prev + 1) % DEMO_STEPS.length);
                setIsPlaying(false);
              }}
              className="px-3 py-1.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.1] text-xs font-mono text-slate-300 transition-colors cursor-pointer"
            >
              Next Step →
            </button>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={() => {
                onClose();
                navigate('/app/dashboard');
              }}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-sans font-bold text-xs shadow-[0_2px_12px_rgba(25,199,243,0.3)] transition-all cursor-pointer"
            >
              <span>Open Live Workspace</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
