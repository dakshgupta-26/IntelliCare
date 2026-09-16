import React, { useState } from 'react';
import { Mail, Lock, User as UserIcon, ArrowRight, Check, X, ShieldAlert } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { useRouterStore } from '../../store/useRouterStore';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { IntelliCareLogo } from '../../components/brand/IntelliCareLogo';

export const RegisterPage: React.FC = () => {
  const register = useAuthStore((state) => state.register);
  const navigate = useRouterStore((state) => state.navigate);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Live password validation checklist
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
    setErrorMessage(null);

    if (!passwordsMatch) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    if (!allCriteriaMet) {
      setErrorMessage('Please satisfy all password complexity criteria.');
      return;
    }

    setIsLoading(true);
    try {
      await register(name, email, password, confirmPassword);
      // Transition to verification page
      navigate(`/verify-email?email=${encodeURIComponent(email)}`);
    } catch (err: any) {
      setErrorMessage(err.message || 'Registration failed. Please check your information.');
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
            <IntelliCareLogo variant="with-tagline" size="lg" showBadge badgeText="REGISTER" animated />
          </button>

          <h1 className="text-xl font-display font-bold text-white tracking-tight pt-2">
            Create Healthcare Provider Account
          </h1>
          <p className="text-xs text-slate-400 font-sans">
            Enter authorized hospital credentials for decision support access.
          </p>
        </div>

        {/* Form Container Card */}
        <div className="p-6 rounded-3xl bg-[#070D1A] border border-white/[0.08] shadow-[0_20px_50px_rgba(0,0,0,0.8)] backdrop-blur-2xl space-y-5">
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2 animate-in fade-in duration-150 font-sans">
              <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full Name & Clinical Title"
              type="text"
              placeholder="Dr. Eleanor Vance, MD"
              value={name}
              onChange={(e) => setName(e.target.value)}
              icon={<UserIcon className="w-4 h-4 text-slate-400" />}
              required
            />

            <Input
              label="Hospital / Organization Email"
              type="email"
              placeholder="name@hospital.health"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={<Mail className="w-4 h-4 text-slate-400" />}
              required
            />

            <Input
              label="Password"
              type="password"
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={<Lock className="w-4 h-4 text-slate-400" />}
              required
            />

            {/* Live Password Strength Checklist */}
            {password.length > 0 && (
              <div className="p-3 rounded-xl bg-black/40 border border-white/[0.06] space-y-1.5 text-[11px] font-mono">
                <span className="text-slate-400 block pb-1 font-bold">Password Requirements:</span>
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
              label="Confirm Password"
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
              disabled={isLoading || !allCriteriaMet || !passwordsMatch}
            >
              {isLoading ? 'Creating Account...' : 'Continue to Email Verification'}
            </Button>
          </form>

          {/* Sign In Link */}
          <div className="pt-3 text-center border-t border-white/[0.08]">
            <p className="text-xs text-slate-400 font-sans">
              Already have an account?{' '}
              <button
                onClick={() => navigate('/login')}
                className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors cursor-pointer"
              >
                Sign In
              </button>
            </p>
          </div>
        </div>

        {/* Back Link */}
        <div className="text-center">
          <button
            onClick={() => navigate('/')}
            className="text-xs font-mono text-slate-500 hover:text-cyan-400 transition-colors cursor-pointer"
          >
            ← Back to Platform Overview
          </button>
        </div>
      </div>
    </div>
  );
};
