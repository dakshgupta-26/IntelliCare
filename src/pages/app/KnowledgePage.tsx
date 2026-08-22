import React, { useState } from 'react';
import {
  Search,
  Sparkles,
  ArrowRight,
  FileText,
  Bot
} from 'lucide-react';
import { useKnowledgeStore } from '../../store/useKnowledgeStore';
import { useRouterStore } from '../../store/useRouterStore';
import { DocumentCategory, OperationalDocument } from '../../types/knowledge';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';

export const KnowledgePage: React.FC = () => {
  const selectedCategory = useKnowledgeStore((state) => state.selectedCategory);
  const setSelectedCategory = useKnowledgeStore((state) => state.setSelectedCategory);
  const searchQuery = useKnowledgeStore((state) => state.searchQuery);
  const setSearchQuery = useKnowledgeStore((state) => state.setSearchQuery);
  const getFilteredDocuments = useKnowledgeStore((state) => state.getFilteredDocuments);
  const navigate = useRouterStore((state) => state.navigate);

  const [inspectingDoc, setInspectingDoc] = useState<OperationalDocument | null>(null);

  const filteredDocs = getFilteredDocuments();

  const categories: { id: DocumentCategory | 'ALL'; label: string }[] = [
    { id: 'ALL', label: 'All Documents' },
    { id: 'SOP_STAFFING', label: 'Staffing SOPs' },
    { id: 'ESCALATION_PROTOCOL', label: 'Escalation Protocols' },
    { id: 'BED_ALLOCATION', label: 'Bed & Surge Allocation' }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 1. Header & AI Assistant Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider font-bold">
              Operational Governance & SOP Grounding
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-xs font-mono text-slate-400">
              Hybrid Dense Vector + BM25 Retrieval
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-white tracking-tight">
            Operational Knowledge Core
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Approved hospital SOPs, staffing guidelines, escalation protocols, and clinical governance documents.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Button
            variant="primary"
            size="sm"
            icon={<Bot className="w-4 h-4 text-cyan-300" />}
            onClick={() => navigate('/app/knowledge/assistant')}
          >
            Launch AI Knowledge Assistant →
          </Button>
        </div>
      </div>

      {/* 2. Interactive AI Assistant Quick Access Banner */}
      <div
        onClick={() => navigate('/app/knowledge/assistant')}
        className="p-6 rounded-3xl bg-gradient-to-r from-cyan-950/40 via-surface-100 to-indigo-950/30 dark:from-[#081b2e] dark:to-[#0f1d38] border border-cyan-500/30 hover:border-cyan-500/60 shadow-xl transition-all cursor-pointer group flex flex-col sm:flex-row sm:items-center justify-between gap-6"
      >
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0 group-hover:scale-105 transition-transform">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-display font-bold text-white group-hover:text-cyan-300 transition-colors">
                AI Knowledge Assistant
              </h3>
              <Badge variant="cyan" size="sm">RAG CORE</Badge>
            </div>
            <p className="text-xs text-slate-300 mt-1 max-w-xl leading-relaxed">
              Ask questions directly about nurse-to-patient mandates, ED surge level triggers, or MILP solver allocation logic with cited evidence.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 font-bold group-hover:translate-x-1 transition-transform shrink-0">
          <span>Open Interactive Assistant</span>
          <ArrowRight className="w-4 h-4" />
        </div>
      </div>

      {/* 3. Search & Category Filters */}
      <div className="p-4 rounded-2xl bg-surface-100 dark:bg-[#0a1628] border border-slate-700/80 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search operational SOPs, protocols, or policies..."
            className="w-full bg-surface-200/60 dark:bg-[#07111f] border border-slate-700/80 dark:border-slate-800 rounded-xl py-2 pl-10 pr-4 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-cyan/40"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto custom-scrollbar">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === c.id
                  ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40'
                  : 'text-slate-400 hover:text-white bg-surface-200/40 border border-transparent'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Document Library Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDocs.map((doc) => (
          <div
            key={doc.id}
            onClick={() => setInspectingDoc(doc)}
            className="p-5 rounded-2xl bg-surface-100 dark:bg-[#0a1628] border border-slate-700/80 dark:border-slate-800 hover:border-cyan-500/40 transition-all cursor-pointer flex flex-col justify-between space-y-4 group"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="text-[10px] font-mono text-cyan-400 font-bold px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20">
                  {doc.code}
                </span>
                <Badge variant="emerald" size="sm">{doc.status}</Badge>
              </div>

              <h4 className="text-sm font-display font-bold text-white group-hover:text-cyan-300 transition-colors leading-snug">
                {doc.title}
              </h4>

              <p className="text-xs text-slate-400 line-clamp-3 mt-2 leading-relaxed">
                {doc.summary}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1 mt-3">
                {doc.tags.map((t) => (
                  <span key={t} className="text-[9px] font-mono text-slate-400 bg-surface-200/80 px-1.5 py-0.5 rounded">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
              <span>v{doc.version} • {doc.departmentName}</span>
              <span className="text-cyan-400 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                Read SOP <ArrowRight className="w-3 h-3" />
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Document Inspection Modal */}
      {inspectingDoc && (
        <Modal
          isOpen={true}
          onClose={() => setInspectingDoc(null)}
          title={
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-cyan-400" />
              <span>{inspectingDoc.title}</span>
            </div>
          }
          subtitle={`${inspectingDoc.code} • Version ${inspectingDoc.version} • Last updated ${inspectingDoc.lastUpdated} by ${inspectingDoc.uploadedBy}`}
          maxWidth="2xl"
          footer={
            <Button variant="secondary" size="sm" onClick={() => setInspectingDoc(null)}>
              Close SOP Viewer
            </Button>
          }
        >
          <div className="space-y-4 text-xs font-mono">
            <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-300">
              <span className="font-bold block">Official Hospital Protocol Summary:</span>
              <p className="text-slate-300 mt-1">{inspectingDoc.summary}</p>
            </div>

            <div className="p-4 rounded-xl bg-surface-200/50 dark:bg-[#07111f] border border-slate-800 space-y-2 whitespace-pre-wrap leading-relaxed text-slate-200">
              {inspectingDoc.fullText}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
