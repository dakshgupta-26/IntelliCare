import React from 'react';
import { Badge } from '../ui/Badge';
import { Lock, Key, FileCheck, EyeOff, UserCheck, Activity } from 'lucide-react';

export const SecuritySection: React.FC = () => {
  const pillars = [
    {
      icon: <Key className="w-5 h-5 text-cyan-400" />,
      title: 'Role-Based Access Control (RBAC)',
      description: 'Granular permissions differentiating clinical directors, charge nurses, bed managers, and system auditors.',
    },
    {
      icon: <Lock className="w-5 h-5 text-indigo-400" />,
      title: 'End-to-End Encryption',
      description: 'All telemetry and event data is encrypted at rest (AES-256) and in transit (TLS 1.3 / mTLS between microservices).',
    },
    {
      icon: <FileCheck className="w-5 h-5 text-emerald-400" />,
      title: 'Immutable Audit Logging',
      description: 'Cryptographically signed audit trail recording every forecast inference, MILP solve parameter, and human approval action.',
    },
    {
      icon: <EyeOff className="w-5 h-5 text-teal-400" />,
      title: 'Data Minimization & De-Identification',
      description: 'Optimization tensors operate strictly on aggregated counts and clinical acuity vectors with zero direct patient identifiers.',
    },
    {
      icon: <UserCheck className="w-5 h-5 text-amber-400" />,
      title: 'Human-in-the-Loop Safeguards',
      description: 'Zero autonomous dispatching. All mathematical advisories require affirmative clinical supervisor authorization.',
    },
    {
      icon: <Activity className="w-5 h-5 text-blue-400" />,
      title: 'Real-Time Observability',
      description: 'Continuous monitoring of model drift, constraint satisfaction rates, solver timeouts, and API latency metrics.',
    },
  ];

  return (
    <section id="security" className="relative py-28 bg-navy-950 overflow-hidden">
      {/* Background illumination */}
      <div className="absolute top-1/3 left-1/3 w-[600px] h-[400px] bg-indigo-500/5 blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <Badge variant="indigo" size="md" className="mb-4">
            GOVERNANCE & RESPONSIBLE AI
          </Badge>

          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight">
            Built for responsible intelligence.
          </h2>

          <p className="mt-4 text-base sm:text-lg text-slate-400 leading-relaxed">
            Security-conscious architecture engineered from the ground up to protect institutional integrity, clinical accountability, and operational privacy.
          </p>
        </div>

        {/* Security Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pillars.map((p, idx) => (
            <div
              key={idx}
              className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col justify-between hover:border-indigo-500/30 transition-all duration-300"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-surface-200 border border-slate-700/60 flex items-center justify-center mb-4">
                  {p.icon}
                </div>

                <h3 className="text-base font-display font-bold text-white mb-2">
                  {p.title}
                </h3>

                <p className="text-xs text-slate-400 leading-relaxed">
                  {p.description}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-800/80 text-[11px] font-mono text-slate-500 flex items-center justify-between">
                <span>Security Control</span>
                <span className="text-emerald-400">Enforced</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
