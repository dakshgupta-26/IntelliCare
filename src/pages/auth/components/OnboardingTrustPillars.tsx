import React from 'react';
import { UserCheck, ShieldCheck, LockKeyhole } from 'lucide-react';

interface TrustPillar {
  step: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  accentColor: string;
}

const PILLARS: TrustPillar[] = [
  {
    step: '01',
    title: 'Identity Verification',
    description: 'Clinical role and healthcare organization validation before provisioning.',
    icon: UserCheck,
    accentColor: '#22D3EE'
  },
  {
    step: '02',
    title: 'Cryptographic OTP',
    description: '10-minute single-use SHA-256 hashed verification token dispatched to organization email.',
    icon: LockKeyhole,
    accentColor: '#0EA5E9'
  },
  {
    step: '03',
    title: 'Zero-Trust Session',
    description: 'Short-lived in-memory credentials paired with rotating HttpOnly cookies.',
    icon: ShieldCheck,
    accentColor: '#34D399'
  }
];

export const OnboardingTrustPillars: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`space-y-2.5 select-none text-left ${className}`}>
      <div className="flex items-center justify-between pb-1">
        <span className="text-[10px] font-mono font-bold tracking-wider text-slate-400 uppercase">
          Controlled Access Protocol
        </span>
        <span className="text-[10px] font-mono text-cyan-400">
          Zero-Trust Gateway
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        {PILLARS.map((p) => {
          const Icon = p.icon;
          return (
            <div
              key={p.step}
              className="p-3 rounded-xl bg-[#050B14]/85 border border-white/[0.08] hover:border-cyan-500/30 transition-all duration-200 shadow-sm text-left"
            >
              <div className="flex items-center justify-between pb-1.5">
                <span className="text-[10px] font-mono font-bold text-slate-500">
                  {p.step}
                </span>
                <div 
                  className="w-5 h-5 rounded-md flex items-center justify-center"
                  style={{ backgroundColor: `${p.accentColor}15`, color: p.accentColor }}
                >
                  <Icon className="w-3 h-3" />
                </div>
              </div>

              <div className="text-xs font-sans font-bold text-white tracking-tight pb-0.5">
                {p.title}
              </div>
              <div className="text-[10px] font-sans text-slate-400 leading-relaxed">
                {p.description}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
