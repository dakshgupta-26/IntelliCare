import React from 'react';
import { IntelliCareMark } from './IntelliCareMark';

interface BrandBadgeProps {
  label?: string;
  variant?: 'cyan' | 'dark' | 'emerald';
  size?: 'sm' | 'md';
  className?: string;
}

export const BrandBadge: React.FC<BrandBadgeProps> = ({
  label = 'AI OPS PLATFORM',
  variant = 'cyan',
  size = 'md',
  className = '',
}) => {
  const isSmall = size === 'sm';

  const variantStyles = {
    cyan: 'bg-[#0B1220] border-cyan-500/25 text-cyan-400 shadow-[0_0_15px_rgba(25,199,243,0.15)]',
    dark: 'bg-[#0A1020] border-white/10 text-slate-300',
    emerald: 'bg-emerald-950/30 border-emerald-500/30 text-emerald-400',
  };

  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full border font-mono font-bold tracking-wider uppercase select-none ${
        isSmall ? 'px-2.5 py-0.5 text-[10px]' : 'px-3 py-1 text-[11px]'
      } ${variantStyles[variant]} ${className}`}
    >
      <IntelliCareMark size={isSmall ? 14 : 16} />
      <span>{label}</span>
    </div>
  );
};
