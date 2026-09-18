import React, { useState, useRef, useEffect } from 'react';
import { ArrowRight, Play, Activity, TrendingUp, Cpu } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { HeroHospitalScene } from './HeroHospitalScene';
import { HeroWatchDemoModal } from './HeroWatchDemoModal';
import { useRouterStore } from '../../store/useRouterStore';
import { scrollToTarget } from '../../hooks/useLenis';
import { useReducedMotion } from '../../hooks/useReducedMotion';

gsap.registerPlugin(ScrollTrigger);

export const Hero: React.FC = () => {
  const navigate = useRouterStore((state) => state.navigate);
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const heroRef = useRef<HTMLElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const prefersReducedMotion = useReducedMotion();

  // Subtle 3D mouse parallax tilt across whole hero section
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (prefersReducedMotion) return;
    const hero = heroRef.current;
    if (!hero) return;

    const rect = hero.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Restrained subtle tilt (-1.5deg to +1.5deg)
    const rotateY = ((x - centerX) / centerX) * 1.5;
    const rotateX = -((y - centerY) / centerY) * 1.5;

    setTilt({ rotateX, rotateY });
  };

  const handleMouseLeave = () => {
    setTilt({ rotateX: 0, rotateY: 0 });
  };

  // GSAP Layered Scroll-linked Parallax
  useEffect(() => {
    if (prefersReducedMotion || !heroRef.current) return;

    const ctx = gsap.context(() => {
      // Subtle upward translation and gentle fade for content
      gsap.to(contentRef.current, {
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 0.6,
        },
        y: -40,
        opacity: 0.85,
        ease: 'none',
      });
    }, heroRef);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <section 
      ref={heroRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative min-h-[100svh] w-full flex flex-col justify-between pt-20 sm:pt-24 lg:pt-28 pb-4 sm:pb-6 overflow-hidden bg-[#030612] text-slate-100 select-none"
    >
      {/* ----------------------------------------------------------------- */}
      {/* 1. Full-Bleed Photorealistic Hospital Digital Twin Backdrop       */}
      {/* ----------------------------------------------------------------- */}
      <HeroHospitalScene tilt={tilt} />

      {/* ----------------------------------------------------------------- */}
      {/* 2. Top-Right Ambient Tagline                                      */}
      {/* ----------------------------------------------------------------- */}
      <div className="w-full z-20 flex justify-end pl-[clamp(28px,4vw,80px)] pr-[clamp(20px,3vw,56px)]">
        <div className="hidden lg:inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#040816]/75 border border-white/[0.08] backdrop-blur-md text-[11px] font-mono tracking-wider text-slate-300 shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#22d3ee]" />
          <span>REAL-TIME INTELLIGENCE FOR REAL-WORLD CARE</span>
        </div>
      </div>

      {/* ----------------------------------------------------------------- */}
      {/* 3. Main Hero Content Area: Edge-to-Edge Composition               */}
      {/* Left content strongly anchored to left viewport edge               */}
      {/* Right hospital visual expansive with controlled right breathing room*/}
      {/* ----------------------------------------------------------------- */}
      <div className="w-full z-20 my-auto flex items-center justify-between pl-[clamp(28px,4vw,80px)] pr-[clamp(20px,3vw,56px)]">
        {/* Left Column Text & Editorial (42% - 46% width) */}
        <div 
          ref={contentRef}
          className="w-full lg:w-[48%] xl:w-[45%] 2xl:w-[42%] text-left py-4 sm:py-6 relative z-20"
        >
          {/* Eyebrow Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#070E1E]/80 border border-cyan-500/25 backdrop-blur-md mb-4 sm:mb-5 shadow-[0_0_15px_rgba(34,211,238,0.15)]">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#22d3ee]" />
            <span className="text-[11px] font-mono font-bold tracking-wider text-slate-200 uppercase">
              AI-POWERED HOSPITAL OPERATIONS
            </span>
          </div>

          {/* Main Editorial Headline */}
          <h1 className="font-display text-4xl sm:text-5xl lg:text-[52px] xl:text-[62px] 2xl:text-[70px] font-extrabold tracking-tight text-white leading-[1.04]">
            Predict what
            <br />
            hospitals need.
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-cyan-300 to-sky-400 drop-shadow-[0_0_24px_rgba(34,211,238,0.35)]">
              Before they need it.
            </span>
          </h1>

          {/* Supporting Narrative Copy */}
          <p className="mt-5 sm:mt-6 text-sm sm:text-base lg:text-lg text-slate-300 max-w-xl leading-relaxed font-normal">
            IntelliCare combines real-time hospital telemetry, demand forecasting, and contextual intelligence to help care teams act early, allocate resources smarter, and keep patient care uninterrupted.
          </p>

          {/* Action Button Row */}
          <div className="mt-7 sm:mt-8 flex flex-col sm:flex-row items-center gap-3.5 w-full sm:w-auto">
            {/* Launch Workspace Primary CTA */}
            <button
              onClick={() => navigate('/app/dashboard')}
              className="group relative w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl bg-gradient-to-r from-cyan-400 to-cyan-500 hover:from-cyan-300 hover:to-cyan-400 text-slate-950 font-sans font-bold text-sm shadow-[0_0_25px_rgba(34,211,238,0.35)] hover:shadow-[0_0_35px_rgba(34,211,238,0.55)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer"
            >
              <span>Launch Workspace</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
            </button>

            {/* Watch Demo Secondary Action */}
            <button
              onClick={() => setIsDemoModalOpen(true)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#060D1A]/80 hover:bg-[#0B1528]/90 border border-white/[0.12] hover:border-cyan-400/40 text-slate-200 hover:text-white font-sans font-medium text-sm backdrop-blur-xl transition-all duration-200 cursor-pointer group shadow-lg"
            >
              <Play className="w-3.5 h-3.5 text-cyan-400 group-hover:scale-110 transition-transform fill-cyan-400/40" />
              <span>Watch Demo</span>
            </button>
          </div>

          {/* 3 Circular Feature Badges Row */}
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

        {/* Right Visual Corridor: Gives room for the photorealistic ICU scene and telemetry overlays */}
        <div className="hidden lg:block lg:w-[48%] xl:w-[51%] 2xl:w-[54%] pointer-events-none" />
      </div>

      {/* ----------------------------------------------------------------- */}
      {/* 4. Bottom Control Ribbon: Scroll + 4-Step Stepper + Social Proof  */}
      {/* ----------------------------------------------------------------- */}
      <div className="w-full z-20 pt-2 pb-1 flex flex-col md:flex-row items-center justify-between gap-4 pl-[clamp(28px,4vw,80px)] pr-[clamp(20px,3vw,56px)]">
        {/* Left: Scroll to explore mouse indicator */}
        <div className="hidden sm:flex items-center gap-2.5 text-xs font-mono text-slate-400">
          <div className="w-4 h-7 rounded-full border-2 border-slate-500/60 flex items-start justify-center p-1">
            <div className="w-1 h-1.5 rounded-full bg-cyan-400 animate-bounce" />
          </div>
          <span>Scroll to explore &darr;</span>
        </div>

        {/* Center: 4-Step Decision Stepper Ribbon with Lenis Smooth Scrolling */}
        <div className="flex items-center gap-1.5 sm:gap-2 p-1 rounded-full bg-[#040816]/85 border border-white/[0.1] backdrop-blur-2xl shadow-xl">
          <button
            onClick={() => scrollToTarget('#platform')}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 text-xs font-sans font-bold shadow-[0_0_12px_rgba(34,211,238,0.25)] hover:bg-cyan-500/30 transition-colors cursor-pointer"
          >
            <span className="font-mono text-[10px]">01</span>
            <span>Observe</span>
          </button>

          <button
            onClick={() => scrollToTarget('#intelligence')}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full hover:bg-white/[0.06] text-slate-400 hover:text-white text-xs font-sans transition-colors cursor-pointer"
          >
            <span className="font-mono text-[10px]">02</span>
            <span>Predict</span>
          </button>

          <button
            onClick={() => scrollToTarget('#optimization')}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full hover:bg-white/[0.06] text-slate-400 hover:text-white text-xs font-sans transition-colors cursor-pointer"
          >
            <span className="font-mono text-[10px]">03</span>
            <span>Optimize</span>
          </button>

          <button
            onClick={() => scrollToTarget('#scenarios')}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full hover:bg-white/[0.06] text-slate-400 hover:text-white text-xs font-sans transition-colors cursor-pointer"
          >
            <span className="font-mono text-[10px]">04</span>
            <span>Decide</span>
          </button>
        </div>

        {/* Right: Social Proof Pill */}
        <div 
          onClick={() => navigate('/app/dashboard')}
          className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#040816]/85 border border-white/[0.1] backdrop-blur-2xl shadow-lg hover:border-cyan-400/40 transition-all cursor-pointer group"
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
