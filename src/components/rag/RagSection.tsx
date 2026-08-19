import React from 'react';
import { Badge } from '../ui/Badge';
import { RagInteractiveAssistant } from './RagInteractiveAssistant';
import { FileText, Database, BookOpen, MessageSquare, ArrowRight } from 'lucide-react';
import { useRouterStore } from '../../store/useRouterStore';

export const RagSection: React.FC = () => {
  const navigate = useRouterStore((state) => state.navigate);

  const ragSteps = [
    { icon: <FileText className="w-4 h-4" />, label: 'Hospital SOPs & Playbooks' },
    { icon: <Database className="w-4 h-4" />, label: 'Dense Vector & BM25 Index' },
    { icon: <BookOpen className="w-4 h-4" />, label: 'Relevant Context Retrieval' },
    { icon: <MessageSquare className="w-4 h-4" />, label: 'Grounded Recommendation' },
  ];

  return (
    <section id="rag" className="relative py-32 bg-section-softLavender text-slate-900 border-t border-purple-100 overflow-hidden">
      {/* Background illumination */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-purple-200/40 blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-14">
          <div className="max-w-3xl">
            <Badge variant="indigo" size="md" className="mb-4 bg-indigo-100 text-indigo-800 border-indigo-300">
              CONTEXTUAL KNOWLEDGE GROUNDING
            </Badge>

            <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.1]">
              Good decisions need context.
            </h2>

            <p className="mt-4 text-xl text-slate-600 font-normal leading-relaxed">
              Mathematical algorithms alone lack hospital nuance. IntelliCare retrieves verified clinical operating guidelines, surge protocols, and union staffing rules to explain why decisions are made.
            </p>
          </div>

          <button
            onClick={() => navigate('/platform')}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-indigo-900 text-white hover:bg-indigo-800 text-xs font-mono font-bold transition-all shadow-md cursor-pointer shrink-0"
          >
            <span>Explore RAG Knowledge</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Minimal RAG Flow Strip: Documents -> Knowledge -> Relevant Context -> Grounded Explanation */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-3 rounded-2xl bg-white border border-purple-200/80 shadow-md mb-10 text-xs font-mono">
          {ragSteps.map((s, idx) => (
            <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold shrink-0">
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
