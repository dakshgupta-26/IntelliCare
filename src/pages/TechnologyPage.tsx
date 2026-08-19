import React from 'react';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useRouterStore } from '../store/useRouterStore';
import { TechEcosystem } from '../components/technology/TechEcosystem';
import { PerformanceSection } from '../components/performance/PerformanceSection';

export const TechnologyPage: React.FC = () => {
  const navigate = useRouterStore((state) => state.navigate);

  return (
    <div className="pt-28 pb-20 bg-section-dark text-slate-100 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back navigation */}
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-2 text-xs font-mono text-cyan-400 hover:text-cyan-300 mb-8 cursor-pointer transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </button>

        {/* Header */}
        <div className="max-w-4xl mb-14">
          <Badge variant="cyan" size="md" className="mb-4">
            DEEP-DIVE &bull; TECHNOLOGY STACK & ECOSYSTEM
          </Badge>

          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-[1.1]">
            Production-Grade Healthcare Intelligence Stack
          </h1>

          <p className="mt-6 text-xl text-slate-300 leading-relaxed font-normal">
            Every layer of IntelliCare is built with battle-tested open standards, strict type systems, deterministic solvers, and low-latency microservices.
          </p>
        </div>

        {/* Embedded Interactive Tech Ecosystem Explorer */}
        <div className="mb-20">
          <TechEcosystem />
        </div>

        {/* Performance Standards */}
        <div className="mb-20">
          <PerformanceSection />
        </div>

        {/* Bottom CTA */}
        <div className="p-10 rounded-3xl bg-surface-100 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-2xl font-display font-bold text-white mb-1">
              Ready to explore the IntelliCare Platform?
            </h3>
            <p className="text-sm text-slate-400">
              Return to the homepage or experience our interactive decision-support demonstrations.
            </p>
          </div>

          <Button
            variant="primary"
            icon={<ArrowRight className="w-4 h-4" />}
            onClick={() => navigate('/')}
          >
            Explore Platform
          </Button>
        </div>
      </div>
    </div>
  );
};
