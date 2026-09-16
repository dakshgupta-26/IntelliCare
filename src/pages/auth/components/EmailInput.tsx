import React, { useState } from 'react';
import { Mail } from 'lucide-react';

interface EmailInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  required?: boolean;
  error?: string | null;
  autoFocus?: boolean;
}

export const EmailInput: React.FC<EmailInputProps> = ({
  value,
  onChange,
  disabled = false,
  required = true,
  error = null,
  autoFocus = false
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="space-y-1.5 text-left">
      <label 
        htmlFor="hospital-email-input" 
        className="block text-xs font-mono font-medium text-slate-300"
      >
        Hospital Email
      </label>

      <div 
        className={`relative flex items-center rounded-xl bg-[#030712]/90 border transition-all duration-200 ${
          error
            ? 'border-rose-500/60 ring-2 ring-rose-500/20'
            : isFocused
            ? 'border-cyan-400/80 ring-2 ring-cyan-500/20 shadow-[0_0_15px_rgba(34,211,238,0.15)]'
            : 'border-white/[0.1] hover:border-white/[0.18]'
        }`}
      >
        <div className="pl-3.5 pr-2 pointer-events-none text-slate-400 flex items-center justify-center">
          <Mail className={`w-4 h-4 transition-colors ${isFocused ? 'text-cyan-400' : 'text-slate-400'}`} />
        </div>

        <input
          id="hospital-email-input"
          type="email"
          name="email"
          autoComplete="email"
          required={required}
          disabled={disabled}
          autoFocus={autoFocus}
          placeholder="name@hospital.org"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="w-full py-2.5 pr-3.5 bg-transparent text-sm font-sans text-white placeholder-slate-500 focus:outline-none disabled:opacity-50 selection:bg-cyan-500/20"
        />
      </div>

      {error && (
        <p className="text-[11px] font-sans text-rose-400 pl-0.5 animate-in fade-in duration-150">
          {error}
        </p>
      )}
    </div>
  );
};
