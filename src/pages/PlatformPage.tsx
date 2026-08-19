import React from 'react';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { ArrowLeft, ArrowRight, TrendingUp, Cpu, ShieldCheck, Zap, Sparkles } from 'lucide-react';
import { useRouterStore } from '../store/useRouterStore';
import { BentoGrid } from '../components/bento/BentoGrid';
import { SecuritySection } from '../components/security/SecuritySection';
import { PerformanceSection } from '../components/performance/PerformanceSection';

export const PlatformPage: React.FC = () => {
  const navigate = useRouterStore((state) => state.navigate);

  return (
    <div className="pt-28 pb-20 bg-section-dark text-slate-100 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb / Back button */}
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-2 text-xs font-mono text-cyan-400 hover:text-cyan-300 mb-8 cursor-pointer transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Overview</span>
        </button>

        {/* Page Hero */}
        <div className="max-w-4xl mb-16">
          <Badge variant="cyan" size="md" className="mb-4">
            INTELLICARE PLATFORM ARCHITECTURE
          </Badge>

          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-[1.1]">
            An intelligent operating layer for modern hospital resource planning.
          </h1>

          <p className="mt-6 text-xl text-slate-300 leading-relaxed font-normal">
            IntelliCare connects existing hospital data silos to predictive neural forecasting, mathematical resource optimization, contextual knowledge grounding, and scenario simulations.
          </p>
        </div>

        {/* Core Value Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          <div className="glass-panel p-8 rounded-3xl border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-6">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-display font-bold text-white mb-3">
                Anticipate Surges Early
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Multi-horizon LSTM neural networks detect patient arrival spikes up to 48 hours in advance, allowing administrative staff to adjust rotas before physical overcrowding starts.
              </p>
            </div>
            <div className="pt-6 mt-6 border-t border-slate-800/80 text-xs font-mono text-cyan-400 flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Conformal Prediction Bounds</span>
            </div>
          </div>

          <div className="glass-panel p-8 rounded-3xl border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 mb-6">
                <Cpu className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-display font-bold text-white mb-3">
                Exact Constraint Optimization
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Google OR-Tools Mixed-Integer Linear Programming formulates hospital resource allocations mathematically, satisfying statutory nurse-to-patient ratios with zero overtime penalties.
              </p>
            </div>
            <div className="pt-6 mt-6 border-t border-slate-800/80 text-xs font-mono text-teal-400 flex items-center gap-2">
              <Zap className="w-3.5 h-3.5" />
              <span>Sub-100ms Global Solver</span>
            </div>
          </div>

          <div className="glass-panel p-8 rounded-3xl border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-6">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-display font-bold text-white mb-3">
                Human-in-the-Loop Authority
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                No automated decisions occur in isolation. Every reallocation vector is explained with citations to institutional SOPs and requires explicit clinical supervisor sign-off.
              </p>
            </div>
            <div className="pt-6 mt-6 border-t border-slate-800/80 text-xs font-mono text-indigo-400 flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Immutable Cryptographic Audit</span>
            </div>
          </div>
        </div>

        {/* Detailed Bento Capabilities */}
        <div className="mb-20">
          <BentoGrid />
        </div>

        {/* Security & Governance */}
        <div className="mb-20">
          <SecuritySection />
        </div>

        {/* Performance Standards */}
        <div className="mb-20">
          <PerformanceSection />
        </div>

        {/* Bottom Navigation CTAs */}
        <div className="p-10 rounded-3xl bg-surface-100 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-2xl font-display font-bold text-white mb-1">
              Ready to dive deeper into our algorithms?
            </h3>
            <p className="text-sm text-slate-400">
              Explore our neural time-series forecasting architecture and mathematical solver formulations.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Button
              variant="secondary"
              onClick={() => navigate('/intelligence')}
            >
              Forecasting Engine
            </Button>
            <Button
              variant="primary"
              icon={<ArrowRight className="w-4 h-4" />}
              onClick={() => navigate('/optimization')}
            >
              Optimization Solver
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
