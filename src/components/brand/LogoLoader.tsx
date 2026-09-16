import React from 'react';
import { IntelliCareLogo } from './IntelliCareLogo';
import { IntelliCareMark } from './IntelliCareMark';

interface LogoLoaderProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  fullScreen?: boolean;
}

export const LogoLoader: React.FC<LogoLoaderProps> = ({
  message = 'Synchronizing clinical telemetry...',
  size = 'md',
  fullScreen = false,
}) => {
  const markSizes = {
    sm: 36,
    md: 48,
    lg: 64,
  };

  const content = (
    <div className="flex flex-col items-center justify-center gap-5 select-none text-center">
      {/* Centered Luminous Mark with subtle breathing pulse */}
      <div className="relative">
        <IntelliCareMark size={markSizes[size]} glow className="animate-pulse" />
        <div className="absolute inset-0 rounded-full bg-cyan-400/20 blur-xl animate-ping opacity-30" />
      </div>

      {/* Brand Lockup */}
      <IntelliCareLogo variant="full" size="md" />

      {/* High-Tech Telemetry Scanline */}
      <div className="w-48 h-0.5 bg-[#0D1526] rounded-full overflow-hidden relative border border-white/5">
        <div className="absolute inset-y-0 w-16 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-[shimmer_1.8s_infinite]" />
      </div>

      {/* Status Message */}
      {message && (
        <span className="text-xs font-mono text-[#A7B4C8] tracking-wider">
          {message}
        </span>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-[100] bg-[#050814] flex items-center justify-center p-4">
        {content}
      </div>
    );
  }

  return <div className="p-8 flex items-center justify-center">{content}</div>;
};
