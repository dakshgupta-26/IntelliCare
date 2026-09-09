import React from 'react';
import { ArrowRight, ChevronDown, Compass } from 'lucide-react';
import { HeroThreeScene } from './HeroThreeScene';
import { HeroFloatingCards } from './HeroFloatingCards';
import { useRouterStore } from '../../store/useRouterStore';

export const Hero: React.FC = () => {
  const navigate = useRouterStore((state) => state.navigate);

  const scrollToProblem = () => {
    const el = document.querySelector('#problem');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-[94vh] flex flex-col justify-between pt-28 sm:pt-32 pb-8 overflow-hidden bg-[#050814] text-slate-100">
      {/* Precision ambient background lighting & subtle grid */}
      <div className="absolute top-1/4 left-1/4 w-[600px] h-[500px] bg-cyan-500/[0.04] blur-[160px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-blue-600/[0.03] blur-[180px] pointer-events-none" />
      <div className="absolute inset-0 bg-grid-pattern opacity-15 pointer-events-none" />

      {/* Main Hero Asymmetric Split Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full my-auto z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* Left Column: Product Positioning & Editorial Typography (6.5 Cols) */}
        <div className="lg:col-span-6 xl:col-span-6 flex flex-col items-start text-left pt-4 lg:pt-0">
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0B1220] border border-white/[0.08] backdrop-blur-md mb-6 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-[11px] font-mono font-semibold tracking-wider text-slate-200 uppercase">
              AI-POWERED HOSPITAL OPERATIONS
            </span>
            <span className="text-slate-600">|</span>
            <span className="text-[10px] font-mono text-cyan-400 font-medium">MILP + LSTM + RAG</span>
          </div>

          {/* Main Editorial Headline */}
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-[68px] font-extrabold tracking-tight text-white leading-[1.06]">
            Predict what hospitals need.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-cyan-300 block mt-1">
              Before they need it.
            </span>
          </h1>

          {/* Supporting Copy */}
          <p className="mt-6 text-base sm:text-lg text-slate-300 max-w-xl leading-relaxed font-normal">
            IntelliCare combines real-time hospital telemetry, demand forecasting, contextual intelligence, and resource optimization to help hospital operations teams act before capacity becomes a constraint.
          </p>

          {/* Action Button Group */}
          <div className="mt-8 flex flex-col sm:flex-row items-center gap-3.5 w-full sm:w-auto">
            <button
              onClick={() => navigate('/app/dashboard')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-sans font-bold text-sm shadow-[0_2px_16px_rgba(25,199,243,0.3)] hover:shadow-[0_4px_24px_rgba(25,199,243,0.45)] transition-all duration-200 active:scale-[0.98] cursor-pointer"
            >
              <span>Launch Workspace</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => navigate('/platform')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-[#0B1020] hover:bg-[#101728] border border-white/[0.1] hover:border-white/[0.18] text-slate-200 hover:text-white font-sans font-medium text-sm transition-all duration-200 cursor-pointer"
            >
              <Compass className="w-4 h-4 text-cyan-400" />
              <span>Explore Platform</span>
            </button>
          </div>

          {/* Product trust line */}
          <div className="mt-8 flex items-center gap-2 text-xs font-mono text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
            <span>Digital Twin Hospital Operations &bull; Real-Time Decision Support</span>
          </div>
        </div>

        {/* Right Column: 3D Hospital Operations Digital Twin (6 Cols) */}
        <div className="lg:col-span-6 xl:col-span-6 relative w-full h-[360px] sm:h-[480px] lg:h-[560px] rounded-2xl overflow-hidden bg-[#0B1020]/90 border border-white/[0.08] shadow-[0_16px_48px_rgba(0,0,0,0.6)] backdrop-blur-xl flex items-center justify-center mt-4 lg:mt-0">
          <HeroThreeScene />
        </div>
      </div>

      {/* Floating Dynamic Metric Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10 mt-6 sm:mt-10">
        <HeroFloatingCards />
      </div>

      {/* Scroll indicator prompt */}
      <div
        className="relative z-10 mt-6 flex flex-col items-center gap-1 cursor-pointer mx-auto group"
        onClick={scrollToProblem}
      >
        <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider group-hover:text-cyan-400 transition-colors">
          Scroll to Explore Pipeline
        </span>
        <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-cyan-400 group-hover:translate-y-0.5 transition-all" />
      </div>
    </section>
  );
};

