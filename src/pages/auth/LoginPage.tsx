import React, { useState } from 'react';
import {
  ArrowRight,
  Lock,
  Mail,
  Sparkles,
  ShieldAlert
} from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { useRouterStore } from '../../store/useRouterStore';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { IntelliCareLogo } from '../../components/brand/IntelliCareLogo';

export const LoginPage: React.FC = () => {
  const login = useAuthStore((state) => state.login);
  const navigate = useRouterStore((state) => state.navigate);

  const [email, setEmail] = useState('sarah.chen@intellicare.health');
  const [password, setPassword] = useState('IntelliCare@2026!');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [unverifiedEmail, setUnverifiedEmail] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setUnverifiedEmail(null);
    setIsLoading(true);

    try {
      await login(email, password);
      navigate('/app/dashboard');
    } catch (err: any) {
      if (err.code === 'EMAIL_VERIFICATION_REQUIRED') {
        setUnverifiedEmail(err.email || email);
        setErrorMessage('Your account email has not been verified yet.');
      } else {
        setErrorMessage(err.message || 'Invalid email or password.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoSignIn = async (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('IntelliCare@2026!');
    setErrorMessage(null);
    setIsLoading(true);
    try {
      await login(demoEmail, 'IntelliCare@2026!');
      navigate('/app/dashboard');
    } catch (err: any) {
      setErrorMessage(err.message || 'Demo sign-in failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    // Redirect to backend Google OAuth initiation
    window.location.href = '/auth/oauth/google';
  };

  return (
    <div className="min-h-screen bg-[#030612] text-slate-100 flex items-center justify-center p-4 sm:p-6 selection:bg-cyan-500/20">
      <div className="w-full max-w-md space-y-6">
        {/* Brand Logo Header */}
        <div className="text-center space-y-3">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center justify-center group focus:outline-none cursor-pointer"
            aria-label="IntelliCare Home"
          >
            <IntelliCareLogo variant="with-tagline" size="lg" showBadge badgeText="ENTERPRISE" animated />
          </button>

          <h1 className="text-xl font-display font-bold text-white tracking-tight pt-2">
            Sign In to Decision Support OS
          </h1>
          <p className="text-xs text-slate-400 font-sans">
            Zero-trust authenticated hospital operations and resource governance.
          </p>
        </div>

        {/* Login Form Card */}
        <div className="p-6 sm:p-7 rounded-3xl bg-[#070D1A] border border-white/[0.08] shadow-[0_20px_50px_rgba(0,0,0,0.8)] backdrop-blur-2xl space-y-5">
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex flex-col gap-2 animate-in fade-in duration-150 font-sans">
              <div className="flex items-start gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
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

          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              label="Hospital Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={<Mail className="w-4 h-4 text-slate-400" />}
              required
            />

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-mono font-medium text-slate-300">
                  Access Password
                </label>
                <button
                  type="button"
                  onClick={() => navigate('/forgot-password')}
                  className="text-[11px] font-sans text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer"
                >
                  Forgot password?
                </button>
              </div>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                icon={<Lock className="w-4 h-4 text-slate-400" />}
                required
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              size="md"
              className="w-full mt-2"
              icon={<ArrowRight className="w-4 h-4" />}
              disabled={isLoading}
            >
              {isLoading ? 'Authenticating Credentials...' : 'Sign In to Workspace'}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-4 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/[0.08]" />
            </div>
            <span className="relative px-3 bg-[#070D1A] text-[10px] font-mono text-slate-500 uppercase">
              Or continue with
            </span>
          </div>

          {/* Google OAuth Button */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            className="w-full flex items-center justify-center gap-3 px-4 py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.1] hover:border-white/[0.2] text-xs font-sans font-medium text-white transition-all cursor-pointer"
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

          {/* Interactive Fast Persona Demo Selectors */}
          <div className="pt-4 border-t border-white/[0.08] space-y-2">
            <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-400 uppercase font-bold">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>One-Click Clinical Personas:</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <button
                type="button"
                onClick={() => handleDemoSignIn('sarah.chen@intellicare.health')}
                className="p-2 rounded-xl bg-white/[0.03] hover:bg-cyan-500/10 border border-white/[0.06] hover:border-cyan-500/30 text-slate-300 hover:text-cyan-300 transition-all text-left cursor-pointer truncate"
              >
                <span className="font-bold block text-white truncate">Hospital Admin</span>
                <span className="text-[10px] text-slate-500 truncate">Dr. Sarah Chen</span>
              </button>

              <button
                type="button"
                onClick={() => handleDemoSignIn('marcus.vance@intellicare.health')}
                className="p-2 rounded-xl bg-white/[0.03] hover:bg-cyan-500/10 border border-white/[0.06] hover:border-cyan-500/30 text-slate-300 hover:text-cyan-300 transition-all text-left cursor-pointer truncate"
              >
                <span className="font-bold block text-white truncate">ICU Director</span>
                <span className="text-[10px] text-slate-500 truncate">Dr. Marcus Vance</span>
              </button>
            </div>
          </div>

          {/* Sign Up Link */}
          <div className="pt-3 text-center border-t border-white/[0.08]">
            <p className="text-xs text-slate-400 font-sans">
              Don't have an account?{' '}
              <button
                onClick={() => navigate('/signup')}
                className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors cursor-pointer"
              >
                Create Account
              </button>
            </p>
          </div>
        </div>

        {/* Back to landing link */}
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
