import React, { useState } from 'react';
import {
  Sparkles,
  CheckCircle2,
  Sliders,
  XCircle,
  Clock,
  ChevronRight,
  ShieldCheck,
  Check
} from 'lucide-react';
import { useRecommendationStore } from '../../../store/useRecommendationStore';
import { useRouterStore } from '../../../store/useRouterStore';
import { Badge } from '../../ui/Badge';

interface AIOperationalBriefProps {
  onRunScenario?: () => void;
}

export const AIOperationalBrief: React.FC<AIOperationalBriefProps> = ({ onRunScenario }) => {
  const recommendations = useRecommendationStore((state) => state.recommendations);
  const openReviewModal = useRecommendationStore((state) => state.openReviewModal);
  const approveRecommendation = useRecommendationStore((state) => state.approveRecommendation);
  const rejectRecommendation = useRecommendationStore((state) => state.rejectRecommendation);
  const navigate = useRouterStore((state) => state.navigate);

  const [approvedId, setApprovedId] = useState<string | null>(null);

  // Find high priority pending recommendation, fallback to first
  const pendingRec = recommendations.find((r) => r.status === 'PENDING') || recommendations[0];

  const handleQuickApprove = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!pendingRec) return;
    approveRecommendation(pendingRec.id, 'Approved via Command Center 1-click authorization.');
    setApprovedId(pendingRec.id);
    setTimeout(() => setApprovedId(null), 2500);
  };

  const handleQuickReject = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!pendingRec) return;
    rejectRecommendation(pendingRec.id, 'Deferred by operations supervisor: reassessing at shift change.');
  };

  if (!pendingRec) {
    return (
      <div className="p-4 sm:p-5 rounded-2xl bg-[#07111f] border border-slate-800/90 shadow-lg flex flex-col justify-between h-full text-slate-400 text-xs font-mono">
        <div>No pending directives. All operational recommendations are up to date.</div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-[#07111f] via-[#091526] to-indigo-950/25 border border-cyan-500/30 shadow-xl flex flex-col justify-between h-full relative overflow-hidden">
      <div>
        {/* Header */}
        <div className="flex items-start justify-between gap-2 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
              <Sparkles className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-wider">
                  IntelliCare AI Operational Brief
                </span>
                <span className="text-slate-600">•</span>
                <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-400">
                  CONFIDENCE: 94.2%
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-display font-extrabold text-white tracking-tight">
                High Priority Operational Signal
              </h2>
            </div>
          </div>

          <Badge variant="amber" size="sm" dot>
            ACTION REQUIRED
          </Badge>
        </div>

        {/* Intelligence Signal Content */}
        <div className="mt-3.5 space-y-3 text-xs">
          {/* 1. Current Signal */}
          <div className="p-3 rounded-xl bg-[#050c18] border border-slate-800/80">
            <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block mb-1">
              Current Signal:
            </span>
            <p className="text-slate-200 leading-relaxed">
              Emergency intake volume trending upward concurrently with ICU occupancy approaching configured capacity thresholds.
            </p>
          </div>

          {/* 2. Forecast & Projected Impact */}
          <div className="p-3 rounded-xl bg-cyan-950/20 border border-cyan-500/25">
            <div className="flex items-center justify-between gap-1 mb-1">
              <span className="text-[10px] font-mono uppercase text-cyan-300 font-bold">
                Forecast (+4h Horizon):
              </span>
              <span className="text-[10px] font-mono font-bold text-cyan-400">
                +18.4% DEMAND SURGE
              </span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              Estimated 146 pts/hr emergency arrival peak at 20:00. Projected ICU utilization will reach <strong className="text-rose-400 font-mono">94.8%</strong> if step-downs are not initiated.
            </p>
          </div>

          {/* 3. Recommendation */}
          <div className="p-3 rounded-xl bg-[#08162b] border border-slate-700/80">
            <div className="flex items-center gap-2 mb-1 text-white font-bold">
              <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span>Recommended Operational Directive:</span>
            </div>
            <p className="text-slate-200 leading-relaxed font-sans font-medium">
              {pendingRec.recommendedAction}
            </p>
            <div className="mt-2 text-[10px] font-mono text-slate-400">
              <strong>Reason:</strong> Predicted arrival volume is approaching acute care ceiling. Complies with <span className="text-cyan-300 font-bold">SOP-ICU-2024.3</span>.
            </div>
          </div>
        </div>
      </div>

      {/* Human-in-the-Loop Governance Actions */}
      <div className="mt-4 pt-3 border-t border-slate-800">
        <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-2">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Human-in-the-Loop Control Active</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3 text-amber-400" />
            <span>Expires in 42 min</span>
          </div>
        </div>

        {approvedId === pendingRec.id ? (
          <div className="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-mono flex items-center justify-center gap-2">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>Directive Approved & Dispatched to Charge Nurse</span>
          </div>
        ) : (
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-1.5">
              {/* Simulate Action */}
              <button
                onClick={() => {
                  if (onRunScenario) onRunScenario();
                  else navigate('/app/scenarios');
                }}
                className="px-2.5 py-1.5 rounded-xl bg-purple-500/15 hover:bg-purple-500/25 border border-purple-500/30 text-purple-300 text-xs font-mono transition-colors flex items-center gap-1.5 cursor-pointer"
                title="Run What-If Sandbox simulation on this recommendation"
              >
                <Sliders className="w-3.5 h-3.5 text-purple-400" />
                <span>Simulate</span>
              </button>

              {/* Reject Action */}
              <button
                onClick={handleQuickReject}
                className="px-2.5 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-mono transition-colors flex items-center gap-1 cursor-pointer"
                title="Reject or defer directive"
              >
                <XCircle className="w-3.5 h-3.5 text-rose-400" />
                <span>Reject</span>
              </button>
            </div>

            <div className="flex items-center gap-1.5">
              {/* Review in Modal */}
              <button
                onClick={() => openReviewModal(pendingRec)}
                className="px-3 py-1.5 rounded-xl bg-surface-200/80 hover:bg-surface-200 text-slate-200 text-xs font-mono border border-slate-700 transition-colors cursor-pointer"
              >
                Detailed Review
              </button>

              {/* Quick Approve */}
              <button
                onClick={handleQuickApprove}
                className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-400 hover:to-cyan-500 text-slate-950 text-xs font-bold font-sans flex items-center gap-1 shadow-[0_0_12px_rgba(22,199,243,0.35)] transition-all cursor-pointer"
              >
                <span>Approve</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
