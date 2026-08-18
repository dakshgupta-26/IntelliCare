import React from 'react';
import { Activity, Shield, Cpu } from 'lucide-react';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="relative bg-navy-950 border-t border-slate-800/80 pt-16 pb-12 overflow-hidden">
      {/* Subtle background glow */}
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
              AI-powered hospital operational intelligence combining multi-horizon time-series forecasting, Mixed-Integer Linear Programming optimization, and contextual knowledge retrieval for resilient healthcare logistics.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-surface-100 border border-slate-800 text-[11px] font-mono text-slate-300">
                <Shield className="w-3.5 h-3.5 text-emerald-400" />
                <span>Human-in-the-Loop Governance</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-surface-100 border border-slate-800 text-[11px] font-mono text-slate-300">
                <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                <span>OR-Tools MILP</span>
              </span>
            </div>
          </div>

          {/* Col 3: Intelligence Platform */}
          <div className="flex flex-col gap-3">
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-200">
              Platform & Models
            </span>
            <ul className="flex flex-col gap-2 text-sm text-slate-400">
              <li>
                <a
                  href="#intelligence"
                  onClick={(e) => handleSmoothScroll(e, '#intelligence')}
                  className="hover:text-cyan-300 transition-colors"
                >
                  LSTM Demand Forecasting
                </a>
              </li>
              <li>
                <a
                  href="#intelligence"
                  onClick={(e) => handleSmoothScroll(e, '#intelligence')}
                  className="hover:text-cyan-300 transition-colors"
                >
                  XGBoost Baseline Model
                </a>
              </li>
              <li>
                <a
                  href="#optimization"
                  onClick={(e) => handleSmoothScroll(e, '#optimization')}
                  className="hover:text-cyan-300 transition-colors"
                >
                  MILP Resource Allocation
                </a>
              </li>
              <li>
                <a
                  href="#rag"
                  onClick={(e) => handleSmoothScroll(e, '#rag')}
                  className="hover:text-cyan-300 transition-colors"
                >
                  Hybrid RAG & SOP Grounding
                </a>
              </li>
              <li>
                <a
                  href="#scenarios"
                  onClick={(e) => handleSmoothScroll(e, '#scenarios')}
                  className="hover:text-cyan-300 transition-colors"
                >
                  What-If Scenario Sandbox
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Systems & Integration */}
          <div className="flex flex-col gap-3">
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-200">
              Architecture & Protocols
            </span>
            <ul className="flex flex-col gap-2 text-sm text-slate-400">
              <li>
                <a
                  href="#architecture"
                  onClick={(e) => handleSmoothScroll(e, '#architecture')}
                  className="hover:text-cyan-300 transition-colors"
                >
                  Layered System Architecture
                </a>
              </li>
              <li>
                <a
                  href="#technology"
                  onClick={(e) => handleSmoothScroll(e, '#technology')}
                  className="hover:text-cyan-300 transition-colors"
                >
                  gRPC & WebSocket Pipelines
                </a>
              </li>
              <li>
                <a
                  href="#security"
                  onClick={(e) => handleSmoothScroll(e, '#security')}
                  className="hover:text-cyan-300 transition-colors"
                >
                  RBAC & Audit Logging
                </a>
              </li>
              <li>
                <a
                  href="#realtime"
                  onClick={(e) => handleSmoothScroll(e, '#realtime')}
                  className="hover:text-cyan-300 transition-colors"
                >
                  Live Telemetry Ingestion
                </a>
              </li>
            </ul>
          </div>

          {/* Col 5: Developers & Code */}
          <div className="flex flex-col gap-3">
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-200">
              Technology Stack
            </span>
            <ul className="flex flex-col gap-2 text-sm text-slate-400">
              <li className="flex items-center gap-1">
                <span>React 18 + Vite + TS</span>
              </li>
              <li className="flex items-center gap-1">
                <span>GSAP 3 + Lenis Smooth</span>
              </li>
              <li className="flex items-center gap-1">
                <span>Three.js WebGL Engine</span>
              </li>
              <li className="flex items-center gap-1">
                <span>Google OR-Tools MILP</span>
              </li>
              <li className="flex items-center gap-1">
                <span>Python FastAPI & Kafka</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Disclaimer & Copyright */}
        <div className="pt-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="max-w-2xl text-xs text-slate-500 leading-relaxed">
            <span className="font-semibold text-slate-400">Operational Disclaimer: </span>
            IntelliCare is a software platform designed for hospital resource forecasting, mathematical optimization, and operational decision support. It is engineered to assist healthcare administrative personnel and clinical operations coordinators in capacity planning. It does not provide autonomous clinical triage or medical diagnosis. All interactive interface data shown is illustrative demonstration telemetry.
          </div>

          <div className="text-xs font-mono text-slate-500 shrink-0">
            &copy; {currentYear} IntelliCare AI. Built for resilient hospital operations.
          </div>
        </div>
      </div>
    </footer>
  );
};
