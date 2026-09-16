import React, { useState, useRef } from 'react';
import { ArrowRight, Play, Activity, TrendingUp, Cpu } from 'lucide-react';
import { HeroHospitalScene } from './HeroHospitalScene';
import { HeroWatchDemoModal } from './HeroWatchDemoModal';
import { useRouterStore } from '../../store/useRouterStore';

export const Hero: React.FC = () => {
  const navigate = useRouterStore((state) => state.navigate);
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const heroRef = useRef<HTMLElement | null>(null);

  // Subtle 3D mouse parallax tilt across whole hero section
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const hero = heroRef.current;
    if (!hero) return;

    const rect = hero.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Smooth subtle tilt (-2deg to +2deg)
    const rotateY = ((x - centerX) / centerX) * 2;
    const rotateX = -((y - centerY) / centerY) * 2;

    setTilt({ rotateX, rotateY });
  };

  const handleMouseLeave = () => {
    setTilt({ rotateX: 0, rotateY: 0 });
  };

  const scrollToSection = (sectionId: string) => {
    const el = document.querySelector(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section 
      ref={heroRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative min-h-[96vh] lg:min-h-screen w-full flex flex-col justify-between pt-24 sm:pt-28 pb-4 sm:pb-6 overflow-hidden bg-[#030612] text-slate-100 select-none"
    >
      {/* ----------------------------------------------------------------- */}
      {/* 1. Full-Bleed Photorealistic Hospital Digital Twin Backdrop       */}
      {/* ----------------------------------------------------------------- */}
      <HeroHospitalScene tilt={tilt} />

      {/* ----------------------------------------------------------------- */}
      {/* 2. Top-Right Ambient Tagline                                      */}
      {/* ----------------------------------------------------------------- */}
      <div className="w-full max-w-[1720px] mx-auto px-6 sm:px-10 lg:px-12 xl:px-16 z-20 flex justify-end">
        <div className="hidden lg:inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#060D1A]/70 border border-white/[0.08] backdrop-blur-md text-[11px] font-mono tracking-wider text-slate-300 shadow-sm">
          <span className="w-1 h-3 rounded-full bg-cyan-400" />
          <span>REAL-TIME INTELLIGENCE FOR REAL-WORLD CARE</span>
        </div>
      </div>

      {/* ----------------------------------------------------------------- */}
      {/* 3. Main Hero Content Area (Left Column Text & Editorial)          */}
      {/* ----------------------------------------------------------------- */}
      <div className="w-full max-w-[1720px] mx-auto px-6 sm:px-10 lg:px-12 xl:px-16 z-20 my-auto flex items-center justify-between">
        <div className="max-w-xl lg:max-w-2xl text-left py-4 sm:py-6">
          {/* Eyebrow Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#070E1E]/80 border border-cyan-500/25 backdrop-blur-md mb-5 shadow-[0_0_15px_rgba(34,211,238,0.15)]">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#22d3ee]" />
            <span className="text-[11px] font-mono font-bold tracking-wider text-slate-200 uppercase">
              AI-POWERED HOSPITAL OPERATIONS
            </span>
          </div>

          {/* Main Editorial Headline (Matching user reference) */}
          <h1 className="font-display text-4xl sm:text-5xl lg:text-[62px] xl:text-[72px] font-extrabold tracking-tight text-white leading-[1.04]">
            Predict what
            <br />
            hospitals need.
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-cyan-300 to-sky-400 drop-shadow-[0_0_24px_rgba(34,211,238,0.35)]">
              Before they need it.
            </span>
          </h1>

          {/* Supporting Narrative Copy */}
          <p className="mt-5 sm:mt-6 text-sm sm:text-base lg:text-lg text-slate-300 max-w-lg leading-relaxed font-normal">
            IntelliCare combines real-time hospital telemetry, demand forecasting, and contextual intelligence to help care teams act early, allocate resources smarter, and keep patient care uninterrupted.
          </p>

          {/* Action Button Row */}
          <div className="mt-7 sm:mt-8 flex flex-col sm:flex-row items-center gap-3.5 w-full sm:w-auto">
            <button
              onClick={() => navigate('/app/dashboard')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl bg-gradient-to-r from-cyan-400 to-cyan-500 hover:from-cyan-300 hover:to-cyan-400 text-slate-950 font-sans font-bold text-sm shadow-[0_0_25px_rgba(34,211,238,0.4)] hover:shadow-[0_0_35px_rgba(34,211,238,0.6)] transition-all duration-200 active:scale-[0.98] cursor-pointer"
            >
              <span>Launch Workspace</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setIsDemoModalOpen(true)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#060D1A]/80 hover:bg-[#0B1528]/90 border border-white/[0.12] hover:border-cyan-400/40 text-slate-200 hover:text-white font-sans font-medium text-sm backdrop-blur-xl transition-all duration-200 cursor-pointer group shadow-lg"
            >
              <Play className="w-3.5 h-3.5 text-cyan-400 group-hover:scale-110 transition-transform fill-cyan-400/40" />
              <span>Watch Demo</span>
            </button>
          </div>

          {/* 3 Circular Feature Badges Row (Directly matching the image) */}
          <div className="mt-8 flex flex-wrap items-center gap-4 sm:gap-6 pt-1">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.2)]">
                <Activity className="w-4 h-4" />
              </div>
              <span className="text-xs font-medium text-slate-200">
                Real-Time Decision Support
              </span>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 shadow-[0_0_12px_rgba(59,130,246,0.2)]">
                <TrendingUp className="w-4 h-4" />
              </div>
              <span className="text-xs font-medium text-slate-200">
                AI-Powered Forecasting
              </span>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 shadow-[0_0_12px_rgba(20,184,166,0.2)]">
                <Cpu className="w-4 h-4" />
              </div>
              <span className="text-xs font-medium text-slate-200">
                Optimized Resource Allocation
              </span>
            </div>
          </div>
        </div>

        {/* Empty flex column on right: Allows the photorealistic patient, nurse, doctor & HUD cards to breathe without occlusion */}
        <div className="hidden lg:block lg:w-[48%]" />
      </div>

      {/* ----------------------------------------------------------------- */}
      {/* 4. Bottom Control Ribbon: Scroll + 4-Step Stepper + Social Proof  */}
      {/* ----------------------------------------------------------------- */}
      <div className="w-full max-w-[1720px] mx-auto px-6 sm:px-10 lg:px-12 xl:px-16 z-20 pt-2 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Left: Scroll to explore mouse pill */}
        <div className="hidden sm:flex items-center gap-2.5 text-xs font-mono text-slate-400">
          <div className="w-4 h-7 rounded-full border-2 border-slate-500/60 flex items-start justify-center p-1">
            <div className="w-1 h-1.5 rounded-full bg-cyan-400 animate-bounce" />
          </div>
          <span>Scroll to explore</span>
        </div>

        {/* Center: 4-Step Decision Stepper Ribbon */}
        <div className="flex items-center gap-1.5 sm:gap-2 p-1 rounded-full bg-[#060D1A]/85 border border-white/[0.1] backdrop-blur-2xl shadow-xl">
          <button
            onClick={() => scrollToSection('#realtime')}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 text-xs font-sans font-bold shadow-[0_0_12px_rgba(34,211,238,0.25)] cursor-pointer"
          >
            <span className="font-mono text-[10px]">01</span>
            <span>Observe</span>
          </button>

          <button
            onClick={() => scrollToSection('#forecasting')}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full hover:bg-white/[0.06] text-slate-400 hover:text-white text-xs font-sans transition-colors cursor-pointer"
          >
            <span className="font-mono text-[10px]">02</span>
            <span>Predict</span>
          </button>

          <button
            onClick={() => scrollToSection('#optimization')}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full hover:bg-white/[0.06] text-slate-400 hover:text-white text-xs font-sans transition-colors cursor-pointer"
          >
            <span className="font-mono text-[10px]">03</span>
            <span>Optimize</span>
          </button>

          <button
            onClick={() => scrollToSection('#hitl')}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full hover:bg-white/[0.06] text-slate-400 hover:text-white text-xs font-sans transition-colors cursor-pointer"
          >
            <span className="font-mono text-[10px]">04</span>
            <span>Decide</span>
          </button>
        </div>

        {/* Right: Social Proof Pill */}
        <div 
          onClick={() => navigate('/app/dashboard')}
          className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-[#060D1A]/85 border border-white/[0.1] backdrop-blur-2xl shadow-lg hover:border-cyan-400/40 transition-all cursor-pointer group"
        >
          <div className="flex -space-x-2">
            <img 
              className="w-6 h-6 rounded-full border border-[#060D1A] object-cover ring-1 ring-cyan-500/30" 
              src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=64" 
              alt="Dr. Sarah Chen" 
            />
            <img 
              className="w-6 h-6 rounded-full border border-[#060D1A] object-cover ring-1 ring-cyan-500/30" 
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=64" 
              alt="Alex Ross" 
            />
            <img 
              className="w-6 h-6 rounded-full border border-[#060D1A] object-cover ring-1 ring-cyan-500/30" 
              src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=64" 
              alt="Dr. Marcus Vance" 
            />
          </div>
          <span className="text-xs font-sans font-medium text-slate-200">
            Trusted by <strong className="text-white font-bold">500+</strong> hospitals
          </span>
          <ArrowRight className="w-3.5 h-3.5 text-cyan-400 group-hover:translate-x-0.5 transition-transform" />
        </div>
      </div>

      {/* ----------------------------------------------------------------- */}
      {/* 5. Interactive Demo Walkthrough Modal                             */}
      {/* ----------------------------------------------------------------- */}
      <HeroWatchDemoModal 
        isOpen={isDemoModalOpen} 
        onClose={() => setIsDemoModalOpen(false)} 
      />
    </section>
  );
};
