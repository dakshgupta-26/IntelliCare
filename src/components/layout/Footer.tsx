import React from 'react';
import { ShieldCheck, Cpu, CheckCircle2 } from 'lucide-react';
import { useRouterStore } from '../../store/useRouterStore';
import { IntelliCareLogo } from '../brand/IntelliCareLogo';

export const Footer: React.FC = () => {
  const navigate = useRouterStore((state) => state.navigate);

  return (
    <footer className="relative bg-[#030612] border-t border-white/[0.08] pt-16 pb-12 overflow-hidden text-slate-100">
      {/* Background illumination */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-cyan-500/[0.02] blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10 pb-12 border-b border-white/[0.08]">
          {/* Col 1 & 2: Brand & Platform Mission */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <div className="flex items-center">
              <button 
                onClick={() => navigate('/')} 
                className="text-left focus:outline-none cursor-pointer group"
                aria-label="IntelliCare Home"
              >
                <IntelliCareLogo variant="full" size="md" showBadge badgeText="AI OPS" animated />
              </button>
            </div>

            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              An intelligent operational operating system for modern hospital resource planning. Combining neural time-series forecasting, mathematical MILP optimization, contextual RAG, and human-in-the-loop decision governance.
            </p>

            <div className="flex flex-wrap items-center gap-2.5 pt-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#0B1220] border border-white/[0.08] text-[11px] font-mono text-slate-300">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Human-in-the-Loop</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#0B1220] border border-white/[0.08] text-[11px] font-mono text-slate-300">
                <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                <span>OR-Tools MILP Solver</span>
              </span>
            </div>

            {/* System Health Pill */}
            <div className="mt-2 inline-flex items-center gap-2 text-xs font-mono text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>All 8 Pipeline Microservices Synchronized</span>
            </div>
          </div>

          {/* Col 3: Platform */}
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
                  Platform
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/intelligence')}
                  className="hover:text-cyan-300 transition-colors text-left cursor-pointer"
                >
                  Intelligence
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/optimization')}
                  className="hover:text-cyan-300 transition-colors text-left cursor-pointer"
                >
                  Optimization
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/scenarios')}
                  className="hover:text-cyan-300 transition-colors text-left cursor-pointer"
                >
                  Scenarios
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

          {/* Col 4: Architecture & Technology */}
          <div className="flex flex-col gap-3">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
              Systems
            </span>
            <ul className="flex flex-col gap-2.5 text-sm text-slate-400">
              <li>
                <button
                  onClick={() => navigate('/architecture')}
                  className="hover:text-cyan-300 transition-colors text-left cursor-pointer"
                >
                  Architecture
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/technology')}
                  className="hover:text-cyan-300 transition-colors text-left cursor-pointer"
                >
                  Technology
                </button>
              </li>
              <li>
                <a
                  href="#lifecycle"
                  className="hover:text-cyan-300 transition-colors text-left"
                >
                  Operational Lifecycle
                </a>
              </li>
              <li>
                <a
                  href="#architecture-flow"
                  className="hover:text-cyan-300 transition-colors text-left"
                >
                  8-Stage Pipeline
                </a>
              </li>
            </ul>
          </div>

          {/* Col 5: Resources & Research */}
          <div className="flex flex-col gap-3">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
              Resources
            </span>
            <ul className="flex flex-col gap-2.5 text-sm text-slate-400">
              <li>
                <a
                  href="#technology"
                  className="hover:text-cyan-300 transition-colors text-left"
                >
                  Documentation
                </a>
              </li>
              <li>
                <a
                  href="#scenarios"
                  className="hover:text-cyan-300 transition-colors text-left"
                >
                  Research & Benchmarks
                </a>
              </li>
              <li>
                <button
                  onClick={() => navigate('/platform')}
                  className="hover:text-cyan-300 transition-colors text-left cursor-pointer"
                >
                  About IntelliCare
                </button>
              </li>
            </ul>
          </div>

          {/* Col 6: Legal & Compliance */}
          <div className="flex flex-col gap-3">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
              Legal
            </span>
            <ul className="flex flex-col gap-2.5 text-sm text-slate-400">
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
                <span className="text-xs text-slate-500">Privacy &bull; Terms</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Disclaimer & Copyright */}
        <div className="pt-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="max-w-2xl text-xs text-slate-500 leading-relaxed font-sans">
            <span className="font-semibold text-slate-400">Clinical & Operational Disclaimer: </span>
            IntelliCare is strictly an operational decision-support and hospital capacity management platform. It does not replace clinical judgement or autonomously administer medical directives. Human personnel remain responsible for all final decisions.
          </div>

          <div className="text-xs font-mono text-slate-500 shrink-0">
            &copy; 2026 IntelliCare &bull; AI-powered hospital operations
          </div>
        </div>
      </div>
    </footer>
  );
};
