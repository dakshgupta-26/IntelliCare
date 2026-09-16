import React, { useState, useEffect } from 'react';
import { Lock, ArrowRight, CheckCircle2, ShieldAlert, Check, X } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { useRouterStore } from '../../store/useRouterStore';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { IntelliCareLogo } from '../../components/brand/IntelliCareLogo';

export const ResetPasswordPage: React.FC = () => {
  const resetPassword = useAuthStore((state) => state.resetPassword);
  const navigate = useRouterStore((state) => state.navigate);

  const [token, setToken] = useState('');
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
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
    { label: 'At least 8 characters', met: newPassword.length >= 8 },
    { label: 'One uppercase letter (A-Z)', met: /[A-Z]/.test(newPassword) },
    { label: 'One lowercase letter (a-z)', met: /[a-z]/.test(newPassword) },
    { label: 'One number (0-9)', met: /[0-9]/.test(newPassword) },
    { label: 'One special symbol (!@#$%^&*)', met: /[^A-Za-z0-9]/.test(newPassword) }
  ];
  const allCriteriaMet = criteria.every((c) => c.met);
  const passwordsMatch = newPassword.length > 0 && newPassword === confirmPassword;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      setErrorMessage('Missing password reset security token.');
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
      await resetPassword(token, newPassword, confirmPassword);
      setIsSuccess(true);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to reset password. The link may have expired.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#030612] text-slate-100 flex items-center justify-center p-4 sm:p-6 selection:bg-cyan-500/20">
      <div className="w-full max-w-md space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center justify-center group focus:outline-none cursor-pointer"
            aria-label="IntelliCare Home"
          >
            <IntelliCareLogo variant="with-tagline" size="lg" showBadge badgeText="SECURITY" animated />
          </button>

          <h1 className="text-xl font-display font-bold text-white tracking-tight pt-2">
            Set New Password
          </h1>
          <p className="text-xs text-slate-400 font-sans">
            Choose a strong new credential for <strong className="text-slate-200">{email || 'your account'}</strong>.
          </p>
        </div>

        {/* Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#070D1A] border border-white/[0.08] shadow-[0_20px_50px_rgba(0,0,0,0.8)] backdrop-blur-2xl space-y-5">
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2 animate-in fade-in duration-150 font-sans">
              <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {isSuccess ? (
            <div className="space-y-4 text-center py-2 animate-in fade-in duration-200">
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-display font-bold text-white">
                Password Successfully Reset
              </h3>
              <p className="text-xs text-slate-300 font-sans leading-relaxed">
                Your password has been updated and all other active sessions have been invalidated for security.
              </p>

              <Button
                variant="primary"
                size="md"
                className="w-full mt-4"
                onClick={() => navigate('/login')}
              >
                Sign In with New Password →
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="New Password"
                type="password"
                placeholder="••••••••••••"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                icon={<Lock className="w-4 h-4 text-slate-400" />}
                required
              />

              {newPassword.length > 0 && (
                <div className="p-3 rounded-xl bg-black/40 border border-white/[0.06] space-y-1.5 text-[11px] font-mono">
                  <span className="text-slate-400 block pb-1 font-bold">Requirements:</span>
                  {criteria.map((c) => (
                    <div key={c.label} className="flex items-center gap-2">
                      {c.met ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <X className="w-3.5 h-3.5 text-slate-500" />
                      )}
                      <span className={c.met ? 'text-slate-200 font-medium' : 'text-slate-500'}>
                        {c.label}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              <Input
                label="Confirm New Password"
                type="password"
                placeholder="••••••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                icon={<Lock className="w-4 h-4 text-slate-400" />}
                required
              />

              {confirmPassword.length > 0 && !passwordsMatch && (
                <p className="text-[11px] font-mono text-rose-400">Passwords do not match.</p>
              )}

              <Button
                type="submit"
                variant="primary"
                size="md"
                className="w-full mt-2"
                icon={<ArrowRight className="w-4 h-4" />}
                disabled={isLoading || !allCriteriaMet || !passwordsMatch || !token}
              >
                {isLoading ? 'Resetting Password...' : 'Save New Password'}
              </Button>
            </form>
          )}

          {!isSuccess && (
            <div className="pt-3 text-center border-t border-white/[0.08]">
              <button
                onClick={() => navigate('/login')}
                className="text-xs font-mono text-slate-400 hover:text-cyan-300 transition-colors cursor-pointer"
              >
                ← Back to Sign In
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
