import React from 'react';
import { RagInteractiveAssistant } from './RagInteractiveAssistant';
import { FileText, Database, BookOpen, MessageSquare, ArrowRight } from 'lucide-react';
import { useRouterStore } from '../../store/useRouterStore';

export const RagSection: React.FC = () => {
  const navigate = useRouterStore((state) => state.navigate);

  const ragSteps = [
    { icon: <FileText className="w-4 h-4" />, label: 'Hospital Policies & SOPs' },
    { icon: <Database className="w-4 h-4" />, label: 'Dense Vector & BM25 Index' },
    { icon: <BookOpen className="w-4 h-4" />, label: 'Relevant Context Retrieval' },
    { icon: <MessageSquare className="w-4 h-4" />, label: 'Context-Aware Explanation' },
  ];

  return (
    <section id="rag" className="relative py-28 sm:py-36 bg-[#F8FAFC] text-slate-900 border-t border-slate-200 overflow-hidden">
      {/* Precision architectural light grid */}
      <div className="absolute inset-0 bg-grid-pattern-light opacity-50 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-14">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 border border-indigo-200 mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
              <span className="text-[11px] font-mono font-bold tracking-wider text-indigo-900 uppercase">
                CONTEXTUAL OPERATIONAL INTELLIGENCE
              </span>
              <span className="text-indigo-400">|</span>
              <span className="text-[10px] font-mono text-indigo-700">HYBRID RAG</span>
            </div>

            <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.08]">
              Good decisions need context.
            </h2>

            <p className="mt-4 text-lg sm:text-xl text-slate-600 font-normal leading-relaxed">
              Mathematical algorithms alone lack hospital nuance. IntelliCare retrieves verified clinical operating guidelines, surge protocols, department procedures, and shift rules to explain recommendations.
            </p>
          </div>

          <button
            onClick={() => navigate('/platform')}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-mono font-bold transition-all shadow-md cursor-pointer shrink-0"
          >
            <span>Explore Knowledge Architecture</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Minimal RAG Flow Strip: Documents -> Knowledge -> Relevant Context -> Grounded Explanation */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-3 rounded-2xl bg-white border border-slate-200 shadow-sm mb-10 text-xs font-mono">
          {ragSteps.map((s, idx) => (
            <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold shrink-0">
                {s.icon}
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block uppercase font-bold">Step 0{idx + 1}</span>
                <span className="text-slate-800 font-bold leading-tight block">{s.label}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Interactive Grounded Assistant Visualizer */}
        <RagInteractiveAssistant />
      </div>
    </section>
  );
};

