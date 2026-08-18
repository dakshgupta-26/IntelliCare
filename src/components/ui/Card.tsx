import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: 'glass' | 'interactive' | 'glow' | 'solid';
  className?: string;
  glowColor?: string;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'glass',
  className,
  ...props
}) => {
  const variantStyles = {
    glass: 'glass-panel rounded-2xl p-6 shadow-xl',
    interactive: 'glass-panel-interactive rounded-2xl p-6 cursor-pointer',
    glow: 'glass-panel-glow rounded-2xl p-6 shadow-2xl',
    solid: 'bg-surface-100/90 border border-slate-800 rounded-2xl p-6 shadow-xl',
  };

  return (
    <div
      className={twMerge(
        clsx(
          'relative overflow-hidden transition-all duration-300',
          variantStyles[variant],
          className
        )
      )}
      {...props}
    >
      {children}
    </div>
  );
};
