import React from 'react';
import { Shield, Activity, Database, Sparkles, ChevronRight } from 'lucide-react';

export interface ClinicalPersona {
  id: string;
  role: string;
  name: string;
  title: string;
  email: string;
  icon: React.ComponentType<{ className?: string }>;
  accentColor: string;
}

const PERSONAS: ClinicalPersona[] = [
  {
    id: 'admin',
    role: 'Hospital Admin',
    name: 'Dr. Sarah Chen, MD',
    title: 'Chief Medical Operations Officer',
    email: 'sarah.chen@intellicare.health',
    icon: Shield,
    accentColor: '#22D3EE'
  },
  {
    id: 'icu',
    role: 'ICU Director',
    name: 'Dr. Marcus Vance, DO',
    title: 'Intensive Care Unit Lead',
    email: 'marcus.vance@intellicare.health',
    icon: Activity,
    accentColor: '#0EA5E9'
  },
  {
    id: 'architect',
    role: 'Systems Architect',
    name: 'Alex Ross, MS',
    title: 'Health Informatics & AI Core',
    email: 'alex.ross@intellicare.health',
    icon: Database,
    accentColor: '#34D399'
  }
];

interface PersonaSelectorProps {
  onSelect: (email: string) => void;
  disabled?: boolean;
}

export const PersonaSelector: React.FC<PersonaSelectorProps> = ({ onSelect, disabled = false }) => {
  return (
    <div className="space-y-2.5 pt-2 text-left select-none">
      <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-slate-400">
        <div className="flex items-center gap-1.5 font-bold">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>One-Click Clinical Personas</span>
        </div>
        <span className="text-[9px] text-cyan-400/80 font-normal px-1.5 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20">
          Demo Access
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        {PERSONAS.map((p) => {
          const Icon = p.icon;
          return (
            <button
              key={p.id}
              type="button"
              disabled={disabled}
              onClick={() => onSelect(p.email)}
              className="group relative p-2.5 rounded-xl bg-[#030712]/80 hover:bg-[#071328] border border-white/[0.08] hover:border-cyan-500/40 text-left transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-[0_4px_16px_rgba(34,211,238,0.12)] hover:-translate-y-0.5 active:translate-y-0"
            >
              <div className="flex items-center justify-between pb-1">
                <div 
                  className="w-5 h-5 rounded-md flex items-center justify-center transition-colors"
                  style={{ backgroundColor: `${p.accentColor}18`, color: p.accentColor }}
                >
                  <Icon className="w-3 h-3" />
                </div>
                <ChevronRight className="w-3 h-3 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all" />
              </div>

              <div className="text-xs font-sans font-bold text-white group-hover:text-cyan-300 transition-colors truncate">
                {p.role}
              </div>
              <div className="text-[10px] font-sans text-slate-400 truncate">
                {p.name}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
