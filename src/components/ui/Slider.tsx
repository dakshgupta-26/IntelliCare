import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  formatValue?: (val: number) => string;
  onChange: (val: number) => void;
  helperText?: string;
  unit?: string;
  className?: string;
}

export const Slider: React.FC<SliderProps> = ({
  label,
  value,
  min,
  max,
  step = 1,
  formatValue,
  onChange,
  helperText,
  unit = '',
  className,
}) => {
  const percentage = ((value - min) / (max - min)) * 100;
  const displayValue = formatValue ? formatValue(value) : `${value}${unit}`;

  return (
    <div className={twMerge(clsx('flex flex-col gap-2', className))}>
      <div className="flex items-center justify-between">
        <label className="text-xs font-mono uppercase tracking-wider text-slate-300">
          {label}
        </label>
        <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-surface-200 border border-cyan-500/30 text-cyan-400">
          {displayValue}
        </span>
      </div>

      <div className="relative flex items-center py-1">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="w-full h-1.5 bg-surface-300 rounded-lg appearance-none cursor-pointer accent-brand-cyan focus:outline-none focus:ring-1 focus:ring-brand-cyan/50"
          style={{
            background: `linear-gradient(to right, #06b6d4 0%, #0ea5e9 ${percentage}%, #1e293b ${percentage}%, #1e293b 100%)`,
          }}
        />
      </div>

      {helperText && (
        <span className="text-[11px] text-slate-400 font-sans leading-tight">
          {helperText}
        </span>
      )}
    </div>
  );
};
