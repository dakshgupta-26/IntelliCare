import React, { useState } from 'react';
import { ArrowRight, ShieldAlert, CheckCircle2, Loader2, User, Award, ShieldCheck } from 'lucide-react';
import { EmailInput } from './EmailInput';
import { PasswordInput } from './PasswordInput';
import { PasswordRequirements } from './PasswordRequirements';
import { useAuthStore } from '../../../store/useAuthStore';
import { useRouterStore } from '../../../store/useRouterStore';

interface RegisterPanelProps {
  onSuccess?: (email: string) => void;
  className?: string;
}

export const RegisterPanel: React.FC<RegisterPanelProps> = ({ onSuccess, className = '' }) => {
  const register = useAuthStore((state) => state.register);
  const navigate = useRouterStore((state) => state.navigate);

  // Form State
  const [fullName, setFullName] = useState('');
  const [clinicalTitle, setClinicalTitle] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Criteria validation
  const isLengthValid = password.length >= 8;
  const isUpperValid = /[A-Z]/.test(password);
  const isLowerValid = /[a-z]/.test(password);
  const isNumberValid = /[0-9]/.test(password);
  const isSpecialValid = /[^A-Za-z0-9]/.test(password);
  const allCriteriaMet = isLengthValid && isUpperValid && isLowerValid && isNumberValid && isSpecialValid;

  const passwordsMatch = password.length > 0 && password === confirmPassword;
  const isFormValid = fullName.trim().length > 0 && email.trim().length > 0 && allCriteriaMet && passwordsMatch;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading || isSuccess) return;

    setErrorMessage(null);

    if (!allCriteriaMet) {
      setErrorMessage('Please satisfy all password complexity requirements.');
      return;
    }

    if (!passwordsMatch) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    setIsLoading(true);

    try {
      const combinedName = clinicalTitle.trim() 
        ? `${fullName.trim()}, ${clinicalTitle.trim()}`
        : fullName.trim();

      await register(combinedName, email.trim(), password, confirmPassword);
      setIsSuccess(true);

      setTimeout(() => {
        if (onSuccess) onSuccess(email);
        navigate(`/verify-email?email=${encodeURIComponent(email.trim())}`);
      }, 700);
    } catch (err: any) {
      setErrorMessage(err.message || 'Registration failed. Please verify your credentials and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className={`w-full max-w-md mx-auto p-6 sm:p-8 rounded-3xl bg-[#050B14]/90 border border-white/[0.1] backdrop-blur-2xl shadow-[0_24px_64px_rgba(0,0,0,0.85)] text-left space-y-5 ${className}`}
      style={{
        boxShadow: '0 24px 64px -12px rgba(0, 0, 0, 0.9), 0 0 20px -4px rgba(25, 199, 243, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.08)'
      }}
    >
      {/* Panel Header */}
      <div className="space-y-1">
        <h2 className="text-xl sm:text-2xl font-display font-extrabold text-white tracking-tight">
          Create Provider Account
        </h2>
        <p className="text-xs text-slate-400 font-sans leading-relaxed">
          Register your authorized clinical identity to access IntelliCare decision support.
        </p>
      </div>

      {/* Accessible Error Banner */}
      {errorMessage && (
        <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2 animate-in fade-in duration-150 font-sans">
          <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
          <span className="leading-snug">{errorMessage}</span>
        </div>
      )}

      {/* Success Notification */}
      {isSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in duration-150 font-sans">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Clinical identity recorded. Dispatching verification token...</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* ============================================================= */}
        {/* SECTION 01: Professional Identity                             */}
        {/* ============================================================= */}
        <div className="space-y-2.5 pb-2">
          <div className="flex items-center gap-1.5 text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider">
            <span>01</span>
            <span className="text-slate-600">•</span>
            <span className="text-slate-300">Professional Identity</span>
          </div>

          <div className="space-y-2">
            {/* Full Name */}
            <div className="space-y-1">
              <label 
                htmlFor="full-name-input"
                className="block text-xs font-mono font-medium text-slate-300"
              >
                Full Name
              </label>
              <div className="relative flex items-center rounded-xl bg-[#030712]/90 border border-white/[0.1] focus-within:border-cyan-400/80 focus-within:ring-2 focus-within:ring-cyan-500/20 transition-all">
                <div className="pl-3.5 pr-2 pointer-events-none text-slate-400 flex items-center justify-center">
                  <User className="w-4 h-4" />
                </div>
                <input
                  id="full-name-input"
                  type="text"
                  required
                  disabled={isLoading || isSuccess}
                  placeholder="Dr. Eleanor Vance"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full py-2.5 pr-3.5 bg-transparent text-sm font-sans text-white placeholder-slate-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Clinical / Professional Title */}
            <div className="space-y-1">
              <label 
                htmlFor="clinical-title-input"
                className="block text-xs font-mono font-medium text-slate-300"
              >
                Clinical / Professional Title
              </label>
              <div className="relative flex items-center rounded-xl bg-[#030712]/90 border border-white/[0.1] focus-within:border-cyan-400/80 focus-within:ring-2 focus-within:ring-cyan-500/20 transition-all">
                <div className="pl-3.5 pr-2 pointer-events-none text-slate-400 flex items-center justify-center">
                  <Award className="w-4 h-4" />
                </div>
                <input
                  id="clinical-title-input"
                  type="text"
                  disabled={isLoading || isSuccess}
                  placeholder="MD, Chief Medical Officer (optional)"
                  value={clinicalTitle}
                  onChange={(e) => setClinicalTitle(e.target.value)}
                  className="w-full py-2.5 pr-3.5 bg-transparent text-sm font-sans text-white placeholder-slate-500 focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* ============================================================= */}
        {/* SECTION 02: Healthcare Organization                           */}
        {/* ============================================================= */}
        <div className="space-y-2.5 pb-2 pt-2 border-t border-white/[0.06]">
          <div className="flex items-center gap-1.5 text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider">
            <span>02</span>
            <span className="text-slate-600">•</span>
            <span className="text-slate-300">Healthcare Organization</span>
          </div>

          <EmailInput
            value={email}
            onChange={setEmail}
            disabled={isLoading || isSuccess}
            required
          />
        </div>

        {/* ============================================================= */}
        {/* SECTION 03: Account Security                                  */}
        {/* ============================================================= */}
        <div className="space-y-2.5 pb-2 pt-2 border-t border-white/[0.06]">
          <div className="flex items-center gap-1.5 text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider">
            <span>03</span>
            <span className="text-slate-600">•</span>
            <span className="text-slate-300">Account Security</span>
          </div>

          <div className="space-y-2.5">
            <PasswordInput
              value={password}
              onChange={setPassword}
              disabled={isLoading || isSuccess}
              required
              placeholder="Create strong password"
              autoComplete="new-password"
            />

            {/* Live Interactive Requirements & Strength */}
            <PasswordRequirements password={password} />

            <PasswordInput
              value={confirmPassword}
              onChange={setConfirmPassword}
              disabled={isLoading || isSuccess}
              required
              placeholder="Confirm access password"
              autoComplete="new-password"
            />

            {/* Password Mismatch Warning */}
            {confirmPassword.length > 0 && !passwordsMatch && (
              <p className="text-[11px] font-mono text-rose-400 pl-0.5 animate-in fade-in duration-150">
                Passwords do not match.
              </p>
            )}
          </div>
        </div>

        {/* Primary Action Button */}
        <button
          type="submit"
          disabled={isLoading || isSuccess || !isFormValid}
          className="group relative w-full mt-2 inline-flex items-center justify-center gap-2.5 px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-400 via-cyan-500 to-blue-600 hover:from-cyan-300 hover:to-blue-500 text-slate-950 font-sans font-bold text-sm shadow-[0_0_24px_rgba(34,211,238,0.35)] hover:shadow-[0_0_32px_rgba(34,211,238,0.5)] transition-all duration-200 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
              <span>Creating Secure Account...</span>
            </>
          ) : isSuccess ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-slate-950" />
              <span>Account Provisioned</span>
            </>
          ) : (
            <>
              <span>Continue to Email Verification</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>
      </form>

      {/* Security Context Micro-UI */}
      <div className="pt-3 border-t border-white/[0.08] text-left">
        <div className="flex items-start gap-2 text-[10px] font-mono text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
          <span>
            Identity verification required before workspace provisioning. A single-use 6-digit cryptographic code will be dispatched to your hospital address.
          </span>
        </div>
      </div>

      {/* Sign In Link */}
      <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between text-xs font-sans text-slate-400">
        <span>Already registered?</span>
        <button
          type="button"
          onClick={() => navigate('/login')}
          className="text-cyan-400 hover:text-cyan-300 font-bold transition-colors cursor-pointer"
        >
          Sign In to Workspace →
        </button>
      </div>
    </div>
  );
};
