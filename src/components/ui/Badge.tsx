import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'cyan' | 'teal' | 'indigo' | 'emerald' | 'amber' | 'rose' | 'slate' | 'violet';
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  dot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'cyan',
  className,
  size = 'md',
  dot = false,
}) => {
  const variantStyles = {
    cyan: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20 shadow-[0_0_12px_rgba(6,182,212,0.15)]',
    teal: 'bg-teal-500/10 text-teal-400 border-teal-500/20 shadow-[0_0_12px_rgba(20,184,166,0.15)]',
    indigo: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/20 shadow-[0_0_12px_rgba(99,102,241,0.15)]',
    violet: 'bg-violet-500/10 text-violet-300 border-violet-500/20 shadow-[0_0_12px_rgba(139,92,246,0.15)]',
    emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_12px_rgba(16,185,129,0.15)]',
    amber: 'bg-amber-500/10 text-amber-300 border-amber-500/20 shadow-[0_0_12px_rgba(245,158,11,0.15)]',
    rose: 'bg-rose-500/10 text-rose-300 border-rose-500/20 shadow-[0_0_12px_rgba(244,63,94,0.15)]',
    slate: 'bg-slate-800/60 text-slate-300 border-slate-700/50',
  };

  const sizeStyles = {
    sm: 'text-[10px] px-2 py-0.5 font-mono uppercase tracking-wider',
    md: 'text-xs px-2.5 py-1 font-mono tracking-wide',
    lg: 'text-sm px-3.5 py-1.5 font-medium',
  };

  const dotStyles = {
    cyan: 'bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.8)]',
    teal: 'bg-teal-400 shadow-[0_0_8px_rgba(20,184,166,0.8)]',
    indigo: 'bg-indigo-400 shadow-[0_0_8px_rgba(99,102,241,0.8)]',
    violet: 'bg-violet-400 shadow-[0_0_8px_rgba(139,92,246,0.8)]',
    emerald: 'bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.8)]',
    amber: 'bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.8)]',
    rose: 'bg-rose-400 shadow-[0_0_8px_rgba(244,63,94,0.8)]',
    slate: 'bg-slate-400',
  };

  return (
    <span
      className={twMerge(
        clsx(
          'inline-flex items-center gap-1.5 rounded-full border backdrop-blur-md transition-all duration-200 select-none',
          variantStyles[variant],
          sizeStyles[size],
          className
        )
      )}
    >
      {dot && (
        <span className={clsx('w-1.5 h-1.5 rounded-full animate-pulse', dotStyles[variant])} />
      )}
      {children}
    </span>
  );
};
