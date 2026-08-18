import React, { useState } from 'react';
import { TECH_STACK } from '../../data/techStack';
import { Badge } from '../ui/Badge';

export const TechEcosystem: React.FC = () => {
  const categories = [
    'All',
    'Frontend',
    'Motion',
    'Backend',
    'Communication',
    'Data & Storage',
    'AI & ML',
    'Optimization',
    'Infrastructure',
  ] as const;

  const [activeCategory, setActiveCategory] = useState<string>('All');

  const filteredTech =
    activeCategory === 'All'
      ? TECH_STACK
      : TECH_STACK.filter((item) => item.category === activeCategory);

  return (
    <section id="technology" className="relative py-28 bg-navy-950 overflow-hidden">
      {/* Background illumination */}
      <div className="absolute bottom-0 right-1/3 w-[600px] h-[400px] bg-cyan-600/5 blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mb-14">
          <Badge variant="cyan" size="md" className="mb-4">
            TECHNOLOGY ECOSYSTEM
          </Badge>

          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight">
            Production-grade stack by design.
          </h2>

          <p className="mt-4 text-base sm:text-lg text-slate-400 leading-relaxed">
            Every layer of IntelliCare is built with battle-tested open standards, strict type systems, and deterministic mathematical solvers.
          </p>
        </div>

        {/* Filter Category Chips */}
        <div className="flex flex-wrap gap-2 mb-10 pb-2 overflow-x-auto">
          {categories.map((cat) => {
            const isActive = cat === activeCategory;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-mono font-medium transition-all duration-200 cursor-pointer border shrink-0 ${
                  isActive
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                    : 'bg-surface-100 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-surface-200'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Tech Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTech.map((tech, idx) => (
            <div
              key={idx}
              className="glass-panel-interactive p-6 rounded-2xl border border-slate-800 flex flex-col justify-between group hover:border-cyan-500/40 transition-all duration-300"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-400">
                    {tech.category}
                  </span>
                  <Badge variant="slate" size="sm">
                    {tech.badge}
                  </Badge>
                </div>

                <h3 className="text-lg font-display font-bold text-white mb-1 group-hover:text-cyan-300 transition-colors">
                  {tech.name}
                </h3>

                <span className="text-xs font-mono text-slate-400 block mb-3">
                  {tech.role}
                </span>

                <p className="text-xs text-slate-400 leading-relaxed">
                  {tech.description}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-500">
                <span>Architecture Tier</span>
                <span className="text-emerald-400">Verified Integration</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
