import React from 'react';

interface IntelliCareMarkProps {
  size?: number | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  glow?: boolean;
  animated?: boolean;
}

const sizeMap = {
  xs: 20,
  sm: 28,
  md: 36,
  lg: 48,
  xl: 64,
};

export const IntelliCareMark: React.FC<IntelliCareMarkProps> = ({
  size = 'md',
  className = '',
  glow = false,
  animated = false,
}) => {
  const pixelSize = typeof size === 'number' ? size : sizeMap[size] || 36;

  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 ${
        animated ? 'group-hover:scale-105 transition-transform duration-300' : ''
      } ${className}`}
      style={{ width: pixelSize, height: pixelSize }}
    >
      {/* Optional ambient luminous glow */}
      {glow && (
        <div
          className="absolute inset-0 rounded-full bg-cyan-400/25 blur-[10px] pointer-events-none -z-10 animate-pulse"
          style={{ transform: 'scale(1.2)' }}
        />
      )}

      <svg
        viewBox="0 0 160 160"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full select-none"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="ic-m-top" x1="68" y1="90" x2="88" y2="15" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#083E9E" />
            <stop offset="35%" stopColor="#0066FF" />
            <stop offset="70%" stopColor="#00B2FE" />
            <stop offset="100%" stopColor="#4DD8FF" />
          </linearGradient>

          <linearGradient id="ic-m-bottom" x1="92" y1="70" x2="72" y2="145" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#083E9E" />
            <stop offset="35%" stopColor="#005BEA" />
            <stop offset="75%" stopColor="#00C0FF" />
            <stop offset="100%" stopColor="#38BDF8" />
          </linearGradient>

          <linearGradient id="ic-m-left" x1="90" y1="80" x2="20" y2="92" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#052B75" />
            <stop offset="40%" stopColor="#0055EE" />
            <stop offset="85%" stopColor="#0099FF" />
            <stop offset="100%" stopColor="#38BDF8" />
          </linearGradient>

          <linearGradient id="ic-m-right" x1="70" y1="80" x2="140" y2="68" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#0A3C9E" />
            <stop offset="45%" stopColor="#0077FF" />
            <stop offset="85%" stopColor="#00C4FF" />
            <stop offset="100%" stopColor="#7DD3FC" />
          </linearGradient>

          <linearGradient id="ic-m-twist" x1="45" y1="95" x2="115" y2="65" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#0044CC" stopOpacity="0.95" />
            <stop offset="50%" stopColor="#00B2FE" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#7DD3FC" stopOpacity="0.5" />
          </linearGradient>
        </defs>

        <g>
          {/* Left Petal */}
          <path
            d="M74 88 C58 92, 38 102, 24 98 C18 96, 16 88, 22 82 C32 72, 54 68, 76 74 Z"
            fill="url(#ic-m-left)"
            opacity="0.96"
          />

          {/* Bottom Petal */}
          <path
            d="M72 82 C68 96, 62 120, 68 136 C72 144, 82 146, 88 138 C96 126, 94 100, 86 80 Z"
            fill="url(#ic-m-bottom)"
          />

          {/* Right Petal */}
          <path
            d="M84 72 C100 68, 122 58, 136 62 C142 64, 144 72, 138 78 C128 88, 106 92, 84 86 Z"
            fill="url(#ic-m-right)"
            opacity="0.96"
          />

          {/* Top Petal */}
          <path
            d="M88 78 C92 64, 98 40, 92 24 C88 16, 78 14, 72 22 C64 34, 66 60, 74 80 Z"
            fill="url(#ic-m-top)"
          />

          {/* Central Fluid Ribbon Cross Twist */}
          <path
            d="M58 84 C68 76, 82 66, 98 62 C104 60, 108 64, 102 70 C88 82, 74 94, 60 98 C54 100, 50 96, 54 88 Z"
            fill="url(#ic-m-twist)"
          />
        </g>
      </svg>
    </div>
  );
};
