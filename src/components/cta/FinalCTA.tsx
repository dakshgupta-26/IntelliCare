import React from 'react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { ArrowRight, Layers, Activity, ShieldCheck, Sparkles } from 'lucide-react';

export const FinalCTA: React.FC = () => {
  const scrollToSection = (id: string) => {
    const el = document.querySelector(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative py-32 bg-navy-950 overflow-hidden text-center">
      {/* Background illumination & grid */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-gradient-to-tr from-cyan-500/10 via-blue-600/10 to-indigo-600/10 blur-[160px] pointer-events-none" />
      <div className="absolute inset-0 bg-grid-pattern opacity-20 pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col items-center">
        <Badge variant="cyan" size="md" className="mb-6">
          OPERATIONAL RESILIENCE STARTS HERE
        </Badge>

        <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white leading-tight">
          Turn hospital complexity into{' '}
          <span className="text-gradient-cyan">intelligence.</span>
        </h2>

        <p className="mt-6 text-lg sm:text-xl text-slate-300 max-w-2xl leading-relaxed">
          Predict demand. Optimize resources. Understand the context. Make better operational decisions.
        </p>

        {/* CTA Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <Button
            size="lg"
            variant="primary"
            icon={<ArrowRight className="w-4 h-4" />}
            onClick={() => scrollToSection('#optimization-demo')}
            className="w-full sm:w-auto shadow-[0_0_35px_rgba(6,182,212,0.45)]"
          >
            Explore IntelliCare
          </Button>

          <Button
            size="lg"
            variant="secondary"
            icon={<Layers className="w-4 h-4 text-cyan-400" />}
            iconPosition="left"
            onClick={() => scrollToSection('#architecture')}
            className="w-full sm:w-auto"
          >
            View Architecture
          </Button>
        </div>

        {/* Guarantee metadata badges */}
        <div className="mt-12 flex flex-wrap justify-center items-center gap-6 text-xs font-mono text-slate-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Human-in-the-Loop Governance</span>
          </div>
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-cyan-400" />
            <span>Exact MILP Constraint Formulations</span>
          </div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span>Grounded Institutional SOPs</span>
          </div>
        </div>
      </div>
    </section>
  );
};
