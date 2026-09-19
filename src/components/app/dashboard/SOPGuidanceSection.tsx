import React from 'react';
import {
  BookOpen,
  Sparkles,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { useCopilotStore } from '../../../store/useCopilotStore';
import { useRouterStore } from '../../../store/useRouterStore';
import { Badge } from '../../ui/Badge';

export const SOPGuidanceSection: React.FC = () => {
  const openCopilot = useCopilotStore((state) => state.setOpen);
  const sendMessage = useCopilotStore((state) => state.sendMessage);
  const navigate = useRouterStore((state) => state.navigate);

  const handleAskCopilot = (question: string) => {
    openCopilot(true);
    sendMessage(question);
  };

  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-[#07111f] border border-slate-800/90 shadow-lg flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-wider">
                  Operational SOP Guidance
                </span>
                <span className="text-slate-700">•</span>
                <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-400">
                  DEMO SOP
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-display font-bold text-white tracking-tight">
                Grounded Clinical Protocols
              </h2>
            </div>
          </div>

          <button
            onClick={() => navigate('/app/knowledge')}
            className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
          >
            <span>SOP Knowledge Base</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* SOP Card */}
        <div className="my-3.5 p-3.5 rounded-xl bg-[#0a1628] border border-cyan-500/30">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div>
              <div className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider">
                Relevant Active Standard Operating Procedure
              </div>
              <h4 className="text-sm font-bold text-white font-display mt-0.5">
                ICU Surge Escalation Protocol (SOP-ICU-2024.3)
              </h4>
            </div>
            <Badge variant="amber" size="sm">
              MANDATORY
            </Badge>
          </div>

          <div className="text-xs text-slate-300 leading-relaxed space-y-1.5 font-sans">
            <p>
              <strong className="text-white font-mono">Governing Authority:</strong> Hospital Operations Manual &bull; Section 4.12 Critical Care Governance.
            </p>
            <p>
              <strong className="text-white font-mono">Mandate:</strong> Escalation review is required whenever configured ICU occupancy exceeds 90% for &gt;2 consecutive hours, or available isolation bays fall below 4 beds.
            </p>
            <p className="text-cyan-300 font-mono text-[11px]">
              &rarr; Immediate Step-Down assessment required for stable patients (NEWS2 &le; 2).
            </p>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2">
        <button
          onClick={() => navigate('/app/knowledge')}
          className="px-3 py-1.5 rounded-xl bg-surface-200 hover:bg-surface-300 text-slate-200 text-xs font-mono border border-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          <span>View Source SOP</span>
        </button>

        <button
          onClick={() => handleAskCopilot('Explain the ICU surge escalation protocol (SOP-ICU-2024.3) and required step-down criteria.')}
          className="px-3.5 py-1.5 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/40 text-cyan-300 text-xs font-mono transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Ask Copilot About Protocol</span>
        </button>
      </div>
    </div>
  );
};
