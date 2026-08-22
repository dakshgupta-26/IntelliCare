import React from 'react';
import {
  LogOut,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { useRouterStore } from '../../store/useRouterStore';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';

export const ProfilePage: React.FC = () => {
  const currentUser = useAuthStore((state) => state.currentUser);
  const logout = useAuthStore((state) => state.logout);
  const setRoleSwitchingOpen = useAuthStore((state) => state.setRoleSwitchingOpen);
  const navigate = useRouterStore((state) => state.navigate);

  if (!currentUser) return null;

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider font-bold">
              User Identity & Governance
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-white tracking-tight">
            User Profile
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Account credentials, assigned clinical scope, and cryptographic RBAC permissions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            icon={<Sparkles className="w-3.5 h-3.5 text-cyan-400" />}
            onClick={() => setRoleSwitchingOpen(true)}
          >
            Switch Persona
          </Button>

          <Button
            variant="outline"
            size="sm"
            icon={<LogOut className="w-3.5 h-3.5 text-rose-400" />}
            onClick={() => {
              logout();
              navigate('/login');
            }}
          >
            Sign Out
          </Button>
        </div>
      </div>

      {/* 2. User Overview Card */}
      <div className="p-6 rounded-3xl bg-surface-100 dark:bg-[#0a1628] border border-slate-700/80 dark:border-slate-800 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-5">
          <img
            src={currentUser.avatarUrl}
            alt={currentUser.name}
            className="w-20 h-20 rounded-2xl object-cover border-2 border-cyan-500/40 shrink-0"
          />
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-display font-bold text-white">
                {currentUser.name}
              </h2>
              <Badge variant="cyan" size="sm">
                {currentUser.role.replace('_', ' ')}
              </Badge>
            </div>
            <p className="text-xs font-mono text-slate-400">
              {currentUser.title} • {currentUser.departmentName}
            </p>
            <p className="text-xs font-mono text-slate-500">
              {currentUser.email} • Last active {currentUser.lastLoginAt}
            </p>
          </div>
        </div>

        {/* Permissions Scope Matrix */}
        <div className="pt-6 border-t border-slate-800 space-y-3">
          <h3 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
            Granted Role-Based Access Control (RBAC) Permissions ({currentUser.permissions.length}):
          </h3>
          <div className="flex flex-wrap gap-2">
            {currentUser.permissions.map((p) => (
              <div
                key={p}
                className="px-3 py-1.5 rounded-xl bg-surface-200/50 dark:bg-[#07111f] border border-slate-800 text-[11px] font-mono text-cyan-300 flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-3 h-3 text-cyan-400" />
                <span>{p}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
