import React from 'react';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useRouterStore } from '../store/useRouterStore';
import { WhatIfSimulator } from '../components/scenarios/WhatIfSimulator';

export const ScenariosPage: React.FC = () => {
  const navigate = useRouterStore((state) => state.navigate);

  const simulationCapabilities = [
    {
      title: 'Stochastic Arrival Modeling',
      desc: 'Generates non-homogeneous Poisson presentation streams with calibrated variance parameters for extreme weather and epidemic surges.',
    },
    {
      title: 'Acuity State Transitions',
      desc: 'Simulates step-up from General Ward to ICU and step-down discharge velocity under bed conservation protocols.',
    },
    {
      title: 'Discrete-Event Resource Contention',
      desc: 'Models bottlenecks at CT scanners, trauma intake bays, isolation rooms, and surgical prep suites.',
    },
    {
      title: 'Automated Countermeasure Synthesis',
      desc: 'Instantly runs secondary MILP optimization to formulate proactive shift rebalancing before physical gridlock occurs.',
    },
  ];

  return (
    <div className="pt-28 pb-20 bg-section-dark text-slate-100 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back navigation */}
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-2 text-xs font-mono text-rose-400 hover:text-rose-300 mb-8 cursor-pointer transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </button>

        {/* Header */}
        <div className="max-w-4xl mb-14">
          <Badge variant="rose" size="md" className="mb-4">
            DEEP-DIVE &bull; RESILIENCE & STRESS-TESTING
          </Badge>

          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-[1.1]">
            Scenario Sandboxing & Disaster Simulation
          </h1>

          <p className="mt-6 text-xl text-slate-300 leading-relaxed font-normal">
            Digital twin capacity simulation allowing clinical directors to stress-test hospital workflows against mass casualty shocks and epidemic peaks before they occur.
          </p>
        </div>

        {/* Core Simulation Capabilities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {simulationCapabilities.map((c, idx) => (
            <div key={idx} className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col justify-between">
              <div>
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-rose-400 block mb-2">
                  Engine Pillar 0{idx + 1}
                </span>
                <h4 className="text-base font-display font-bold text-white mb-2">
                  {c.title}
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {c.desc}
                </p>
              </div>
              <div className="pt-4 mt-4 border-t border-slate-800/80 text-[10px] font-mono text-slate-500">
                Monte Carlo Simulation
              </div>
            </div>
          ))}
        </div>

        {/* Embedded Interactive Simulator */}
        <div className="mb-20">
          <WhatIfSimulator />
        </div>

        {/* Next Step CTA */}
        <div className="p-10 rounded-3xl bg-surface-100 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-2xl font-display font-bold text-white mb-1">
              Next: Enterprise Layered System Architecture
            </h3>
            <p className="text-sm text-slate-400">
              Inspect our 5-tier microservices architecture, gRPC channels, and airgapped VPC design.
            </p>
          </div>

          <Button
            variant="primary"
            icon={<ArrowRight className="w-4 h-4" />}
            onClick={() => navigate('/architecture')}
          >
            Explore Architecture
          </Button>
        </div>
      </div>
    </div>
  );
};
