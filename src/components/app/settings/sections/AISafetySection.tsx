import React, { useState } from 'react';
import { Shield, BookOpen, CheckCircle2, RefreshCw, FileText } from 'lucide-react';
import { useKnowledgeStore } from '../../../../store/useKnowledgeStore';
import { Button } from '../../../ui/Button';

interface AISafetySectionProps {
  onMarkDirty: () => void;
}

export const AISafetySection: React.FC<AISafetySectionProps> = ({ onMarkDirty }) => {
  const documents = useKnowledgeStore((state) => state.documents);
  const [requireCitations, setRequireCitations] = useState(true);
  const [showUncertainty, setShowUncertainty] = useState(true);
  const [isReindexing, setIsReindexing] = useState(false);

  const handleReindex = async () => {
    setIsReindexing(true);
    await new Promise((r) => setTimeout(r, 900));
    setIsReindexing(false);
    alert('Dense vector embeddings and BM25 index re-synchronized across 4 clinical SOPs.');
  };

  const handleToggle = (setter: React.Dispatch<React.SetStateAction<boolean>>, val: boolean) => {
    setter(val);
    onMarkDirty();
  };

  return (
    <div className="space-y-6">
      {/* AI Decision Support Guardrails Card */}
      <div className="p-6 rounded-3xl bg-[#070D1A] border border-white/[0.08] space-y-4">
        <div className="pb-3 border-b border-white/[0.06]">
          <h3 className="text-base font-display font-bold text-white flex items-center gap-2">
            <Shield className="w-5 h-5 text-purple-400" />
            <span>Clinical AI Governance & Decision-Support Guardrails</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            IntelliCare AI operates strictly as a decision-support copilot. Clinical autonomy remains with verified practitioners.
          </p>
        </div>

        <div className="space-y-3">
          {/* Mandatory Human Sign-Off */}
          <div className="p-4 rounded-2xl bg-black/40 border border-white/[0.06] flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="font-bold text-xs text-white block">
                Mandatory Clinician Sign-Off for Reallocations
              </span>
              <span className="text-[11px] text-slate-400 font-mono">
                Bed reassignments, nurse call-ins, and surgical delays require two-factor clinician approval.
              </span>
            </div>
            <div className="px-3 py-1 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold">
              Enforced Policy
            </div>
          </div>

          {/* Require SOP Citations */}
          <div className="p-4 rounded-2xl bg-black/40 border border-white/[0.06] flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="font-bold text-xs text-white block">
                Mandatory SOP Grounding & Document Citations
              </span>
              <span className="text-[11px] text-slate-400 font-mono">
                Copilot must attach exact clinical SOP codes and paragraphs to all recommended interventions.
              </span>
            </div>
            <button
              onClick={() => handleToggle(setRequireCitations, !requireCitations)}
              className={`px-3 py-1 rounded-lg text-xs font-mono border transition-colors cursor-pointer ${
                requireCitations
                  ? 'bg-cyan-500/15 border-cyan-500/30 text-cyan-300 font-bold'
                  : 'bg-white/[0.05] border-white/[0.08] text-slate-500'
              }`}
            >
              {requireCitations ? 'Active' : 'Disabled'}
            </button>
          </div>

          {/* Confidence Score Display */}
          <div className="p-4 rounded-2xl bg-black/40 border border-white/[0.06] flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="font-bold text-xs text-white block">
                Empirical Confidence Score Display
              </span>
              <span className="text-[11px] text-slate-400 font-mono">
                Render statistical probability (e.g. 94% Confidence) alongside solver proposals.
              </span>
            </div>
            <button
              onClick={() => handleToggle(setShowUncertainty, !showUncertainty)}
              className={`px-3 py-1 rounded-lg text-xs font-mono border transition-colors cursor-pointer ${
                showUncertainty
                  ? 'bg-purple-500/15 border-purple-500/30 text-purple-300 font-bold'
                  : 'bg-white/[0.05] border-white/[0.08] text-slate-500'
              }`}
            >
              {showUncertainty ? 'Visible' : 'Hidden'}
            </button>
          </div>
        </div>
      </div>

      {/* RAG Knowledge Base & Clinical SOP Index */}
      <div className="p-6 rounded-3xl bg-[#070D1A] border border-white/[0.08] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/[0.06]">
          <div>
            <h3 className="text-base font-display font-bold text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-cyan-400" />
              <span>Grounding Knowledge Sources & Clinical SOPs</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Institutional clinical documents indexed into vector space for retrieval-augmented reasoning.
            </p>
          </div>

          <Button
            variant="secondary"
            size="sm"
            disabled={isReindexing}
            onClick={handleReindex}
            icon={<RefreshCw className={`w-3.5 h-3.5 ${isReindexing ? 'animate-spin' : ''}`} />}
          >
            {isReindexing ? 'Re-indexing Tensors...' : 'Re-index SOP Corpus'}
          </Button>
        </div>

        <div className="space-y-2.5">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="p-3.5 rounded-2xl bg-black/40 border border-white/[0.06] hover:border-white/[0.12] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shrink-0 mt-0.5">
                  <FileText className="w-4 h-4 text-cyan-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-display font-bold text-xs sm:text-sm text-white">{doc.title}</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-white/[0.08] text-cyan-300">
                      {doc.code}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                    Category: <span className="text-slate-200">{doc.category}</span> • Version: {doc.version} • Updated: {doc.lastUpdated}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0 self-end sm:self-center text-xs font-mono">
                <span className="text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Indexed</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
