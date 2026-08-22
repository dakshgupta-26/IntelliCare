import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
  rightElement?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  icon,
  rightElement,
  className = '',
  id,
  ...props
}) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className="text-xs font-mono font-medium text-slate-300 flex items-center justify-between"
        >
          <span>{label}</span>
        </label>
      )}
      <div className="relative flex items-center">
        {icon && (
          <div className="absolute left-3.5 text-slate-400 pointer-events-none flex items-center justify-center">
            {icon}
          </div>
        )}
        <input
          id={inputId}
          className={`w-full bg-surface-200/80 dark:bg-[#07111f] border rounded-xl py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-cyan/50 focus:border-brand-cyan transition-all ${
            icon ? 'pl-10' : 'pl-3.5'
          } ${rightElement ? 'pr-10' : 'pr-3.5'} ${
            error
              ? 'border-rose-500/80 focus:ring-rose-500/50'
              : 'border-slate-700/80 dark:border-slate-800'
          } ${className}`}
          {...props}
        />
        {rightElement && (
          <div className="absolute right-3 text-slate-400 flex items-center justify-center">
            {rightElement}
          </div>
        )}
      </div>
      {error && <span className="text-xs text-rose-400 font-mono">{error}</span>}
      {helperText && !error && (
        <span className="text-xs text-slate-400 leading-tight">{helperText}</span>
      )}
    </div>
  );
};
