import React from 'react';
import { Badge } from '../ui/Badge';
import { Zap, Cpu, Layers, Eye, Gauge, Code2 } from 'lucide-react';

export const PerformanceSection: React.FC = () => {
  const perfFeatures = [
    {
      icon: <Zap className="w-5 h-5 text-cyan-400" />,
      title: 'Vite Optimized Bundle',
      description: 'ESM native build architecture with tree-shaking, minimal bundle payload, and instant HMR development cycles.',
    },
    {
      icon: <Layers className="w-5 h-5 text-teal-400" />,
      title: 'Granular Code Splitting',
      description: 'Route and component-level dynamic imports ensuring fast initial content paint and zero unused JavaScript execution.',
    },
    {
      icon: <Cpu className="w-5 h-5 text-indigo-400" />,
      title: 'GPU-Aware WebGL Culling',
      description: 'Three.js canvas automatically throttles and pauses render loops when scrolled out of viewport, preserving device battery and GPU resources.',
    },
    {
      icon: <Eye className="w-5 h-5 text-emerald-400" />,
      title: 'Reduced Motion Accessibility',
      description: 'Respects system prefers-reduced-motion queries by disabling inertial scroll smoothing and dampening particle animations.',
    },
    {
      icon: <Gauge className="w-5 h-5 text-blue-400" />,
      title: 'Sub-100ms Solver Execution',
      description: 'MILP constraint formulations in Google OR-Tools converge to global optimums in milliseconds on standard cloud worker nodes.',
    },
    {
      icon: <Code2 className="w-5 h-5 text-violet-400" />,
      title: 'Zero Layout Shift (CLS)',
      description: 'Deterministic sizing, SVG viewBox scaling, and font-display swap eliminate visual jitter and maintain structural stability.',
    },
  ];

  return (
    <section className="relative py-28 bg-navy-900/60 border-t border-b border-slate-800/80 overflow-hidden">
      {/* Background illumination */}
      <div className="absolute top-1/2 right-1/4 w-[500px] h-[350px] bg-cyan-600/5 blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <Badge variant="cyan" size="md" className="mb-4">
            HIGH-THROUGHPUT RUNTIME
          </Badge>

          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight">
            Fast by design.
          </h2>

          <p className="mt-4 text-base sm:text-lg text-slate-400 leading-relaxed">
            Engineered with strict performance budgets across client rendering, WebSocket telemetry dispatching, and linear programming solver execution.
          </p>
        </div>

        {/* Performance Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {perfFeatures.map((f, idx) => (
            <div
              key={idx}
              className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col justify-between hover:border-cyan-500/30 transition-all duration-300"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-surface-200 border border-slate-700/60 flex items-center justify-center mb-4">
                  {f.icon}
                </div>

                <h3 className="text-base font-display font-bold text-white mb-2">
                  {f.title}
                </h3>

                <p className="text-xs text-slate-400 leading-relaxed">
                  {f.description}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-800/80 text-[11px] font-mono text-slate-500 flex items-center justify-between">
                <span>Engineering Standard</span>
                <span className="text-cyan-400">Optimized</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
