import React, { useState } from 'react';
import { HeroLiveTelemetryOverlays } from './HeroLiveTelemetryOverlays';
import { HeroOperationalNetwork } from './HeroOperationalNetwork';

interface Hotspot {
  id: string;
  x: number; // percentage
  y: number; // percentage
  title: string;
  tag: string;
  description: string;
  metric: string;
  status: 'active' | 'optimal' | 'warning';
}

const CLINICAL_HOTSPOTS: Hotspot[] = [
  {
    id: 'bedside-telemetry',
    x: 77,
    y: 47,
    title: 'Mindray BeneVision N22 Monitor',
    tag: 'REAL-TIME TELEMETRY',
    description: 'Continuous 12-Lead ECG, SpO2, and invasive arterial BP feeding the IntelliCare telemetry bus at 250Hz.',
    metric: 'Latency: 12ms',
    status: 'optimal'
  },
  {
    id: 'infusion-tower',
    x: 62,
    y: 43,
    title: 'Alaris Smart Infusion System',
    tag: 'CLOSED-LOOP INFUSION',
    description: 'Automated weight-based drug titration with error reduction system and real-time consumption telemetry.',
    metric: '3 Active Channels',
    status: 'optimal'
  },
  {
    id: 'icu-bed',
    x: 65,
    y: 72,
    title: 'Hill-Rom Critical Care Platform',
    tag: 'PATIENT BED SENSORS',
    description: 'Continuous weight sensing, pulmonary therapy positioning, and bed-exit prediction sensors.',
    metric: 'Bed 04 • Stable',
    status: 'active'
  }
];

interface HeroHospitalSceneProps {
  tilt?: { rotateX: number; rotateY: number };
}

export const HeroHospitalScene: React.FC<HeroHospitalSceneProps> = ({ tilt = { rotateX: 0, rotateY: 0 } }) => {
  const [activeHotspot, setActiveHotspot] = useState<Hotspot | null>(null);

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden select-none pointer-events-none">
      {/* 3D Parallax Canvas Wrapper */}
      <div
        className="hero-hospital-layer relative w-full h-full transition-transform duration-300 ease-out"
        style={{
          transform: `perspective(1400px) rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg) scale3d(1.02, 1.02, 1.02)`,
          transformStyle: 'preserve-3d'
        }}
      >
        {/* Subtle Three.js Operational Network (Depth Layer) */}
        <HeroOperationalNetwork />

        {/* Photorealistic Clinical ICU Environment Image */}
        <img
          src="/assets/images/cinematic_icu_hero.jpg"
          alt="IntelliCare Real-Time Hospital ICU Digital Twin Telemetry"
          className="w-full h-full object-cover object-[58%_center] sm:object-[62%_center] md:object-[65%_center] lg:object-[68%_center] xl:object-[70%_center] 2xl:object-[72%_center] filter brightness-[0.94] contrast-[1.03]"
        />

        {/* Ambient Filmic Vignette Gradients for Legibility without opaque dead space */}
        {/* Left-to-right cinematic blend: Dark navy on far left smoothly fading into transparent by center */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(to right, #030612 0%, rgba(3,6,18,0.92) 20%, rgba(3,6,18,0.72) 35%, rgba(3,6,18,0.4) 48%, rgba(3,6,18,0.1) 62%, transparent 78%)'
          }}
        />

        {/* Right-edge subtle breathing room vignette */}
        <div 
          className="absolute inset-y-0 right-0 w-24 sm:w-32 lg:w-40 pointer-events-none"
          style={{
            background: 'linear-gradient(to left, #030612 0%, rgba(3,6,18,0.6) 30%, transparent 100%)'
          }}
        />

        {/* Bottom deep dark vignette seamlessly connecting hero into the platform section */}
        <div 
          className="absolute inset-x-0 bottom-0 h-44 sm:h-52 pointer-events-none"
          style={{
            background: 'linear-gradient(to top, #030612 0%, rgba(3,6,18,0.95) 28%, rgba(3,6,18,0.5) 60%, transparent 100%)'
          }}
        />

        {/* Top subtle vignette blending into floating navbar */}
        <div 
          className="absolute inset-x-0 top-0 h-32 pointer-events-none"
          style={{
            background: 'linear-gradient(to bottom, #030612 0%, rgba(3,6,18,0.7) 40%, transparent 100%)'
          }}
        />

        {/* Emissive Monitor Glow Simulation over bedside hardware */}
        <div 
          className="absolute top-[38%] right-[22%] w-52 h-40 bg-cyan-400/[0.12] rounded-full blur-3xl pointer-events-none animate-pulse"
          style={{ animationDuration: '3.5s' }}
        />

        {/* CRT Scanline / Waveform overlay on physical monitor screen in image */}
        <div className="absolute right-[20%] top-[42%] w-24 h-16 pointer-events-none overflow-hidden rounded opacity-60 mix-blend-screen hidden lg:block">
          <div className="w-full h-full bg-cyan-950/40 border border-cyan-400/40 relative">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-400/10 to-transparent animate-pulse" />
            <svg className="w-full h-full opacity-80" viewBox="0 0 100 40" fill="none">
              <path
                d="M 0 20 L 20 20 L 25 5 L 30 35 L 35 20 L 60 20 L 65 5 L 70 35 L 75 20 L 100 20"
                stroke="#34D399"
                strokeWidth="1.5"
                fill="none"
              />
            </svg>
          </div>
        </div>

        {/* Interactive Equipment Hotspots (Mindray, Alaris, Hill-Rom) */}
        {CLINICAL_HOTSPOTS.map((spot) => {
          const isSelected = activeHotspot?.id === spot.id;
          return (
            <div
              key={spot.id}
              style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
              className="absolute z-30 -translate-x-1/2 -translate-y-1/2 pointer-events-auto hidden md:block"
            >
              {/* Pulse hotspot button */}
              <button
                onClick={() => setActiveHotspot(isSelected ? null : spot)}
                onMouseEnter={() => setActiveHotspot(spot)}
                className="relative flex items-center justify-center w-6 h-6 rounded-full bg-cyan-500/30 border border-cyan-300 text-cyan-200 hover:scale-125 transition-transform duration-200 cursor-pointer shadow-[0_0_15px_rgba(34,211,238,0.8)] focus:outline-none focus:ring-2 focus:ring-cyan-400"
                aria-label={spot.title}
              >
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-60" />
                <span className="w-2 h-2 rounded-full bg-white shadow-sm" />
              </button>

              {/* Hotspot Info Tooltip */}
              {isSelected && (
                <div 
                  className="absolute right-0 bottom-8 z-40 w-64 p-3 rounded-xl bg-[#060D1A]/95 backdrop-blur-2xl border border-cyan-400/40 shadow-[0_16px_36px_rgba(0,0,0,0.8)] text-left animate-in fade-in zoom-in-95 duration-150"
                  style={{
                    boxShadow: '0 12px 32px rgba(0,0,0,0.9), 0 0 20px rgba(34,211,238,0.3)'
                  }}
                >
                  <div className="flex items-center justify-between pb-1.5 border-b border-white/[0.08]">
                    <span className="text-[9px] font-mono uppercase font-bold text-cyan-400 tracking-wider">
                      {spot.tag}
                    </span>
                    <span className="text-[9px] font-mono text-emerald-400 font-semibold">
                      {spot.metric}
                    </span>
                  </div>

                  <h4 className="text-xs font-display font-bold text-white mt-1.5 leading-snug">
                    {spot.title}
                  </h4>
                  <p className="text-[10px] text-slate-300 font-sans leading-relaxed mt-1">
                    {spot.description}
                  </p>
                </div>
              )}
            </div>
          );
        })}

        {/* Live Telemetry Overlays in Safe Zones */}
        <HeroLiveTelemetryOverlays />
      </div>
    </div>
  );
};
