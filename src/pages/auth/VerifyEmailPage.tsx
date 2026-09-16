import React, { useState, useRef, useEffect } from 'react';
import { ArrowRight, RotateCw, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { useRouterStore } from '../../store/useRouterStore';
import { Button } from '../../components/ui/Button';
import { IntelliCareLogo } from '../../components/brand/IntelliCareLogo';

export const VerifyEmailPage: React.FC = () => {
  const verifyEmail = useAuthStore((state) => state.verifyEmail);
  const resendOtp = useAuthStore((state) => state.resendOtp);
  const unverifiedEmail = useAuthStore((state) => state.unverifiedEmail);
  const navigate = useRouterStore((state) => state.navigate);

  // Extract email from store or URL query parameter
  const [email] = useState(() => {
    if (unverifiedEmail) return unverifiedEmail;
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      return params.get('email') || '';
    }
    return '';
  });

  const [digits, setDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Mask email for privacy: d***@hospital.org
  const maskedEmail = React.useMemo(() => {
    if (!email) return 'your registered email';
    const [user, domain] = email.split('@');
    if (!domain) return email;
    const maskedUser = user.length > 2 ? `${user[0]}***${user[user.length - 1]}` : `${user[0]}***`;
    return `${maskedUser}@${domain}`;
  }, [email]);

  // Resend Countdown Timer
  useEffect(() => {
    if (countdown <= 0) {
      setCanResend(true);
      return;
    }
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  // Focus first input on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleDigitChange = (index: number, val: string) => {
    // Only accept numbers
    const clean = val.replace(/\D/g, '');
    if (!clean && val !== '') return;

    const newDigits = [...digits];
    newDigits[index] = clean.slice(-1); // Take last character
    setDigits(newDigits);
    setErrorMessage(null);

    // Auto-advance focus
    if (clean && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit if all 6 filled
    if (index === 5 && clean) {
      const fullOtp = newDigits.join('');
      if (fullOtp.length === 6) {
        submitVerification(fullOtp);
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').trim().replace(/\D/g, '');
    if (pasteData.length === 6) {
      const newDigits = pasteData.split('');
      setDigits(newDigits);
      inputRefs.current[5]?.focus();
      submitVerification(pasteData);
    }
  };

  const submitVerification = async (otpValue?: string) => {
    const fullOtp = otpValue || digits.join('');
    if (fullOtp.length !== 6) {
      setErrorMessage('Please enter all 6 digits of your verification code.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      await verifyEmail(email, fullOtp);
      setSuccessMessage('Email verified successfully! Redirecting to Workspace...');
      setTimeout(() => {
        navigate('/app/dashboard');
      }, 1200);
    } catch (err: any) {
      setErrorMessage(err.message || 'Verification failed. Please check the code and try again.');
      // Clear digits on error
      setDigits(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (!canResend || isResending) return;
    setIsResending(true);
    setErrorMessage(null);

    try {
      await resendOtp(email);
      setSuccessMessage('A fresh verification code has been dispatched to your email.');
      setCountdown(60);
      setCanResend(false);
      setDigits(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to resend code.');
    } finally {
      setIsResending(false);
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
            <IntelliCareLogo variant="with-tagline" size="lg" showBadge badgeText="VERIFY" animated />
          </button>

          <h1 className="text-xl font-display font-bold text-white tracking-tight pt-2">
            Verify Your Email Address
          </h1>
          <p className="text-xs text-slate-300 font-sans max-w-sm mx-auto leading-relaxed">
            We sent a single-use 6-digit verification code to:
            <br />
            <strong className="text-cyan-400 font-mono text-xs">{maskedEmail}</strong>
          </p>
        </div>

        {/* Verification Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#070D1A] border border-white/[0.08] shadow-[0_20px_50px_rgba(0,0,0,0.8)] backdrop-blur-2xl space-y-6">
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2 animate-in fade-in duration-150 font-sans">
              <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-start gap-2 animate-in fade-in duration-150 font-sans">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* 6 Segmented Digit Inputs */}
          <div className="flex items-center justify-between gap-2 sm:gap-2.5">
            {digits.map((digit, idx) => (
              <input
                key={idx}
                ref={(el) => (inputRefs.current[idx] = el)}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={1}
                value={digit}
                onChange={(e) => handleDigitChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                onPaste={idx === 0 ? handlePaste : undefined}
                className="w-12 h-14 sm:w-14 sm:h-16 text-center text-xl sm:text-2xl font-mono font-bold text-cyan-300 bg-[#040813] border-2 border-white/[0.1] rounded-xl focus:border-cyan-400 focus:outline-none focus:ring-4 focus:ring-cyan-500/20 transition-all selection:bg-transparent shadow-inner"
              />
            ))}
          </div>

          <Button
            type="button"
            variant="primary"
            size="md"
            className="w-full"
            icon={<ArrowRight className="w-4 h-4" />}
            disabled={isLoading || digits.join('').length !== 6}
            onClick={() => submitVerification()}
          >
            {isLoading ? 'Verifying...' : 'Verify & Continue'}
          </Button>

          {/* Resend Cooldown Section */}
          <div className="pt-2 text-center text-xs font-mono text-slate-400 border-t border-white/[0.08] flex items-center justify-between">
            <span>Didn't receive a code?</span>
            {canResend ? (
              <button
                onClick={handleResend}
                disabled={isResending}
                className="inline-flex items-center gap-1.5 text-cyan-400 hover:text-cyan-300 font-bold transition-colors cursor-pointer"
              >
                <RotateCw className={`w-3.5 h-3.5 ${isResending ? 'animate-spin' : ''}`} />
                <span>Resend Code</span>
              </button>
            ) : (
              <span className="text-slate-500">
                Resend in <span className="text-slate-300 font-bold">{countdown}s</span>
              </span>
            )}
          </div>
        </div>

        {/* Change email or sign out */}
        <div className="text-center">
          <button
            onClick={() => navigate('/login')}
            className="text-xs font-mono text-slate-500 hover:text-cyan-400 transition-colors cursor-pointer"
          >
            ← Back to Sign In
          </button>
        </div>
      </div>
    </div>
  );
};
