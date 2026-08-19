import React from 'react';
import { Activity, Shield, Cpu, ExternalLink } from 'lucide-react';
import { useRouterStore } from '../../store/useRouterStore';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const navigate = useRouterStore((state) => state.navigate);

  return (
    <footer className="relative bg-navy-950 border-t border-slate-800/80 pt-16 pb-12 overflow-hidden text-slate-100">
      {/* Background illumination */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-cyan-500/5 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800/80">
          {/* Col 1 & 2: Brand & Platform Mission */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-400 to-indigo-600 p-[1px]">
                <div className="w-full h-full bg-navy-950 rounded-[11px] flex items-center justify-center">
                  <Activity className="w-4 h-4 text-cyan-400" />
                </div>
              </div>
              <span className="font-display font-bold text-lg text-white">IntelliCare</span>
            </div>

            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              An intelligent operating layer for modern hospital resource planning. Combining multi-horizon forecasting, mathematical optimization, contextual RAG, and scenario simulation.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-surface-100 border border-slate-800 text-[11px] font-mono text-slate-300">
                <Shield className="w-3.5 h-3.5 text-emerald-400" />
                <span>Human Governance</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-surface-100 border border-slate-800 text-[11px] font-mono text-slate-300">
                <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                <span>Google OR-Tools MILP</span>
              </span>
            </div>
          </div>

          {/* Col 3: Core Platform */}
          <div className="flex flex-col gap-3">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
              Product Suite
            </span>
            <ul className="flex flex-col gap-2 text-sm text-slate-400">
              <li>
                <button
                  onClick={() => navigate('/platform')}
                  className="hover:text-cyan-300 transition-colors text-left cursor-pointer"
                >
                  Platform Overview
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/intelligence')}
                  className="hover:text-cyan-300 transition-colors text-left cursor-pointer"
                >
                  Demand Forecasting
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/optimization')}
                  className="hover:text-cyan-300 transition-colors text-left cursor-pointer"
                >
                  Resource Optimization
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/scenarios')}
                  className="hover:text-cyan-300 transition-colors text-left cursor-pointer"
                >
                  Scenario Simulation
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Systems & Specs */}
          <div className="flex flex-col gap-3">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
              Architecture & Stack
            </span>
            <ul className="flex flex-col gap-2 text-sm text-slate-400">
              <li>
                <button
                  onClick={() => navigate('/architecture')}
                  className="hover:text-cyan-300 transition-colors text-left cursor-pointer"
                >
                  System Architecture
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/technology')}
                  className="hover:text-cyan-300 transition-colors text-left cursor-pointer"
                >
                  Technology Ecosystem
                </button>
              </li>
              <li>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-cyan-300 transition-colors inline-flex items-center gap-1.5"
                >
                  <span>GitHub Repository</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
            </ul>
          </div>

          {/* Col 5: Performance & Standards */}
          <div className="flex flex-col gap-3">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
              Engineering Standards
            </span>
            <ul className="flex flex-col gap-2 text-sm text-slate-400">
              <li className="font-mono text-xs text-slate-400">PyTorch GPU Inference</li>
              <li className="font-mono text-xs text-slate-400">OR-Tools MILP Convergence</li>
              <li className="font-mono text-xs text-slate-400">pgvector Hybrid Search</li>
              <li className="font-mono text-xs text-slate-400">Three.js Spatial Intelligence</li>
              <li className="font-mono text-xs text-slate-400">Airgapped VPC Security</li>
            </ul>
          </div>
        </div>

        {/* Disclaimer & Copyright */}
        <div className="pt-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="max-w-2xl text-xs text-slate-500 leading-relaxed font-sans">
            <span className="font-semibold text-slate-400">Operational Disclaimer: </span>
            IntelliCare is designed for operational decision support and does not provide autonomous clinical diagnosis or treatment decisions.
          </div>

          <div className="text-xs font-mono text-slate-500 shrink-0">
            &copy; {currentYear} IntelliCare. Built for modern hospital resource planning.
          </div>
        </div>
      </div>
    </footer>
  );
};
