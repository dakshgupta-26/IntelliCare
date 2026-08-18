import React from 'react';
import { Badge } from '../ui/Badge';
import { RagInteractiveAssistant } from './RagInteractiveAssistant';

export const RagSection: React.FC = () => {
  return (
    <section id="rag" className="relative py-28 bg-navy-900/60 border-t border-b border-slate-800/80 overflow-hidden">
      {/* Background illumination */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-indigo-600/5 blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mb-14">
          <Badge variant="indigo" size="md" className="mb-4">
            CONTEXTUAL KNOWLEDGE GROUNDING
          </Badge>

          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight">
            Decisions need context.
          </h2>

          <p className="mt-4 text-base sm:text-lg text-slate-400 leading-relaxed">
            IntelliCare retrieves relevant hospital policies, standard operating procedures (SOPs), and clinical escalation playbooks to contextualize mathematical recommendations.
          </p>
        </div>

        {/* Technical RAG Pipeline Diagram */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 p-3 rounded-2xl bg-surface-100/70 border border-slate-800 backdrop-blur-md mb-12 text-center text-xs font-mono">
          <div className="p-2.5 rounded-xl bg-surface-200/40 border border-slate-800">
            <span className="text-slate-500 block mb-1">Step 1</span>
            <span className="text-white font-bold">Hospital Docs</span>
          </div>
          <div className="p-2.5 rounded-xl bg-surface-200/40 border border-slate-800">
            <span className="text-slate-500 block mb-1">Step 2</span>
            <span className="text-white font-bold">PDF Parsing</span>
          </div>
          <div className="p-2.5 rounded-xl bg-surface-200/40 border border-slate-800">
            <span className="text-slate-500 block mb-1">Step 3</span>
            <span className="text-white font-bold">Semantic Chunks</span>
          </div>
          <div className="p-2.5 rounded-xl bg-surface-200/40 border border-slate-800">
            <span className="text-slate-500 block mb-1">Step 4</span>
            <span className="text-white font-bold">Vector Embed</span>
          </div>
          <div className="p-2.5 rounded-xl bg-surface-200/40 border border-slate-800">
            <span className="text-slate-500 block mb-1">Step 5</span>
            <span className="text-white font-bold">Dense Search</span>
          </div>
          <div className="p-2.5 rounded-xl bg-surface-200/40 border border-slate-800">
            <span className="text-slate-500 block mb-1">Step 6</span>
            <span className="text-white font-bold">BM25 Sparse</span>
          </div>
          <div className="p-2.5 rounded-xl bg-surface-200/40 border border-slate-800">
            <span className="text-slate-500 block mb-1">Step 7</span>
            <span className="text-indigo-300 font-bold">Hybrid Rerank</span>
          </div>
          <div className="p-2.5 rounded-xl bg-indigo-950/40 border border-indigo-500/40 text-indigo-300">
            <span className="text-indigo-400 block mb-1">Step 8</span>
            <span className="font-bold">LLM Justify</span>
          </div>
        </div>

        {/* Interactive RAG Assistant Component */}
        <RagInteractiveAssistant />
      </div>
    </section>
  );
};
