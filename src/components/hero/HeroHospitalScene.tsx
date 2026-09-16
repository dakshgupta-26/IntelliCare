import React, { useState, useRef } from 'react';
import { HeroLiveTelemetryOverlays } from './HeroLiveTelemetryOverlays';

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
    x: 46,
    y: 32,
    title: 'Mindray BeneVision N22 Monitor',
    tag: 'REAL-TIME TELEMETRY',
    description: 'Continuous 12-Lead ECG, SpO2, and invasive arterial BP feeding the IntelliCare Kafka telemetry bus at 250Hz.',
    metric: 'Latency: 12ms',
    status: 'optimal'
  },
  {
    id: 'infusion-tower',
    x: 28,
    y: 48,
    title: 'Alaris Smart Infusion System',
    tag: 'CLOSED-LOOP INFUSION',
    description: 'Automated weight-based drug titration with error reduction system and real-time consumption telemetry.',
    metric: '3 Active Channels',
    status: 'optimal'
  },
  {
    id: 'icu-bed',
    x: 62,
    y: 58,
    title: 'Hill-Rom Critical Care Platform',
    tag: 'PATIENT BED SENSORS',
    description: 'Continuous weight sensing, pulmonary therapy positioning, and bed-exit prediction sensors.',
    metric: 'Occupied • Bed 04',
    status: 'active'
  }
];

export const HeroHospitalScene: React.FC = () => {
  const [activeHotspot, setActiveHotspot] = useState<Hotspot | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Subtle 3D mouse parallax tilt
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Constrain to subtle tilt (-4deg to +4deg)
    const rotateY = ((x - centerX) / centerX) * 4;
    const rotateX = -((y - centerY) / centerY) * 4;

    setTilt({ rotateX, rotateY });
  };

  const handleMouseLeave = () => {
    setTilt({ rotateX: 0, rotateY: 0 });
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full h-full rounded-2xl overflow-hidden bg-[#040813] border border-white/[0.08] shadow-[0_20px_50px_rgba(0,0,0,0.8)] select-none group"
      style={{
        perspective: '1200px'
      }}
    >
      {/* 3D Parallax Canvas Wrapper */}
      <div
        className="relative w-full h-full transition-transform duration-200 ease-out"
        style={{
          transform: `rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg) scale3d(1.02, 1.02, 1.02)`,
          transformStyle: 'preserve-3d'
        }}
      >
        {/* Photorealistic Clinical ICU Environment Image */}
        <img
          src="/assets/images/icu_realistic_hero.jpg"
          alt="IntelliCare Real-Time Hospital ICU Digital Twin Telemetry"
          className="w-full h-full object-cover object-center filter brightness-[0.92] contrast-[1.05]"
        />

        {/* Cinematic Vignette & Ambient Clinical Light Layer */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#040813]/90 via-transparent to-[#040813]/40 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#040813]/70 via-transparent to-[#040813]/70 pointer-events-none" />

        {/* Emissive Monitor Glow Simulation in Scene */}
        <div 
          className="absolute top-[28%] left-[44%] w-32 h-24 bg-cyan-400/[0.12] rounded-full blur-2xl pointer-events-none animate-pulse"
          style={{ animationDuration: '4s' }}
        />

        {/* Subtly Animated Scan Grid overlay */}
        <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />

        {/* Interactive Equipment Hotspots */}
        {CLINICAL_HOTSPOTS.map((spot) => {
          const isSelected = activeHotspot?.id === spot.id;
          return (
            <div
              key={spot.id}
              style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
              className="absolute z-30 -translate-x-1/2 -translate-y-1/2 pointer-events-auto"
            >
              {/* Pulse hotspot button */}
              <button
                onClick={() => setActiveHotspot(isSelected ? null : spot)}
                onMouseEnter={() => setActiveHotspot(spot)}
                className="relative flex items-center justify-center w-6 h-6 rounded-full bg-cyan-500/30 border border-cyan-300 text-cyan-200 hover:scale-125 transition-transform duration-200 cursor-pointer shadow-[0_0_15px_rgba(25,199,243,0.8)] focus:outline-none"
                aria-label={spot.title}
              >
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-60" />
                <span className="w-2 h-2 rounded-full bg-white shadow-sm" />
              </button>

              {/* Hotspot Info Tooltip */}
              {isSelected && (
                <div 
                  className="absolute left-1/2 -translate-x-1/2 bottom-8 z-40 w-64 p-3 rounded-xl bg-[#060D1A]/95 backdrop-blur-2xl border border-cyan-400/40 shadow-[0_16px_36px_rgba(0,0,0,0.8)] text-left animate-in fade-in zoom-in-95 duration-150"
                  style={{
                    boxShadow: '0 12px 32px rgba(0,0,0,0.9), 0 0 20px rgba(25,199,243,0.3)'
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

        {/* Live Telemetry Overlays in Safe Zones (Corners) */}
        <HeroLiveTelemetryOverlays />

        {/* Bottom Status Ribbon within Scene */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-20 px-3 py-1 rounded-full bg-[#060D1A]/80 border border-white/[0.1] backdrop-blur-md flex items-center gap-2 text-[10px] font-mono text-slate-300 shadow-lg pointer-events-none">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>REAL-TIME CLINICAL DIGITAL TWIN</span>
          <span className="text-slate-600">•</span>
          <span className="text-cyan-400">250 Hz TELEMETRY STREAM</span>
        </div>
      </div>
    </div>
  );
};
