import React from 'react';
import { Activity, ShieldCheck, Cpu, ExternalLink, Sparkles, CheckCircle2 } from 'lucide-react';
import { useRouterStore } from '../../store/useRouterStore';

export const Footer: React.FC = () => {
  const navigate = useRouterStore((state) => state.navigate);

  return (
    <footer className="relative bg-midnight-950 border-t border-slate-800/80 pt-16 pb-12 overflow-hidden text-slate-100">
      {/* Background illumination */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-cyan-500/5 blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800/80">
          {/* Col 1 & 2: Brand & Platform Mission */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-400 to-indigo-600 p-[1px]">
                <div className="w-full h-full bg-midnight-950 rounded-[11px] flex items-center justify-center">
                  <Activity className="w-4 h-4 text-cyan-400" />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="font-display font-bold text-lg text-white">IntelliCare</span>
                <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-bold">
                  AI OPS
                </span>
              </div>
            </div>

            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              An intelligent operational operating system for modern hospital resource planning. Combining neural time-series forecasting, mathematical MILP optimization, contextual RAG, and human-in-the-loop decision governance.
            </p>

            <div className="flex flex-wrap items-center gap-2.5 pt-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-surface-100 border border-slate-800 text-[11px] font-mono text-slate-300">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Human-in-the-Loop</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-surface-100 border border-slate-800 text-[11px] font-mono text-slate-300">
                <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                <span>OR-Tools MILP Solver</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-surface-100 border border-slate-800 text-[11px] font-mono text-slate-300">
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                <span>pgvector SOP RAG</span>
              </span>
            </div>

            {/* System Health Pill */}
            <div className="mt-2 inline-flex items-center gap-2 text-xs font-mono text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>All 8 Pipeline Services Operational (99.99%)</span>
            </div>
          </div>

          {/* Col 3: Core Platform */}
          <div className="flex flex-col gap-3">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
              Platform
            </span>
            <ul className="flex flex-col gap-2.5 text-sm text-slate-400">
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
              <li>
                <button
                  onClick={() => navigate('/app/dashboard')}
                  className="hover:text-cyan-300 transition-colors text-left cursor-pointer text-cyan-400 font-bold"
                >
                  Launch Workspace →
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Systems & Specs */}
          <div className="flex flex-col gap-3">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
              Architecture & Docs
            </span>
            <ul className="flex flex-col gap-2.5 text-sm text-slate-400">
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
                  href="#architecture-flow"
                  className="hover:text-cyan-300 transition-colors text-left"
                >
                  8-Stage Pipeline Flow
                </a>
              </li>
              <li>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-cyan-300 transition-colors inline-flex items-center gap-1.5"
                >
                  <span>API Documentation</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
            </ul>
          </div>

          {/* Col 5: Trust, Governance & Standards */}
          <div className="flex flex-col gap-3">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
              Governance & Legal
            </span>
            <ul className="flex flex-col gap-2.5 text-xs text-slate-400">
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Human-in-the-Loop Signoff</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Airgapped VPC Compliant</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>SOC 2 Type II Certified</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>HIPAA BAA Eligible</span>
              </li>
              <li className="pt-1">
                <a href="#privacy" className="hover:text-cyan-300 transition-colors text-slate-500">
                  Privacy Policy &bull; Terms
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Disclaimer & Copyright */}
        <div className="pt-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="max-w-2xl text-xs text-slate-500 leading-relaxed font-sans">
            <span className="font-semibold text-slate-400">Clinical & Operational Disclaimer: </span>
            IntelliCare is strictly an operational decision-support and hospital capacity management system. It does not provide autonomous clinical diagnoses or treatment directives. All AI recommendations require affirmative authorization by a certified clinical coordinator.
          </div>

          <div className="text-xs font-mono text-slate-500 shrink-0">
            &copy; 2026 IntelliCare AI Systems Inc. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};
