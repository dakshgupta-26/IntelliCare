import React, { useState } from 'react';
import { Mail, ArrowRight, CheckCircle2, ShieldAlert } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { useRouterStore } from '../../store/useRouterStore';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { IntelliCareLogo } from '../../components/brand/IntelliCareLogo';

export const ForgotPasswordPage: React.FC = () => {
  const forgotPassword = useAuthStore((state) => state.forgotPassword);
  const navigate = useRouterStore((state) => state.navigate);

  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [devResetUrl, setDevResetUrl] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await forgotPassword(email.trim());
      setIsSubmitted(true);
      if (res?.devResetUrl) {
        setDevResetUrl(res.devResetUrl);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to submit request.');
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
            Reset Password
          </h1>
          <p className="text-xs text-slate-400 font-sans max-w-sm mx-auto">
            Enter your hospital email to receive single-use cryptographic reset instructions.
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

          {isSubmitted ? (
            <div className="space-y-4 text-center py-2 animate-in fade-in duration-200">
              <div className="w-12 h-12 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mx-auto text-cyan-400">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-display font-bold text-white">
                Check Your Inbox
              </h3>
              <p className="text-xs text-slate-300 font-sans leading-relaxed">
                If an authorized account exists for <strong className="text-cyan-400 font-mono">{email}</strong>, we have dispatched single-use password reset instructions via Mailjet.
              </p>

              {devResetUrl && (
                <div className="p-3 rounded-xl bg-black/40 border border-cyan-500/30 text-left text-[11px] font-mono space-y-1">
                  <span className="text-cyan-400 font-bold block">Developer Preview Link:</span>
                  <a
                    href={devResetUrl}
                    className="text-slate-300 hover:text-white underline break-all block"
                  >
                    {devResetUrl}
                  </a>
                </div>
              )}

              <Button
                variant="secondary"
                size="md"
                className="w-full mt-4"
                onClick={() => navigate('/login')}
              >
                Return to Sign In
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Hospital Email Address"
                type="email"
                placeholder="name@hospital.health"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                icon={<Mail className="w-4 h-4 text-slate-400" />}
                required
              />

              <Button
                type="submit"
                variant="primary"
                size="md"
                className="w-full mt-2"
                icon={<ArrowRight className="w-4 h-4" />}
                disabled={isLoading || !email}
              >
                {isLoading ? 'Dispatching Instructions...' : 'Send Password Reset Link'}
              </Button>
            </form>
          )}

          {!isSubmitted && (
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
