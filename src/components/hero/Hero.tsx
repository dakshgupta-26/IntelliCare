import React from 'react';
import { ArrowRight, Play, Shield } from 'lucide-react';
import { Button } from '../ui/Button';
import { HeroThreeScene } from './HeroThreeScene';
import { HeroFloatingCards } from './HeroFloatingCards';

export const Hero: React.FC = () => {
  const scrollToSection = (id: string) => {
    const el = document.querySelector(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-[95vh] flex flex-col justify-center items-center pt-32 pb-20 overflow-hidden bg-background">
      {/* Radial lighting glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-gradient-to-tr from-cyan-500/15 via-blue-600/10 to-indigo-600/15 blur-[130px] pointer-events-none" />
      <div className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none" />

      {/* 3D WebGL Hospital Intelligence Network */}
      <HeroThreeScene />

      {/* Foreground Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
        {/* Top Operational Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-surface-100/80 border border-cyan-500/30 backdrop-blur-xl mb-8 shadow-[0_0_20px_rgba(6,182,212,0.15)] animate-fade-in">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-cyan" />
          </span>
          <span className="text-xs font-mono font-medium text-cyan-300">
            ENTERPRISE AI FOR HEALTHCARE LOGISTICS
          </span>
          <span className="text-slate-600">|</span>
          <span className="text-[11px] font-mono text-slate-400">MILP + LSTM + RAG</span>
        </div>

        {/* Hero Headline */}
        <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-tight text-white leading-[1.05] max-w-4xl">
          Predict. Optimize.{' '}
          <span className="text-gradient-cyan">
            Decide.
          </span>
        </h1>

        {/* Subheadline */}
        <p className="mt-6 text-xl sm:text-2xl font-display font-medium text-slate-200 max-w-2xl">
          AI-powered intelligence for smarter hospital operations.
        </p>

        {/* Supporting Text */}
        <p className="mt-4 text-base sm:text-lg text-slate-400 max-w-2xl leading-relaxed">
          IntelliCare transforms hospital operational data into predictive insights, optimized resource allocation, contextual recommendations, and scenario-based decision support.
        </p>

        {/* CTA Button Group */}
        <div className="mt-10 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <Button
            size="lg"
            variant="primary"
            icon={<ArrowRight className="w-4 h-4" />}
            onClick={() => scrollToSection('#optimization-demo')}
            className="w-full sm:w-auto shadow-[0_0_30px_rgba(6,182,212,0.4)]"
          >
            Explore IntelliCare
          </Button>

          <Button
            size="lg"
            variant="secondary"
            icon={<Play className="w-4 h-4 text-cyan-400 fill-cyan-400" />}
            iconPosition="left"
            onClick={() => scrollToSection('#pipeline')}
            className="w-full sm:w-auto"
          >
            See How It Works
          </Button>
        </div>

        {/* Concept Notice */}
        <div className="mt-6 flex items-center gap-2 text-xs font-mono text-slate-500">
          <Shield className="w-3.5 h-3.5 text-slate-400" />
          <span>Interactive Demonstrator &bull; Decision-Support Architecture</span>
        </div>
      </div>

      {/* Floating Dynamic Metric Cards */}
      <HeroFloatingCards />
    </section>
  );
};
