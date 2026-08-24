import React from 'react';

export type OrbState = 'idle' | 'hover' | 'thinking' | 'streaming' | 'listening';

interface CopilotOrbProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  state?: OrbState;
  className?: string;
  onClick?: () => void;
}

export const CopilotOrb: React.FC<CopilotOrbProps> = ({
  size = 'md',
  state = 'idle',
  className = '',
  onClick
}) => {
  const sizeMap = {
    sm: 'w-7 h-7',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
    xl: 'w-24 h-24'
  };

  const dimension = {
    sm: 28,
    md: 40,
    lg: 56,
    xl: 96
  }[size];

  return (
    <div
      onClick={onClick}
      className={`relative flex items-center justify-center rounded-full select-none cursor-pointer transition-transform duration-300 ${sizeMap[size]} ${className}`}
      style={{ filter: 'drop-shadow(0 0 16px rgba(22, 199, 243, 0.45))' }}
      aria-label="IntelliCare AI Neural Core"
    >
      {/* Outer breathing glow atmosphere */}
      <div 
        className={`absolute inset-0 rounded-full bg-gradient-to-tr from-cyan-500/30 via-indigo-500/20 to-teal-400/30 blur-md transition-all duration-700 ${
          state === 'hover' ? 'scale-125 opacity-100' :
          state === 'thinking' ? 'animate-spin opacity-90' :
          state === 'streaming' ? 'scale-110 opacity-100 animate-pulse' :
          'opacity-70 animate-pulse-slow'
        }`} 
      />

      {/* SVG Neural Constellation & Core */}
      <svg
        width={dimension}
        height={dimension}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="relative z-10 w-full h-full"
      >
        <defs>
          {/* Radial Gradient for 3D Core Sphere */}
          <radialGradient id="orbGradCore" cx="35%" cy="30%" r="65%">
            <stop offset="0%" stopColor="#E0F7FE" />
            <stop offset="25%" stopColor="#16C7F3" />
            <stop offset="65%" stopColor="#0F172E" />
            <stop offset="100%" stopColor="#050816" />
          </radialGradient>

          {/* Accent Rim Gradient */}
          <linearGradient id="orbRimGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2DD4BF" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#16C7F3" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#9B8CFF" stopOpacity="0.9" />
          </linearGradient>

          {/* Neural Glow Filter */}
          <filter id="orbGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* 1. Base Spherical Shell */}
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="url(#orbGradCore)"
          stroke="url(#orbRimGrad)"
          strokeWidth="1.5"
          className="transition-all duration-500"
        />

        {/* 2. Concentric Sonar Pulse Rings (Listening State) */}
        {state === 'listening' && (
          <>
            <circle cx="50" cy="50" r="30" stroke="#16C7F3" strokeWidth="1.5" opacity="0.8" className="animate-ping" />
            <circle cx="50" cy="50" r="40" stroke="#2DD4BF" strokeWidth="1" opacity="0.5" className="animate-pulse" />
          </>
        )}

        {/* 3. Rotating Neural Rings (Thinking State) */}
        {state === 'thinking' ? (
          <g className="animate-spin origin-center" style={{ animationDuration: '3s' }}>
            <ellipse cx="50" cy="50" rx="42" ry="16" stroke="#16C7F3" strokeWidth="1.5" strokeDasharray="6 8" fill="none" transform="rotate(30 50 50)" />
            <ellipse cx="50" cy="50" rx="42" ry="16" stroke="#9B8CFF" strokeWidth="1.5" strokeDasharray="4 6" fill="none" transform="rotate(-45 50 50)" />
          </g>
        ) : (
          <g className="opacity-40">
            <ellipse cx="50" cy="50" rx="40" ry="18" stroke="#16C7F3" strokeWidth="1" strokeDasharray="2 4" fill="none" transform="rotate(25 50 50)" />
          </g>
        )}

        {/* 4. Audio-Equalizer Frequency Waveform (Streaming State) */}
        {state === 'streaming' ? (
          <g className="translate-y-0">
            <line x1="28" y1="40" x2="28" y2="60" stroke="#2DD4BF" strokeWidth="2.5" strokeLinecap="round" className="animate-pulse" />
            <line x1="36" y1="32" x2="36" y2="68" stroke="#16C7F3" strokeWidth="2.5" strokeLinecap="round" className="animate-pulse" style={{ animationDelay: '100ms' }} />
            <line x1="44" y1="26" x2="44" y2="74" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" className="animate-pulse" style={{ animationDelay: '200ms' }} />
            <line x1="52" y1="28" x2="52" y2="72" stroke="#16C7F3" strokeWidth="3" strokeLinecap="round" className="animate-pulse" style={{ animationDelay: '150ms' }} />
            <line x1="60" y1="34" x2="60" y2="66" stroke="#2DD4BF" strokeWidth="2.5" strokeLinecap="round" className="animate-pulse" style={{ animationDelay: '250ms' }} />
            <line x1="68" y1="42" x2="68" y2="58" stroke="#9B8CFF" strokeWidth="2" strokeLinecap="round" className="animate-pulse" style={{ animationDelay: '300ms' }} />
          </g>
        ) : (
          /* 5. ECG Heartbeat Vital Line traversing the core (Idle / Hover State) */
          <path
            d="M 12 50 L 32 50 L 37 42 L 42 62 L 48 28 L 54 68 L 59 46 L 64 52 L 68 50 L 88 50"
            stroke="#16C7F3"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            filter="url(#orbGlow)"
            className="transition-all duration-300"
            style={{
              strokeDasharray: '120',
              strokeDashoffset: state === 'hover' ? '0' : '24',
              animation: 'dash 3s ease-in-out infinite alternate'
            }}
          />
        )}

        {/* 6. Constellation Neural Synapse Nodes */}
        <circle cx="35" cy="30" r="2.5" fill="#ffffff" opacity="0.9" />
        <circle cx="65" cy="35" r="2" fill="#2DD4BF" opacity="0.8" />
        <circle cx="50" cy="72" r="2.2" fill="#9B8CFF" opacity="0.85" />
        <circle cx="70" cy="65" r="1.8" fill="#16C7F3" opacity="0.75" />

        {/* 7. Ambient Specular Highlight */}
        <ellipse cx="40" cy="28" rx="14" ry="7" fill="#ffffff" opacity="0.25" transform="rotate(-20 40 28)" />
      </svg>
    </div>
  );
};
