import React, { useState } from 'react';
import {
  Activity,
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
        <div className="text-center space-y-2">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2.5 group focus:outline-none cursor-pointer"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-brand-cyan via-brand-blue to-indigo-600 p-[1px] shadow-[0_0_20px_rgba(22,199,243,0.4)]">
              <div className="w-full h-full bg-navy-950 rounded-[15px] flex items-center justify-center">
                <Activity className="w-5 h-5 text-brand-cyan" />
              </div>
            </div>
            <span className="font-display font-extrabold text-2xl tracking-tight text-white">
              IntelliCare
            </span>
          </button>

          <h1 className="text-xl font-display font-bold text-white tracking-tight">
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
