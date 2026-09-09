import React from 'react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { ArrowRight, Layers, ShieldCheck, Activity, Cpu, Sparkles } from 'lucide-react';
import { useRouterStore } from '../../store/useRouterStore';

export const FinalCTA: React.FC = () => {
  const navigate = useRouterStore((state) => state.navigate);

  return (
    <section className="relative py-36 bg-midnight-950 overflow-hidden text-center text-slate-100 border-t border-slate-800/80">
      {/* Background illumination & subtle radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[500px] bg-gradient-to-tr from-cyan-500/10 via-blue-600/5 to-teal-500/10 blur-[180px] pointer-events-none" />
      <div className="absolute inset-0 bg-grid-pattern opacity-15 pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col items-center">
        <Badge variant="cyan" size="md" className="mb-8">
          OPERATIONAL FORESIGHT ENGINE
        </Badge>

        <h2 className="font-display text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.08] uppercase">
          The hospital doesn't need more dashboards.{' '}
          <span className="text-gradient-cyan block mt-2">
            It needs foresight.
          </span>
        </h2>

        <p className="mt-7 text-lg sm:text-2xl text-slate-300 max-w-2xl leading-relaxed font-normal">
          Turn operational data into proactive decisions.
        </p>

        {/* CTA Buttons */}
        <div className="mt-12 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <Button
            size="lg"
            variant="primary"
            icon={<ArrowRight className="w-4 h-4" />}
            onClick={() => navigate('/app/dashboard')}
            className="w-full sm:w-auto shadow-[0_0_30px_rgba(6,182,212,0.35)] text-base font-bold"
          >
            Launch IntelliCare Workspace →
          </Button>

          <Button
            size="lg"
            variant="secondary"
            icon={<Layers className="w-4 h-4 text-cyan-400" />}
            iconPosition="left"
            onClick={() => navigate('/architecture')}
            className="w-full sm:w-auto text-base font-bold bg-surface-100 border-slate-700 hover:bg-surface-200"
          >
            Explore Architecture
          </Button>
        </div>

        {/* Trust assurance badges */}
        <div className="mt-16 flex flex-wrap justify-center items-center gap-8 text-xs font-mono text-slate-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Human-in-the-Loop Governance</span>
          </div>
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-cyan-400" />
            <span>Exact MILP Mathematical Solver</span>
          </div>
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-teal-400" />
            <span>Multi-Horizon Neural Forecasting</span>
          </div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span>Grounded Institutional SOPs</span>
          </div>
        </div>
      </div>
    </section>
  );
};
