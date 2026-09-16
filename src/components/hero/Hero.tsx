import React, { useState } from 'react';
import { ArrowRight, ChevronDown, Play } from 'lucide-react';
import { HeroHospitalScene } from './HeroHospitalScene';
import { HeroFloatingCards } from './HeroFloatingCards';
import { HeroWatchDemoModal } from './HeroWatchDemoModal';
import { useRouterStore } from '../../store/useRouterStore';

export const Hero: React.FC = () => {
  const navigate = useRouterStore((state) => state.navigate);
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const el = document.querySelector(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-[96vh] flex flex-col justify-between pt-28 sm:pt-32 pb-8 overflow-hidden bg-[#040813] text-slate-100">
      {/* Cinematic ambient background glow */}
      <div className="absolute top-1/4 left-1/4 w-[650px] h-[500px] bg-cyan-500/[0.04] blur-[160px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-[550px] h-[550px] bg-blue-600/[0.03] blur-[180px] pointer-events-none" />
      <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />

      {/* Main Hero Asymmetric Split Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full my-auto z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
        {/* Left Column: Product Positioning & Editorial Typography (5.2 Cols) */}
        <div className="lg:col-span-5 xl:col-span-5 flex flex-col items-start text-left pt-2 lg:pt-0">
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#081122] border border-cyan-500/20 backdrop-blur-md mb-5 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-[11px] font-mono font-semibold tracking-wider text-slate-200 uppercase">
              AI-POWERED HOSPITAL OPERATIONS
            </span>
            <span className="text-slate-600">|</span>
            <span className="text-[10px] font-mono text-cyan-400 font-medium">MILP + LSTM + RAG</span>
          </div>

          {/* Main Editorial Headline */}
          <h1 className="font-display text-4xl sm:text-5xl md:text-5xl lg:text-[60px] font-extrabold tracking-tight text-white leading-[1.05]">
            Predict what hospitals need.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-cyan-300 to-teal-200 block mt-1">
              Before they need it.
            </span>
          </h1>

          {/* Supporting Narrative Copy */}
          <p className="mt-5 text-base sm:text-lg text-slate-300 max-w-lg leading-relaxed font-normal">
            IntelliCare combines real-time clinical telemetry, neural demand forecasting, contextual intelligence, and mathematical optimization to help hospital operations teams act before capacity becomes a crisis.
          </p>

          {/* Action Button Group */}
          <div className="mt-7 flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            <button
              onClick={() => navigate('/app/dashboard')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-sans font-bold text-sm shadow-[0_2px_16px_rgba(25,199,243,0.3)] hover:shadow-[0_4px_24px_rgba(25,199,243,0.45)] transition-all duration-200 active:scale-[0.98] cursor-pointer"
            >
              <span>Launch Workspace</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setIsDemoModalOpen(true)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-[#091224] hover:bg-[#0D1830] border border-cyan-500/20 hover:border-cyan-400/40 text-slate-200 hover:text-white font-sans font-medium text-sm transition-all duration-200 cursor-pointer group"
            >
              <Play className="w-3.5 h-3.5 text-cyan-400 group-hover:scale-110 transition-transform fill-cyan-400/30" />
              <span>Watch Demo</span>
            </button>
          </div>

          {/* 3-Pill Feature Strip */}
          <div className="mt-7 grid grid-cols-3 gap-2 w-full max-w-lg pt-1">
            <div className="p-2.5 rounded-xl bg-[#081122]/90 border border-white/[0.08] text-left">
              <div className="text-base font-display font-bold text-cyan-300">99.4%</div>
              <div className="text-[10px] font-mono text-slate-400 truncate">Forecast Precision</div>
            </div>
            <div className="p-2.5 rounded-xl bg-[#081122]/90 border border-white/[0.08] text-left">
              <div className="text-base font-display font-bold text-emerald-300">4.2 Hours</div>
              <div className="text-[10px] font-mono text-slate-400 truncate">Surge Lead Time</div>
            </div>
            <div className="p-2.5 rounded-xl bg-[#081122]/90 border border-white/[0.08] text-left">
              <div className="text-base font-display font-bold text-indigo-300">100%</div>
              <div className="text-[10px] font-mono text-slate-400 truncate">Human Governed</div>
            </div>
          </div>
        </div>

        {/* Right Column: Realistic ICU Clinical Digital Twin (6.8-7 Cols) */}
        <div className="lg:col-span-7 xl:col-span-7 relative w-full h-[400px] sm:h-[500px] lg:h-[580px] mt-4 lg:mt-0">
          <HeroHospitalScene />
        </div>
      </div>

      {/* 4-Step Decision Lifecycle Stepper Ribbon */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10 mt-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 p-1.5 rounded-2xl bg-[#060D1A]/80 border border-white/[0.08] backdrop-blur-xl">
          <button
            onClick={() => scrollToSection('#realtime')}
            className="flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-white/[0.04] transition-all text-left group cursor-pointer"
          >
            <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 font-mono text-xs font-bold shrink-0 group-hover:border-cyan-400">
              01
            </span>
            <div className="truncate">
              <div className="text-xs font-display font-bold text-white group-hover:text-cyan-300 transition-colors">
                Observe
              </div>
              <div className="text-[10px] font-mono text-slate-400 truncate">
                Telemetry & Ingestion
              </div>
            </div>
          </button>

          <button
            onClick={() => scrollToSection('#forecasting')}
            className="flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-white/[0.04] transition-all text-left group cursor-pointer"
          >
            <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono text-xs font-bold shrink-0 group-hover:border-emerald-400">
              02
            </span>
            <div className="truncate">
              <div className="text-xs font-display font-bold text-white group-hover:text-emerald-300 transition-colors">
                Predict
              </div>
              <div className="text-[10px] font-mono text-slate-400 truncate">
                Neural LSTM Forecasting
              </div>
            </div>
          </button>

          <button
            onClick={() => scrollToSection('#optimization')}
            className="flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-white/[0.04] transition-all text-left group cursor-pointer"
          >
            <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-mono text-xs font-bold shrink-0 group-hover:border-indigo-400">
              03
            </span>
            <div className="truncate">
              <div className="text-xs font-display font-bold text-white group-hover:text-indigo-300 transition-colors">
                Optimize
              </div>
              <div className="text-[10px] font-mono text-slate-400 truncate">
                OR-Tools MILP Solver
              </div>
            </div>
          </button>

          <button
            onClick={() => scrollToSection('#hitl')}
            className="flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-white/[0.04] transition-all text-left group cursor-pointer"
          >
            <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 font-mono text-xs font-bold shrink-0 group-hover:border-rose-400">
              04
            </span>
            <div className="truncate">
              <div className="text-xs font-display font-bold text-white group-hover:text-rose-300 transition-colors">
                Decide
              </div>
              <div className="text-[10px] font-mono text-slate-400 truncate">
                Human-in-the-Loop Governance
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Floating Dynamic Metric Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10 mt-6 sm:mt-8">
        <HeroFloatingCards />
      </div>

      {/* Scroll indicator prompt */}
      <div
        className="relative z-10 mt-5 flex flex-col items-center gap-1 cursor-pointer mx-auto group"
        onClick={() => scrollToSection('#problem')}
      >
        <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider group-hover:text-cyan-400 transition-colors">
          Scroll to Explore Pipeline
        </span>
        <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-cyan-400 group-hover:translate-y-0.5 transition-all" />
      </div>

      {/* Interactive Watch Demo Walkthrough Modal */}
      <HeroWatchDemoModal
        isOpen={isDemoModalOpen}
        onClose={() => setIsDemoModalOpen(false)}
      />
    </section>
  );
};
