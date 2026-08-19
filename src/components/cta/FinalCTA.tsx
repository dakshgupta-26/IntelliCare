import React from 'react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { ArrowRight, Layers, ShieldCheck, Activity, Sparkles } from 'lucide-react';
import { useRouterStore } from '../../store/useRouterStore';

export const FinalCTA: React.FC = () => {
  const navigate = useRouterStore((state) => state.navigate);

  return (
    <section className="relative py-36 bg-section-dark overflow-hidden text-center text-slate-100">
      {/* Background illumination & subtle radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[600px] bg-gradient-to-tr from-cyan-500/15 via-blue-600/10 to-indigo-600/15 blur-[180px] pointer-events-none" />
      <div className="absolute inset-0 bg-grid-pattern opacity-25 pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col items-center">
        <Badge variant="cyan" size="md" className="mb-8">
          OPERATIONAL RESILIENCE STARTS HERE
        </Badge>

        <h2 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.08]">
          Make hospital operations{' '}
          <span className="text-gradient-cyan">
            more predictable.
          </span>
        </h2>

        <p className="mt-7 text-lg sm:text-2xl text-slate-300 max-w-2xl leading-relaxed font-normal">
          IntelliCare turns complex operational signals into actionable intelligence.
        </p>

        {/* CTA Buttons */}
        <div className="mt-12 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <Button
            size="lg"
            variant="primary"
            icon={<ArrowRight className="w-4 h-4" />}
            onClick={() => navigate('/platform')}
            className="w-full sm:w-auto shadow-[0_0_40px_rgba(22,199,243,0.45)] text-base"
          >
            Explore IntelliCare
          </Button>

          <Button
            size="lg"
            variant="secondary"
            icon={<Layers className="w-4 h-4 text-cyan-400" />}
            iconPosition="left"
            onClick={() => navigate('/architecture')}
            className="w-full sm:w-auto text-base"
          >
            View Architecture
          </Button>
        </div>

        {/* Trust assurance badges */}
        <div className="mt-16 flex flex-wrap justify-center items-center gap-8 text-xs font-mono text-slate-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Human-in-the-Loop Governance</span>
          </div>
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-cyan-400" />
            <span>Exact MILP Constraint Solver</span>
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
