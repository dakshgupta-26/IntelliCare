import React from 'react';
import { ArrowRight, Play, Sparkles, ChevronDown } from 'lucide-react';
import { Button } from '../ui/Button';
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

  const scrollToPipeline = () => {
    const el = document.querySelector('#product-flow');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-[96vh] flex flex-col justify-between pt-28 pb-12 overflow-hidden bg-section-dark text-slate-100 selection:bg-brand-cyan/20 selection:text-brand-cyan">
      {/* Background illumination & grid */}
      <div className="absolute top-1/3 left-1/3 w-[800px] h-[600px] bg-gradient-to-tr from-cyan-500/10 via-indigo-600/10 to-teal-500/10 blur-[180px] pointer-events-none" />
      <div className="absolute inset-0 bg-grid-pattern opacity-20 pointer-events-none" />

      {/* Main Hero Asymmetric Split Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full my-auto z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        {/* Left Column: Product Positioning & Editorial Typography (7 Cols) */}
        <div className="lg:col-span-6 xl:col-span-6 flex flex-col items-start text-left pt-6 lg:pt-0">
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface-100/90 border border-cyan-500/30 backdrop-blur-xl mb-6 shadow-[0_0_20px_rgba(22,199,243,0.15)]">
            <Sparkles className="w-3.5 h-3.5 text-brand-cyan animate-pulse" />
            <span className="text-xs font-mono font-bold tracking-wider text-cyan-300 uppercase">
              AI-POWERED HOSPITAL OPERATIONS
            </span>
            <span className="text-slate-600">|</span>
            <span className="text-[11px] font-mono text-slate-400">MILP + LSTM + RAG</span>
          </div>

          {/* Main Editorial Headline */}
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.08]">
            Predict what hospitals need.{' '}
            <span className="text-gradient-cyan block mt-1">
              Before they need it.
            </span>
          </h1>

          {/* Supporting Copy */}
          <p className="mt-6 text-base sm:text-lg text-slate-300 max-w-xl leading-relaxed font-normal">
            IntelliCare combines demand forecasting, resource optimization and contextual intelligence to help hospital teams make proactive operational decisions.
          </p>

          {/* Action Button Group */}
          <div className="mt-8 flex flex-col sm:flex-row items-center gap-3.5 w-full sm:w-auto">
            <Button
              size="lg"
              variant="primary"
              icon={<ArrowRight className="w-4 h-4" />}
              onClick={() => navigate('/platform')}
              className="w-full sm:w-auto shadow-[0_0_30px_rgba(22,199,243,0.4)] text-sm sm:text-base font-bold"
            >
              Explore IntelliCare
            </Button>

            <Button
              size="lg"
              variant="secondary"
              icon={<Play className="w-3.5 h-3.5 text-cyan-400 fill-cyan-400" />}
              iconPosition="left"
              onClick={scrollToPipeline}
              className="w-full sm:w-auto text-sm sm:text-base"
            >
              See How It Works
            </Button>
          </div>

          {/* Guarantee / trust note */}
          <div className="mt-8 flex items-center gap-2 text-xs font-mono text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Digital Twin Hospital Operations Environment &bull; Real-Time Decision Support</span>
          </div>
        </div>

        {/* Right Column: 3D Hospital Operations Environment (6 Cols) */}
        <div className="lg:col-span-6 xl:col-span-6 relative w-full h-[460px] sm:h-[540px] lg:h-[600px] rounded-3xl overflow-hidden bg-gradient-to-b from-surface-100/60 to-navy-950/80 border border-slate-800 shadow-2xl backdrop-blur-xl flex items-center justify-center">
          <HeroThreeScene />
        </div>
      </div>

      {/* Floating Dynamic Metric Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10 mt-10">
        <HeroFloatingCards />
      </div>

      {/* Scroll indicator prompt */}
      <div
        className="relative z-10 mt-6 flex flex-col items-center gap-1 cursor-pointer mx-auto"
        onClick={scrollToProblem}
      >
        <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Scroll to Explore</span>
        <ChevronDown className="w-3.5 h-3.5 text-cyan-400 animate-bounce" />
      </div>
    </section>
  );
};
