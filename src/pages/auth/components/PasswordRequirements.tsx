import React from 'react';
import { Check, X } from 'lucide-react';

export interface PasswordCriterion {
  id: string;
  label: string;
  met: boolean;
}

interface PasswordRequirementsProps {
  password: string;
  className?: string;
}

export const PasswordRequirements: React.FC<PasswordRequirementsProps> = ({
  password,
  className = ''
}) => {
  const criteria: PasswordCriterion[] = [
    { id: 'length', label: 'At least 8 characters', met: password.length >= 8 },
    { id: 'upper', label: 'One uppercase letter (A-Z)', met: /[A-Z]/.test(password) },
    { id: 'lower', label: 'One lowercase letter (a-z)', met: /[a-z]/.test(password) },
    { id: 'number', label: 'One number (0-9)', met: /[0-9]/.test(password) },
    { id: 'special', label: 'One special symbol (!@#$%^&*)', met: /[^A-Za-z0-9]/.test(password) }
  ];

  const metCount = criteria.filter((c) => c.met).length;

  // Strength score
  const strength = 
    password.length === 0 ? 'empty' :
    metCount <= 2 ? 'weak' :
    metCount <= 4 ? 'fair' : 
    'strong';

  const strengthColor =
    strength === 'weak' ? 'bg-rose-500' :
    strength === 'fair' ? 'bg-amber-400' :
    strength === 'strong' ? 'bg-emerald-400' :
    'bg-slate-700';

  const strengthLabel =
    strength === 'weak' ? 'Weak' :
    strength === 'fair' ? 'Fair' :
    strength === 'strong' ? 'Strong' :
    '';

  return (
    <div className={`space-y-2 p-3 rounded-xl bg-[#030712]/90 border border-white/[0.08] text-left select-none ${className}`}>
      {/* Strength Bar */}
      {password.length > 0 && (
        <div className="space-y-1 pb-1 border-b border-white/[0.06]">
          <div className="flex items-center justify-between text-[10px] font-mono">
            <span className="text-slate-400">Password Strength:</span>
            <span className={`font-bold ${
              strength === 'weak' ? 'text-rose-400' :
              strength === 'fair' ? 'text-amber-400' :
              'text-emerald-400'
            }`}>
              {strengthLabel}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-1.5 h-1">
            <div className={`h-full rounded-full transition-colors duration-300 ${metCount >= 1 ? strengthColor : 'bg-slate-800'}`} />
            <div className={`h-full rounded-full transition-colors duration-300 ${metCount >= 3 ? strengthColor : 'bg-slate-800'}`} />
            <div className={`h-full rounded-full transition-colors duration-300 ${metCount === 5 ? strengthColor : 'bg-slate-800'}`} />
          </div>
        </div>
      )}

      {/* Checklist */}
      <div className="space-y-1">
        <span className="text-[10px] font-mono text-slate-400 block font-semibold uppercase tracking-wider">
          Requirements:
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-2 gap-y-1 text-[11px] font-mono">
          {criteria.map((c) => (
            <div key={c.id} className="flex items-center gap-1.5 truncate">
              {c.met ? (
                <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              ) : (
                <X className="w-3.5 h-3.5 text-slate-600 shrink-0" />
              )}
              <span className={`truncate transition-colors ${
                c.met ? 'text-slate-200 font-medium' : 'text-slate-500'
              }`}>
                {c.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
