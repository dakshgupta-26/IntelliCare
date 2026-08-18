import React from 'react';
import { useSimStore } from '../../store/useSimStore';
import { RAG_PRESETS } from '../../data/demoData';
import { Badge } from '../ui/Badge';
import { MessageSquare, BookOpen, Sparkles, FileText } from 'lucide-react';

export const RagInteractiveAssistant: React.FC = () => {
  const activeQuery = useSimStore((state) => state.activeRagQuery);
  const setActiveQuery = useSimStore((state) => state.setActiveRagQuery);

  return (
    <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-indigo-500/30 shadow-2xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-8 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="indigo" size="sm">
              HYBRID RAG RETRIEVAL (DENSE + BM25)
            </Badge>
            <span className="text-[11px] font-mono text-slate-500">
              VECTOR EMBEDDINGS + SPARSE KEYWORD
            </span>
          </div>
          <h3 className="font-display text-xl sm:text-2xl font-bold text-white">
            Contextual Explanation Assistant
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Click an operational query to inspect how IntelliCare grounds mathematical solver decisions in institutional SOPs.
          </p>
        </div>

        <span className="text-xs font-mono px-3 py-1.5 rounded-lg bg-surface-200 text-slate-400 border border-slate-700">
          Illustrative Policy Demo
        </span>
      </div>

      {/* Preset Query Selector Chips */}
      <div className="flex flex-col sm:flex-row gap-2.5 mb-8">
        {RAG_PRESETS.map((preset) => {
          const isSelected = preset.id === activeQuery.id;
          return (
            <button
              key={preset.id}
              onClick={() => setActiveQuery(preset)}
              className={`flex-1 text-left p-3.5 rounded-xl text-xs font-mono transition-all duration-200 border cursor-pointer ${
                isSelected
                  ? 'bg-indigo-950/40 border-indigo-500/60 text-white shadow-[0_0_15px_rgba(99,102,241,0.2)]'
                  : 'bg-surface-100/80 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-surface-200'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <MessageSquare className={`w-3.5 h-3.5 ${isSelected ? 'text-indigo-400' : 'text-slate-500'}`} />
                <span className="font-bold truncate">{preset.question}</span>
              </div>
              <span className="text-[10px] text-slate-500">
                {preset.sources.length} SOP Protocols Referenced
              </span>
            </button>
          );
        })}
      </div>

      {/* Query Conversation & Retrieval Detail View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: AI Explanation & Mathematical Formulation (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {/* User Prompt Box */}
          <div className="p-4 rounded-2xl bg-surface-100 border border-slate-800 flex items-start gap-3">
            <div className="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center text-slate-300 shrink-0 mt-0.5">
              <span className="text-xs font-mono font-bold">OP</span>
            </div>
            <div>
              <span className="text-[11px] font-mono text-slate-400 block mb-0.5">
                Hospital Operations Coordinator Query:
              </span>
              <p className="text-sm font-medium text-white">
                "{activeQuery.question}"
              </p>
            </div>
          </div>

          {/* AI Grounded Response Box */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-surface-100 to-indigo-950/20 border border-indigo-500/30 flex flex-col gap-4 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-mono font-bold text-indigo-300">
                  IntelliCare Grounded Response
                </span>
              </div>
              <Badge variant="indigo" size="sm">
                LLM + RAG SYNTHESIS
              </Badge>
            </div>

            <p className="text-sm text-slate-200 leading-relaxed">
              {activeQuery.answer}
            </p>

            {/* Constraint Reasoning */}
            <div className="p-3.5 rounded-xl bg-navy-950/80 border border-slate-800 text-xs font-mono">
              <span className="text-[10px] text-indigo-400 font-bold block mb-1 uppercase tracking-wider">
                Underlying Math & Constraint Formulation
              </span>
              <code className="text-slate-300 text-[11px] break-all">
                {activeQuery.reasoningSnippet}
              </code>
            </div>
          </div>
        </div>

        {/* Right Column: Grounded SOP Source Citations (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col gap-4 bg-surface-50/70 p-6 rounded-2xl border border-slate-800">
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-indigo-400" />
            <span>Retrieved SOP Citations</span>
          </span>

          <div className="flex flex-col gap-3">
            {activeQuery.sources.map((source, i) => (
              <div
                key={i}
                className="p-4 rounded-xl bg-surface-100 border border-slate-800 hover:border-indigo-500/30 transition-colors flex flex-col gap-2"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-indigo-400 shrink-0" />
                    <span className="text-xs font-bold text-white leading-tight">
                      {source.title}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
                    {Math.round(source.confidence * 100)}% Match
                  </span>
                </div>

                <p className="text-xs text-slate-400">
                  {source.section}
                </p>

                <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 pt-2 border-t border-slate-800/80">
                  <span>Method: {source.retrievalMethod}</span>
                  <span className="text-indigo-400">Verified SOP</span>
                </div>
              </div>
            ))}
          </div>

          <div className="text-[11px] font-mono text-slate-500 pt-2 border-t border-slate-800">
            * All explanations are strictly bound to verified institutional documents to eliminate hallucinations.
          </div>
        </div>
      </div>
    </div>
  );
};
