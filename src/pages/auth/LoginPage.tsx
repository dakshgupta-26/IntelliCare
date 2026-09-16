import React, { useState } from 'react';
import {
  ArrowRight,
  Lock,
  Mail,
  Sparkles
} from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { useRouterStore } from '../../store/useRouterStore';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { UserRole } from '../../types/auth';
import { IntelliCareLogo } from '../../components/brand/IntelliCareLogo';

export const LoginPage: React.FC = () => {
  const login = useAuthStore((state) => state.login);
  const navigate = useRouterStore((state) => state.navigate);

  const [email, setEmail] = useState('sarah.chen@intellicare.health');
  const [password, setPassword] = useState('••••••••••••');
  const [role, setRole] = useState<UserRole>('HOSPITAL_ADMIN');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await login(email, role);
    setIsLoading(false);
    navigate('/app/dashboard');
  };

  const handleDemoSignIn = async (selectedRole: UserRole, demoEmail: string) => {
    setIsLoading(true);
    await login(demoEmail, selectedRole);
    setIsLoading(false);
    navigate('/app/dashboard');
  };

  return (
    <div className="min-h-screen bg-navy-950 text-slate-100 flex items-center justify-center p-4 sm:p-6 selection:bg-brand-cyan/20">
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
          <p className="text-xs text-slate-400 font-mono">
            Hybrid AI-RAG & Operations Research Platform
          </p>
        </div>

        {/* Login Form Card */}
        <div className="p-6 rounded-3xl bg-surface-100 dark:bg-[#0c182c] border border-slate-700/80 dark:border-slate-800 shadow-2xl space-y-4">
          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              label="Hospital Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={<Mail className="w-4 h-4 text-slate-400" />}
              required
            />

            <Input
              label="Access Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={<Lock className="w-4 h-4 text-slate-400" />}
              required
            />

            <div className="space-y-1.5">
              <label className="text-xs font-mono font-medium text-slate-300 block">
                Sign-In Persona Role:
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as any)}
                className="w-full bg-surface-200/80 border border-slate-700/80 rounded-xl p-2.5 text-xs font-mono text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-cyan/40"
              >
                <option value="HOSPITAL_ADMIN">Hospital Administrator (Dr. Sarah Chen)</option>
                <option value="SUPER_ADMIN">System Architect (Alex Ross)</option>
                <option value="DEPARTMENT_MANAGER">ICU Director (Dr. Marcus Vance)</option>
                <option value="OPERATIONS_COORDINATOR">Flow Coordinator (Elena Rostova)</option>
                <option value="AUTHORIZED_STAFF">Charge Nurse (David Kim)</option>
              </select>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="md"
              className="w-full mt-2"
              icon={<ArrowRight className="w-4 h-4" />}
              disabled={isLoading}
            >
              {isLoading ? 'Authenticating...' : 'Sign In to Workspace'}
            </Button>
          </form>

          {/* Fast Demo One-Click Personas */}
          <div className="pt-4 border-t border-slate-800/80 space-y-2">
            <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-400 uppercase font-bold">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>One-Click Interactive Demo Personas:</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <button
                type="button"
                onClick={() => handleDemoSignIn('HOSPITAL_ADMIN', 'sarah.chen@intellicare.health')}
                className="p-2 rounded-xl bg-surface-200/50 hover:bg-cyan-500/15 border border-slate-800 hover:border-cyan-500/40 text-slate-300 hover:text-cyan-300 transition-all text-left cursor-pointer truncate"
              >
                <span className="font-bold block text-white">Hospital Admin</span>
                <span className="text-[10px] text-slate-500">Dr. Sarah Chen</span>
              </button>

              <button
                type="button"
                onClick={() => handleDemoSignIn('DEPARTMENT_MANAGER', 'marcus.vance@intellicare.health')}
                className="p-2 rounded-xl bg-surface-200/50 hover:bg-cyan-500/15 border border-slate-800 hover:border-cyan-500/40 text-slate-300 hover:text-cyan-300 transition-all text-left cursor-pointer truncate"
              >
                <span className="font-bold block text-white">ICU Director</span>
                <span className="text-[10px] text-slate-500">Dr. Marcus Vance</span>
              </button>
            </div>
          </div>
        </div>

        {/* Back to landing link */}
        <div className="text-center">
          <button
            onClick={() => navigate('/')}
            className="text-xs font-mono text-slate-400 hover:text-cyan-300 transition-colors"
          >
            ← Back to Platform Overview
          </button>
        </div>
      </div>
    </div>
  );
};
