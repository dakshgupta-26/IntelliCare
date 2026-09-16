import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { IntelliCareLogo } from '../../components/brand/IntelliCareLogo';
import { RegisterPanel } from './components/RegisterPanel';
import { ClinicalSpatialNetwork } from './components/ClinicalSpatialNetwork';
import { OnboardingTrustPillars } from './components/OnboardingTrustPillars';
import { useRouterStore } from '../../store/useRouterStore';
import { useCopilotStore } from '../../store/useCopilotStore';

export const RegisterPage: React.FC = () => {
  const navigate = useRouterStore((state) => state.navigate);
  const toggleCopilot = useCopilotStore((state) => state.toggleOpen);

  // Global keyboard shortcut: Cmd+K / Ctrl+K toggles IntelliCare Copilot
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        toggleCopilot();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleCopilot]);

  return (
    <div className="min-h-screen w-full bg-[#020617] text-slate-100 flex flex-col justify-between selection:bg-cyan-500/20 selection:text-cyan-400 relative overflow-x-hidden">
      {/* ----------------------------------------------------------------- */}
      {/* Ambient Lighting & Background Geometry Layers                     */}
      {/* ----------------------------------------------------------------- */}
      <div className="absolute top-1/4 left-1/6 w-[600px] h-[500px] bg-cyan-500/[0.03] blur-[180px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/6 w-[550px] h-[550px] bg-blue-600/[0.03] blur-[200px] pointer-events-none" />
      <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />

      {/* ----------------------------------------------------------------- */}
      {/* Top Mobile Brand Bar (Visible only on screens < lg)               */}
      {/* ----------------------------------------------------------------- */}
      <div className="lg:hidden w-full p-4 sm:p-6 flex items-center justify-between border-b border-white/[0.06] bg-[#030712]/90 backdrop-blur-xl z-20">
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center group cursor-pointer focus:outline-none"
          aria-label="IntelliCare Home"
        >
          <IntelliCareLogo variant="compact" size="sm" showBadge badgeText="PROVIDER REGISTRATION" animated />
        </button>

        <button
          onClick={toggleCopilot}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-mono font-medium hover:bg-cyan-500/20 transition-all cursor-pointer"
        >
          <Sparkles className="w-3 h-3 text-cyan-400" />
          <span>Copilot</span>
        </button>
      </div>

      {/* ----------------------------------------------------------------- */}
      {/* Main Desktop Split Composition Grid                               */}
      {/* ----------------------------------------------------------------- */}
      <div className="w-full max-w-[1720px] mx-auto flex-1 grid grid-cols-1 lg:grid-cols-12 z-10">
        {/* =============================================================== */}
        {/* LEFT COLUMN: Visual Intelligence & Governance (~58% on Desktop) */}
        {/* =============================================================== */}
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="hidden lg:flex lg:col-span-7 xl:col-span-7 flex-col justify-between p-8 sm:p-12 xl:p-16 border-r border-white/[0.06] relative"
        >
          {/* Top Brand Header */}
          <div className="flex items-center justify-between w-full">
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center group cursor-pointer focus:outline-none"
              aria-label="IntelliCare Home"
            >
              <IntelliCareLogo variant="with-tagline" size="md" showBadge badgeText="PROVIDER REGISTRATION" animated />
            </button>

            {/* Subtle Copilot Keyboard Shortcut Indicator */}
            <button
              onClick={toggleCopilot}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#050B14]/80 border border-white/[0.08] hover:border-cyan-500/30 text-xs font-mono text-slate-300 hover:text-white transition-all cursor-pointer shadow-sm group"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              <span>IntelliCare Copilot</span>
              <kbd className="px-1.5 py-0.5 rounded bg-white/[0.06] border border-white/[0.1] text-[10px] text-slate-400 font-normal">
                ⌘K
              </kbd>
            </button>
          </div>

          {/* Central Visual Intelligence Showcase */}
          <div className="space-y-6 my-auto py-6">
            {/* Editorial Eyebrow & Headline */}
            <div className="space-y-3 text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#070E1E]/80 border border-cyan-500/25 backdrop-blur-md shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#22d3ee]" />
                <span className="text-[11px] font-mono font-bold tracking-wider text-slate-200 uppercase">
                  CLINICAL ACCESS GOVERNANCE
                </span>
              </div>

              <h1 className="font-display text-3xl xl:text-5xl font-extrabold tracking-tight text-white leading-[1.08] max-w-xl">
                Hospital intelligence,
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-cyan-300 to-sky-400">
                  governed by verified clinicians.
                </span>
              </h1>

              <p className="text-sm font-sans text-slate-300 max-w-lg leading-relaxed">
                IntelliCare correlates telemetry, demand surges, and optimization solvers behind strict role verification and zero-trust session safeguards.
              </p>
            </div>

            {/* 3D Hospital Operational Network Viewport */}
            <div className="w-full h-[300px] xl:h-[350px] rounded-2xl overflow-hidden border border-white/[0.08] bg-[#030712]/60 shadow-[0_16px_48px_rgba(0,0,0,0.7)] relative backdrop-blur-md">
              <ClinicalSpatialNetwork />

              {/* Overlay Badge */}
              <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-[#030712]/85 border border-white/[0.1] text-[10px] font-mono text-slate-300 backdrop-blur-md flex items-center gap-1.5 shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                <span className="text-white font-bold">TOPOLOGICAL DIGITAL TWIN</span>
                <span className="text-slate-600">•</span>
                <span className="text-cyan-400">PROVISIONING MESH</span>
              </div>
            </div>

            {/* Controlled Access Trust Pillars */}
            <OnboardingTrustPillars />
          </div>

          {/* Left Area Footer */}
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 border-t border-white/[0.06] pt-4">
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center gap-1.5 text-slate-400 hover:text-cyan-400 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Platform Overview</span>
            </button>

            <span className="text-[11px] text-slate-400">
              Zero-Trust Architecture • Cryptographic Verification Protocol
            </span>
          </div>
        </motion.div>

        {/* =============================================================== */}
        {/* RIGHT COLUMN: Registration Form Area (~42% on Desktop)         */}
        {/* =============================================================== */}
        <motion.div
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-5 xl:col-span-5 flex flex-col items-center justify-center p-4 sm:p-8 lg:p-12 relative my-auto w-full"
        >
          {/* Main Structured Registration Panel */}
          <RegisterPanel />

          {/* Mobile Back Link (Visible only on screens < lg) */}
          <div className="lg:hidden pt-6 text-center">
            <button
              onClick={() => navigate('/')}
              className="text-xs font-mono text-slate-400 hover:text-cyan-400 transition-colors cursor-pointer inline-flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Platform Overview</span>
            </button>
          </div>
        </motion.div>
      </div>

      {/* ----------------------------------------------------------------- */}
      {/* Bottom Global Micro-Status Ribbon                                 */}
      {/* ----------------------------------------------------------------- */}
      <footer className="w-full max-w-[1720px] mx-auto px-6 py-3 border-t border-white/[0.06] flex items-center justify-between text-[11px] font-mono text-slate-400 z-10 select-none">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399]" />
          <span>IntelliCare Decision Support OS</span>
          <span className="text-slate-600">•</span>
          <span className="text-slate-400">Provider Provisioning Gateway</span>
        </div>

        <div className="hidden sm:flex items-center gap-4 text-slate-400">
          <span>Cluster: US-EAST (Metro Health Core)</span>
          <span>v2.4.0-prod</span>
        </div>
      </footer>
    </div>
  );
};
