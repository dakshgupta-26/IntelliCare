import React, { useState, useEffect } from 'react';
import {
  Lock,
  ArrowRight,
  CheckCircle2,
  ShieldAlert,
  ShieldCheck,
  Check,
  X,
  Loader2,
  Stethoscope
} from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { useRouterStore } from '../../store/useRouterStore';
import { Button } from '../../components/ui/Button';
import { IntelliCareLogo } from '../../components/brand/IntelliCareLogo';

export const ActivateStaffPage: React.FC = () => {
  const navigate = useRouterStore((state) => state.navigate);
  const activateStaff = useAuthStore((state) => state.activateStaff);

  const [token, setToken] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      setToken(params.get('token') || '');
      setEmail(params.get('email') || '');
    }
  }, []);

  const criteria = [
    { label: 'At least 8 characters', met: password.length >= 8 },
    { label: 'One uppercase letter (A-Z)', met: /[A-Z]/.test(password) },
    { label: 'One lowercase letter (a-z)', met: /[a-z]/.test(password) },
    { label: 'One number (0-9)', met: /[0-9]/.test(password) },
    { label: 'One special symbol (!@#$%^&*)', met: /[^A-Za-z0-9]/.test(password) }
  ];
  const allCriteriaMet = criteria.every((c) => c.met);
  const passwordsMatch = password.length > 0 && password === confirmPassword;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      setErrorMessage('Missing clinical staff activation security token in URL.');
      return;
    }

    if (!passwordsMatch) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    if (!allCriteriaMet) {
      setErrorMessage('Please satisfy all password complexity requirements.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      await activateStaff(token, password, confirmPassword);
      setIsSuccess(true);
      setTimeout(() => {
        navigate('/app/dashboard');
      }, 1200);
    } catch (err: any) {
      setErrorMessage(
        err.message || 'Staff activation failed. The invitation link may have expired or already been used.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#030612] text-slate-100 flex items-center justify-center p-4 sm:p-6 selection:bg-cyan-500/20 text-left">
      <div className="w-full max-w-md space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center justify-center group focus:outline-none cursor-pointer"
            aria-label="IntelliCare Home"
          >
            <IntelliCareLogo variant="with-tagline" size="lg" showBadge badgeText="ONBOARDING" animated />
          </button>

          <h1 className="text-xl sm:text-2xl font-display font-extrabold text-white tracking-tight pt-2">
            Activate Clinical Staff Account
          </h1>
          <p className="text-xs text-slate-400 font-sans max-w-sm mx-auto">
            You have been provisioned access to IntelliCare Hospital Operations. Create your permanent access password to activate your credentials.
          </p>
        </div>

        {/* Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#070D1A] border border-white/[0.08] shadow-[0_20px_50px_rgba(0,0,0,0.8)] backdrop-blur-2xl space-y-5">
          {/* Email / Clinician Info Tag */}
          <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <Stethoscope className="w-4 h-4 text-cyan-400 shrink-0" />
              <div className="min-w-0">
                <div className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider">
                  Invited Practitioner
                </div>
                <div className="text-xs font-mono text-white truncate font-bold">
                  {email || 'Hospital Clinician'}
                </div>
              </div>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-500/30 font-bold">
              VERIFIED INVITE
            </span>
          </div>

          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2 animate-in fade-in duration-150 font-sans">
              <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {isSuccess ? (
            <div className="space-y-4 text-center py-4 animate-in fade-in duration-200">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto animate-bounce">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h2 className="text-lg font-display font-bold text-white">
                Account Activated Successfully!
              </h2>
              <p className="text-xs text-slate-400 font-sans">
                Your credentials are cryptographically verified. Launching operational command center...
              </p>
              <div className="pt-2 flex justify-center">
                <Loader2 className="w-5 h-5 text-cyan-400 animate-spin" />
              </div>
            </div>
          ) : !token ? (
            <div className="space-y-4 text-center py-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 mx-auto">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <h2 className="text-base font-display font-bold text-white">
                Invalid or Missing Activation Link
              </h2>
              <p className="text-xs text-slate-400 leading-relaxed font-sans">
                This activation link is missing a security token. Please ask your hospital administrator to resend your invite, or sign in if you have already activated your account.
              </p>
              <Button
                variant="primary"
                size="sm"
                className="w-full"
                onClick={() => navigate('/login')}
              >
                Go to Sign In
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* New Password */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono font-medium text-slate-300 block">
                  Create Permanent Access Password
                </label>
                <div className="relative flex items-center rounded-xl bg-[#030712] border border-white/[0.1] focus-within:border-cyan-400/80 transition-all">
                  <div className="pl-3.5 pr-2 pointer-events-none text-slate-400 flex items-center justify-center">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    required
                    placeholder="Enter strong password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                    className="w-full py-2.5 pr-3.5 bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono font-medium text-slate-300 block">
                  Confirm Password
                </label>
                <div className="relative flex items-center rounded-xl bg-[#030712] border border-white/[0.1] focus-within:border-cyan-400/80 transition-all">
                  <div className="pl-3.5 pr-2 pointer-events-none text-slate-400 flex items-center justify-center">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    required
                    placeholder="Re-type password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={isLoading}
                    className="w-full py-2.5 pr-3.5 bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none"
                  />
                </div>
                {confirmPassword && !passwordsMatch && (
                  <p className="text-[11px] font-mono text-rose-400">Passwords do not match.</p>
                )}
              </div>

              {/* Password Requirements */}
              <div className="p-3.5 rounded-xl bg-surface-200/40 border border-slate-800 space-y-2">
                <div className="text-[10px] font-mono uppercase text-slate-400 font-bold">
                  Security Complexity Requirements
                </div>
                <div className="grid grid-cols-1 gap-1">
                  {criteria.map((c, i) => (
                    <div
                      key={i}
                      className={`flex items-center gap-2 text-[11px] font-mono ${
                        c.met ? 'text-emerald-400' : 'text-slate-500'
                      }`}
                    >
                      {c.met ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                      <span>{c.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="md"
                className="w-full justify-center"
                disabled={isLoading || !passwordsMatch || !allCriteriaMet}
                icon={
                  isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                  ) : (
                    <ArrowRight className="w-4 h-4" />
                  )
                }
              >
                {isLoading ? 'Activating Credentials...' : 'Activate Account & Access Portal'}
              </Button>
            </form>
          )}

          {/* Return link */}
          <div className="text-center pt-2 border-t border-slate-800/60">
            <button
              onClick={() => navigate('/login')}
              className="text-xs font-mono text-cyan-400 hover:text-cyan-300 font-semibold cursor-pointer"
            >
              Already activated? Proceed to Sign In →
            </button>
          </div>
        </div>

        {/* Security badge */}
        <div className="flex items-center justify-center gap-2 text-[10px] font-mono text-slate-500">
          <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
          <span>IntelliCare Zero-Trust Architecture • ISO 27001 & HIPAA Compliant</span>
        </div>
      </div>
    </div>
  );
};
