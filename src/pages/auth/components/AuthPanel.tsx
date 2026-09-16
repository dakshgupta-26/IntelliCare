import React, { useState } from 'react';
import { ArrowRight, ShieldAlert, CheckCircle2, Loader2 } from 'lucide-react';
import { EmailInput } from './EmailInput';
import { PasswordInput } from './PasswordInput';
import { PersonaSelector } from './PersonaSelector';
import { SecurityIndicator } from './SecurityIndicator';
import { useAuthStore } from '../../../store/useAuthStore';
import { useRouterStore } from '../../../store/useRouterStore';

interface AuthPanelProps {
  onSuccess?: () => void;
  className?: string;
}

export const AuthPanel: React.FC<AuthPanelProps> = ({ onSuccess, className = '' }) => {
  const login = useAuthStore((state) => state.login);
  const navigate = useRouterStore((state) => state.navigate);

  const [email, setEmail] = useState('sarah.chen@intellicare.health');
  const [password, setPassword] = useState('IntelliCare@2026!');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [unverifiedEmail, setUnverifiedEmail] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading || isSuccess) return;

    setErrorMessage(null);
    setUnverifiedEmail(null);
    setIsLoading(true);

    try {
      await login(email, password);
      setIsSuccess(true);
      setTimeout(() => {
        if (onSuccess) onSuccess();
        navigate('/app/dashboard');
      }, 700);
    } catch (err: any) {
      if (err.code === 'EMAIL_VERIFICATION_REQUIRED') {
        setUnverifiedEmail(err.email || email);
        setErrorMessage('Your clinical account email has not been verified yet.');
      } else {
        setErrorMessage(err.message || 'Invalid clinical email or access password.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectPersona = async (personaEmail: string) => {
    setEmail(personaEmail);
    setPassword('IntelliCare@2026!');
    setErrorMessage(null);
    setUnverifiedEmail(null);
    setIsLoading(true);

    try {
      await login(personaEmail, 'IntelliCare@2026!');
      setIsSuccess(true);
      setTimeout(() => {
        if (onSuccess) onSuccess();
        navigate('/app/dashboard');
      }, 600);
    } catch (err: any) {
      setErrorMessage(err.message || 'Persona authentication failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    // Backend OIDC flow
    window.location.href = '/auth/oauth/google';
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
          Sign in to Decision Support OS
        </h2>
        <p className="text-xs text-slate-400 font-sans leading-relaxed">
          Secure access to hospital operations, predictive surges, and resource governance.
        </p>
      </div>

      {/* Accessible Error / Unverified Banner */}
      {errorMessage && (
        <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex flex-col gap-2 animate-in fade-in duration-150 font-sans">
          <div className="flex items-start gap-2">
            <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <span className="leading-snug">{errorMessage}</span>
          </div>
          {unverifiedEmail && (
            <button
              type="button"
              onClick={() => navigate(`/verify-email?email=${encodeURIComponent(unverifiedEmail)}`)}
              className="self-start text-cyan-400 hover:text-cyan-300 font-bold underline text-xs cursor-pointer ml-6"
            >
              Enter Verification Code →
            </button>
          )}
        </div>
      )}

      {/* Success Notification */}
      {isSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in duration-150 font-sans">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Identity verified. Launching operational workspace...</span>
        </div>
      )}

      {/* Primary Credentials Form */}
      <form onSubmit={handleLogin} className="space-y-4">
        <EmailInput
          value={email}
          onChange={setEmail}
          disabled={isLoading || isSuccess}
          required
        />

        <PasswordInput
          value={password}
          onChange={setPassword}
          onForgotPassword={() => navigate('/forgot-password')}
          disabled={isLoading || isSuccess}
          required
        />

        {/* Primary CTA Button */}
        <button
          type="submit"
          disabled={isLoading || isSuccess}
          className="group relative w-full mt-2 inline-flex items-center justify-center gap-2.5 px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-400 via-cyan-500 to-blue-600 hover:from-cyan-300 hover:to-blue-500 text-slate-950 font-sans font-bold text-sm shadow-[0_0_24px_rgba(34,211,238,0.35)] hover:shadow-[0_0_32px_rgba(34,211,238,0.5)] transition-all duration-200 active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
              <span>Authenticating Credentials...</span>
            </>
          ) : isSuccess ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-slate-950" />
              <span>Identity Confirmed</span>
            </>
          ) : (
            <>
              <span>Sign In to Workspace</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>
      </form>

      {/* Divider */}
      <div className="relative my-4 text-center">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-white/[0.08]" />
        </div>
        <span className="relative px-3 bg-[#050B14] text-[10px] font-mono text-slate-500 uppercase tracking-wider">
          Or authenticate with enterprise SSO
        </span>
      </div>

      {/* Google Workspace OIDC Secondary Button */}
      <button
        type="button"
        onClick={handleGoogleSignIn}
        disabled={isLoading || isSuccess}
        className="w-full flex items-center justify-center gap-3 px-4 py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.1] hover:border-white/[0.2] text-xs font-sans font-medium text-slate-200 hover:text-white transition-all duration-150 cursor-pointer disabled:opacity-50"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24">
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
          />
        </svg>
        <span>Continue with Google Workspace (OIDC)</span>
      </button>

      {/* One-Click Clinical Personas (Demo Mode) */}
      <PersonaSelector
        onSelect={handleSelectPersona}
        disabled={isLoading || isSuccess}
      />

      {/* Security Micro-UI */}
      <SecurityIndicator />

      {/* Create Account & Navigation Footer */}
      <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between text-xs font-sans text-slate-400">
        <span>Don't have an account?</span>
        <button
          type="button"
          onClick={() => navigate('/signup')}
          className="text-cyan-400 hover:text-cyan-300 font-bold transition-colors cursor-pointer"
        >
          Create Account →
        </button>
      </div>
    </div>
  );
};
