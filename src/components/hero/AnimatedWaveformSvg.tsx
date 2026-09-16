import React from 'react';

interface AnimatedWaveformSvgProps {
  type: 'ecg' | 'spo2' | 'bp' | 'rr';
  color?: string;
  className?: string;
  width?: number;
  height?: number;
}

export const AnimatedWaveformSvg: React.FC<AnimatedWaveformSvgProps> = ({
  type,
  color,
  className = '',
  width = 110,
  height = 24
}) => {
  // Color presets matching medical monitors
  const waveColor = color || (
    type === 'ecg' ? '#34D399' : // Green
    type === 'spo2' ? '#22D3EE' : // Cyan
    type === 'bp' ? '#14B8A6' : // Teal
    '#38BDF8' // Sky Blue
  );

  // High-fidelity continuous SVG paths
  // Pattern designed to tile smoothly across 200px
  const getPathData = () => {
    switch (type) {
      case 'ecg':
        // P-Q-R-S-T cycle repeated
        return "M 0 12 L 15 12 Q 18 8 21 12 L 27 12 L 29 15 L 32 1 L 35 21 L 37 12 L 43 12 Q 47 6 52 12 L 68 12 L 83 12 Q 86 8 89 12 L 95 12 L 97 15 L 100 1 L 103 21 L 105 12 L 111 12 Q 115 6 120 12 L 136 12 L 151 12 Q 154 8 157 12 L 163 12 L 165 15 L 168 1 L 171 21 L 173 12 L 179 12 Q 183 6 188 12 L 204 12";
      case 'spo2':
        // Smooth photoplethysmogram (PPG) with dicrotic notch
        return "M 0 14 C 6 14, 10 3, 14 3 C 17 3, 20 8, 23 8 C 26 8, 30 14, 36 14 C 42 14, 46 3, 50 3 C 53 3, 56 8, 59 8 C 62 8, 66 14, 72 14 C 78 14, 82 3, 86 3 C 89 3, 92 8, 95 8 C 98 8, 102 14, 108 14 C 114 14, 118 3, 122 3 C 125 3, 128 8, 131 8 C 134 8, 138 14, 144 14 L 200 14";
      case 'bp':
        // Arterial pressure wave (sharp systolic rise, dicrotic notch, diastolic decay)
        return "M 0 16 L 8 16 L 14 4 C 16 4, 19 9, 21 9 C 24 9, 28 16, 34 16 L 42 16 L 48 4 C 50 4, 53 9, 55 9 C 58 9, 62 16, 68 16 L 76 16 L 82 4 C 84 4, 87 9, 89 9 C 92 9, 96 16, 102 16 L 110 16 L 116 4 C 118 4, 121 9, 123 9 C 126 9, 130 16, 136 16 L 200 16";
      case 'rr':
      default:
        // Slow respiratory sinusoidal wave
        return "M 0 12 C 12 4, 24 4, 36 12 C 48 20, 60 20, 72 12 C 84 4, 96 4, 108 12 C 120 20, 132 20, 144 12 C 156 4, 168 4, 180 12 L 200 12";
    }
  };

  const pathData = getPathData();
  const animDuration = type === 'ecg' ? '1.8s' : type === 'spo2' ? '2.4s' : type === 'bp' ? '2.1s' : '3.6s';

  return (
    <div 
      className={`relative overflow-hidden inline-flex items-center justify-center select-none ${className}`}
      style={{ width: `${width}px`, height: `${height}px` }}
    >
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        fill="none"
        className="overflow-hidden"
      >
        <defs>
          <filter id={`glow-${type}`} x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="0" stdDeviation="1.5" floodColor={waveColor} floodOpacity="0.8" />
          </filter>
        </defs>

        {/* Ambient static guide line */}
        <path
          d={pathData}
          stroke={waveColor}
          strokeWidth="1.2"
          strokeOpacity="0.25"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Dynamic Sweeping Luminous Waveform */}
        <path
          d={pathData}
          stroke={waveColor}
          strokeWidth="1.8"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter={`url(#glow-${type})`}
          strokeDasharray="50 150"
          className="animate-waveform-sweep"
          style={{
            animationDuration: animDuration,
            animationTimingFunction: 'linear',
            animationIterationCount: 'infinite'
          }}
        />
      </svg>
    </div>
  );
};
