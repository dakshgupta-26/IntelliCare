import React from 'react';
import { IntelliCareMark } from './IntelliCareMark';

export type LogoVariant = 'full' | 'mark' | 'compact' | 'with-tagline';
export type LogoSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface IntelliCareLogoProps {
  variant?: LogoVariant;
  size?: LogoSize;
  showBadge?: boolean;
  badgeText?: string;
  theme?: 'dark' | 'light';
  className?: string;
  animated?: boolean;
  onClick?: () => void;
}

const sizeConfig: Record<LogoSize, { markSize: number; fontSize: string; badgeSize: string; gap: string }> = {
  xs: { markSize: 22, fontSize: 'text-sm', badgeSize: 'text-[9px] px-1.5 py-0.2', gap: 'gap-2' },
  sm: { markSize: 28, fontSize: 'text-base', badgeSize: 'text-[10px] px-1.5 py-0.5', gap: 'gap-2.5' },
  md: { markSize: 34, fontSize: 'text-xl', badgeSize: 'text-[10px] px-2 py-0.5', gap: 'gap-3' },
  lg: { markSize: 42, fontSize: 'text-2xl', badgeSize: 'text-xs px-2.5 py-1', gap: 'gap-3.5' },
  xl: { markSize: 56, fontSize: 'text-3xl sm:text-4xl', badgeSize: 'text-xs px-3 py-1', gap: 'gap-4' },
};

export const IntelliCareLogo: React.FC<IntelliCareLogoProps> = ({
  variant = 'full',
  size = 'md',
  showBadge = false,
  badgeText = 'AI OPS',
  theme = 'dark',
  className = '',
  animated = false,
  onClick,
}) => {
  const config = sizeConfig[size] || sizeConfig.md;
  const isLight = theme === 'light';

  // Mark-only variant
  if (variant === 'mark') {
    return (
      <div
        className={`inline-flex items-center cursor-pointer select-none ${className}`}
        onClick={onClick}
        aria-label="IntelliCare Home"
        role="img"
      >
        <IntelliCareMark size={config.markSize} animated={animated} glow={!isLight} />
      </div>
    );
  }

  return (
    <div
      className={`group inline-flex items-center ${config.gap} cursor-pointer select-none transition-all duration-200 ${className}`}
      onClick={onClick}
      aria-label="IntelliCare Home"
      role="banner"
    >
      {/* 1. Master Brand Mark */}
      <IntelliCareMark
        size={config.markSize}
        animated={animated}
        glow={!isLight}
        className="transition-transform duration-300 group-hover:scale-105"
      />

      {/* 2. Wordmark Lockup: Intelli (White) + Care (Cyan/Azure) */}
      <div className="flex flex-col justify-center leading-none">
        <div className="flex items-baseline gap-1.5 sm:gap-2">
          <span className={`font-display font-extrabold tracking-tight ${config.fontSize}`}>
            <span className={isLight ? 'text-[#0A1020]' : 'text-white'}>Intelli</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00B2FE] to-[#19C7F3]">
              Care
            </span>
          </span>

          {/* Optional System Mode Badge (e.g. AI OPS, DECISION OS) */}
          {showBadge && (
            <span
              className={`font-mono font-bold uppercase rounded-full tracking-wider border shadow-sm ${config.badgeSize} ${
                isLight
                  ? 'bg-cyan-50 border-cyan-300 text-cyan-800'
                  : 'bg-cyan-500/10 border-cyan-500/25 text-cyan-400 shadow-[0_0_12px_rgba(25,199,243,0.2)]'
              }`}
            >
              {badgeText}
            </span>
          )}
        </div>

        {/* 3. Optional Official Tagline Lockup */}
        {variant === 'with-tagline' && (
          <span
            className={`font-mono font-semibold uppercase tracking-[0.2em] mt-1 ${
              size === 'xl' ? 'text-[9px]' : 'text-[8px]'
            } ${isLight ? 'text-slate-500' : 'text-[#8899A6]'}`}
          >
            INTELLIGENCE FOR A HEALTHIER TOMORROW
          </span>
        )}
      </div>
    </div>
  );
};
