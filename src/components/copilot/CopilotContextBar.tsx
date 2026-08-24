import React, { useState } from 'react';
import { MapPin, Building2, Stethoscope, ChevronDown, Check } from 'lucide-react';
import { useCopilotStore } from '../../store/useCopilotStore';

export const CopilotContextBar: React.FC = () => {
  const [activeDropdown, setActiveDropdown] = useState<'DEPT' | 'RESOURCE' | null>(null);
  const contextScope = useCopilotStore((state) => state.contextScope);
  const setContextScope = useCopilotStore((state) => state.setContextScope);

  const departments = [
    'Emergency & ICU',
    'Intensive Care Unit (CCU)',
    'Emergency & Trauma (ED)',
    'Inpatient General Wards',
    'Surgical & Operating Theaters'
  ];

  const resources = [
    'Beds & Nursing Staff',
    'Mechanical Ventilators',
    'CCRN Floater Pool',
    'Operating Theaters',
    'Pharmaceutical Buffers'
  ];

  return (
    <div className="relative px-3 py-1.5 bg-midnight-900/90 border-b border-white/5 flex items-center gap-1.5 overflow-x-auto custom-scrollbar text-[11px] font-mono select-none z-10">
      {/* Current Page Scope */}
      <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-surface-100/90 border border-slate-700/60 text-slate-300 shrink-0">
        <MapPin className="w-3 h-3 text-brand-cyan" />
        <span className="text-slate-400">Page:</span>
        <span className="text-white font-semibold">{contextScope.pageTitle || 'Platform'}</span>
      </div>

      {/* Department Scope Dropdown Pill */}
      <div className="relative shrink-0">
        <button
          onClick={() => setActiveDropdown(activeDropdown === 'DEPT' ? null : 'DEPT')}
          className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-surface-100/90 border border-slate-700/60 hover:border-cyan-500/40 text-slate-300 hover:text-white transition-colors"
        >
          <Building2 className="w-3 h-3 text-teal-400" />
          <span className="text-slate-400">Dept:</span>
          <span className="text-teal-300 font-semibold">{contextScope.department}</span>
          <ChevronDown className="w-2.5 h-2.5 text-slate-400 ml-0.5" />
        </button>

        {activeDropdown === 'DEPT' && (
          <div className="absolute left-0 top-full mt-1 w-52 rounded-xl bg-midnight-950/95 border border-slate-800 shadow-[0_10px_30px_rgba(0,0,0,0.7)] backdrop-blur-2xl p-1 text-xs z-50">
            {departments.map((dept) => (
              <button
                key={dept}
                onClick={() => {
                  setContextScope({ department: dept });
                  setActiveDropdown(null);
                }}
                className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg hover:bg-teal-500/10 hover:text-teal-300 text-left text-slate-300 transition-colors"
              >
                <span>{dept}</span>
                {contextScope.department === dept && <Check className="w-3.5 h-3.5 text-teal-400" />}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Resource Scope Dropdown Pill */}
      <div className="relative shrink-0">
        <button
          onClick={() => setActiveDropdown(activeDropdown === 'RESOURCE' ? null : 'RESOURCE')}
          className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-surface-100/90 border border-slate-700/60 hover:border-purple-500/40 text-slate-300 hover:text-white transition-colors"
        >
          <Stethoscope className="w-3 h-3 text-purple-400" />
          <span className="text-slate-400">Focus:</span>
          <span className="text-purple-300 font-semibold">{contextScope.resource}</span>
          <ChevronDown className="w-2.5 h-2.5 text-slate-400 ml-0.5" />
        </button>

        {activeDropdown === 'RESOURCE' && (
          <div className="absolute left-0 top-full mt-1 w-52 rounded-xl bg-midnight-950/95 border border-slate-800 shadow-[0_10px_30px_rgba(0,0,0,0.7)] backdrop-blur-2xl p-1 text-xs z-50">
            {resources.map((res) => (
              <button
                key={res}
                onClick={() => {
                  setContextScope({ resource: res });
                  setActiveDropdown(null);
                }}
                className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg hover:bg-purple-500/10 hover:text-purple-300 text-left text-slate-300 transition-colors"
              >
                <span>{res}</span>
                {contextScope.resource === res && <Check className="w-3.5 h-3.5 text-purple-400" />}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
