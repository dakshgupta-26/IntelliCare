import React, { useState } from 'react';
import { Lock, Eye, EyeOff } from 'lucide-react';

interface PasswordInputProps {
  value: string;
  onChange: (value: string) => void;
  onForgotPassword?: () => void;
  disabled?: boolean;
  required?: boolean;
  error?: string | null;
  placeholder?: string;
  autoComplete?: string;
}

export const PasswordInput: React.FC<PasswordInputProps> = ({
  value,
  onChange,
  onForgotPassword,
  disabled = false,
  required = true,
  error = null,
  placeholder = '••••••••••••',
  autoComplete = 'current-password'
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="space-y-1.5 text-left">
      <div className="flex items-center justify-between">
        <label 
          htmlFor="access-password-input" 
          className="block text-xs font-mono font-medium text-slate-300"
        >
          Access Password
        </label>

        {onForgotPassword && (
          <button
            type="button"
            onClick={onForgotPassword}
            className="text-[11px] font-sans text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer focus:outline-none focus:underline"
          >
            Forgot password?
          </button>
        )}
      </div>

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
          <Lock className={`w-4 h-4 transition-colors ${isFocused ? 'text-cyan-400' : 'text-slate-400'}`} />
        </div>

        <input
          id="access-password-input"
          type={showPassword ? 'text' : 'password'}
          name="password"
          autoComplete={autoComplete}
          required={required}
          disabled={disabled}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="w-full py-2.5 pr-10 bg-transparent text-sm font-sans text-white placeholder-slate-500 focus:outline-none disabled:opacity-50 selection:bg-cyan-500/20"
        />

        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          tabIndex={-1}
          aria-label={showPassword ? 'Hide password' : 'Show password'}
          className="absolute right-3 p-1 rounded-md text-slate-400 hover:text-slate-200 transition-colors cursor-pointer focus:outline-none"
        >
          {showPassword ? (
            <EyeOff className="w-4 h-4 transition-transform active:scale-90" />
          ) : (
            <Eye className="w-4 h-4 transition-transform active:scale-90" />
          )}
        </button>
      </div>

      {error && (
        <p className="text-[11px] font-sans text-rose-400 pl-0.5 animate-in fade-in duration-150">
          {error}
        </p>
      )}
    </div>
  );
};
