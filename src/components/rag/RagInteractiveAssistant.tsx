import React from 'react';
import { useSimStore } from '../../store/useSimStore';
import { RAG_PRESETS } from '../../data/demoData';
import { MessageSquare, BookOpen, Sparkles, FileText, CheckCircle2 } from 'lucide-react';

export const RagInteractiveAssistant: React.FC = () => {
  const activeQuery = useSimStore((state) => state.activeRagQuery);
  const setActiveQuery = useSimStore((state) => state.setActiveRagQuery);

  return (
    <div className="bg-white p-6 sm:p-10 rounded-3xl border border-indigo-200/80 shadow-2xl text-slate-900">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-8 border-b border-indigo-100">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-700 bg-indigo-100 px-3 py-1 rounded-full">
              GROUNDED DOCUMENT INTELLIGENCE
            </span>
            <span className="text-[11px] font-mono text-slate-500">
              DENSE VECTOR (PGVECTOR) + BM25
            </span>
          </div>
          <h3 className="font-display text-xl sm:text-2xl font-bold text-slate-900 mt-2">
            Contextual Decision Explanation
          </h3>
          <p className="text-xs text-slate-600 mt-1">
            Select a coordinator query to see how IntelliCare justifies mathematical allocations against institutional clinical SOPs.
          </p>
        </div>

        <span className="text-xs font-mono px-3 py-1.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200 shrink-0">
          Policy Audit Verifier
        </span>
      </div>

      {/* Preset Query Chips */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        {RAG_PRESETS.map((preset) => {
          const isSelected = preset.id === activeQuery.id;
          return (
            <button
              key={preset.id}
              onClick={() => setActiveQuery(preset)}
              className={`flex-1 text-left p-4 rounded-2xl text-xs font-mono transition-all duration-200 border cursor-pointer ${
                isSelected
                  ? 'bg-indigo-50 border-indigo-400 text-slate-900 shadow-md ring-1 ring-indigo-400'
                  : 'bg-slate-50/80 border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-2 mb-1.5">
                <MessageSquare className={`w-4 h-4 ${isSelected ? 'text-indigo-600' : 'text-slate-400'}`} />
                <span className="font-bold truncate text-slate-900">{preset.question}</span>
              </div>
              <span className="text-[11px] text-slate-500 font-sans">
                {preset.sources.length} Clinical Protocols Grounded
              </span>
            </button>
          );
        })}
      </div>

      {/* Query Detail & Grounding Citations */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: AI Grounded Explanation (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col gap-5">
          {/* User Prompt Box */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-mono text-xs font-bold shrink-0 mt-0.5">
              DIR
            </div>
            <div>
              <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wider block mb-0.5">
                Clinical Operations Coordinator Query:
              </span>
              <p className="text-sm font-bold text-slate-900">
                "{activeQuery.question}"
              </p>
            </div>
          </div>

          {/* AI Grounded Response */}
          <div className="p-6 rounded-2xl bg-indigo-50/80 border border-indigo-200 flex flex-col gap-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-mono font-bold text-indigo-900 uppercase tracking-wider">
                  IntelliCare Grounded Synthesis
                </span>
              </div>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-indigo-200 text-indigo-800">
                VERIFIED AUDIT
              </span>
            </div>

            <p className="text-sm text-slate-800 leading-relaxed font-normal">
              {activeQuery.answer}
            </p>

            {/* Constraint Math Reference */}
            <div className="p-3.5 rounded-xl bg-white border border-indigo-200/80 text-xs font-mono">
              <span className="text-[10px] text-indigo-700 font-bold block mb-1 uppercase tracking-wider">
                Formal Optimization Constraint Formula
              </span>
              <code className="text-slate-700 text-[11px] break-all">
                {activeQuery.reasoningSnippet}
              </code>
            </div>
          </div>
        </div>

        {/* Right Column: Grounded SOP Source Citations (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col gap-4 bg-slate-50 p-6 rounded-2xl border border-slate-200">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-indigo-600" />
            <span>Retrieved Institutional SOPs</span>
          </span>

          <div className="flex flex-col gap-3">
            {activeQuery.sources.map((source, i) => (
              <div
                key={i}
                className="p-4 rounded-xl bg-white border border-slate-200 hover:border-indigo-300 transition-colors flex flex-col gap-1.5 shadow-sm"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-indigo-600 shrink-0" />
                    <span className="text-xs font-bold text-slate-900 leading-tight font-display">
                      {source.title}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 shrink-0">
                    {Math.round(source.confidence * 100)}%
                  </span>
                </div>

                <p className="text-xs text-slate-600">
                  {source.section}
                </p>

                <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 pt-2 border-t border-slate-100">
                  <span>Method: {source.retrievalMethod}</span>
                  <span className="text-indigo-600 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    Verified SOP
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="text-[11px] font-mono text-slate-500 pt-2 border-t border-slate-200">
            * All explanations are strictly bound to verified institutional guidelines to eliminate hallucinations.
          </div>
        </div>
      </div>
    </div>
  );
};
