import React, { useState } from 'react';
import {
  Bot,
  Send,
  Sparkles,
  ArrowLeft,
  FileText,
  RotateCcw,
  ShieldCheck,
  ExternalLink
} from 'lucide-react';
import { useKnowledgeStore } from '../../store/useKnowledgeStore';
import { useRouterStore } from '../../store/useRouterStore';
import { DocumentCitation } from '../../types/knowledge';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';

export const KnowledgeAssistantPage: React.FC = () => {
  const messages = useKnowledgeStore((state) => state.messages);
  const askAssistant = useKnowledgeStore((state) => state.askAssistant);
  const isAskingAssistant = useKnowledgeStore((state) => state.isAskingAssistant);
  const clearConversation = useKnowledgeStore((state) => state.clearConversation);
  const navigate = useRouterStore((state) => state.navigate);

  const [inputQuestion, setInputQuestion] = useState('');
  const [selectedCitation, setSelectedCitation] = useState<DocumentCitation | null>(null);

  const handleSend = (q?: string) => {
    const targetQ = q || inputQuestion;
    if (!targetQ.trim() || isAskingAssistant) return;
    askAssistant(targetQ);
    setInputQuestion('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto">
      {/* 1. Top Header with Back Button */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <button
          onClick={() => navigate('/app/knowledge')}
          className="flex items-center gap-2 text-xs font-mono text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Knowledge Library</span>
        </button>

        <div className="flex items-center gap-2">
          <Badge variant="cyan" size="sm" dot>
            HYBRID RAG PIPELINE ACTIVE
          </Badge>
          <button
            onClick={clearConversation}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg bg-surface-200/50 hover:bg-surface-200 transition-colors"
            title="Reset Conversation"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 2. Chat Stream Box */}
      <div className="space-y-6">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${
              msg.sender === 'user' ? 'items-end' : 'items-start'
            } space-y-2`}
          >
            {/* Sender Pill */}
            <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400 px-1">
              {msg.sender === 'assistant' ? (
                <div className="flex items-center gap-1.5 text-cyan-400 font-bold">
                  <Bot className="w-3.5 h-3.5" />
                  <span>IntelliCare Decision Grounding Core</span>
                </div>
              ) : (
                <span>You • Operations Team</span>
              )}
              <span>• {msg.timestamp}</span>
            </div>

            {/* Message Bubble Card */}
            <div
              className={`p-5 rounded-3xl max-w-3xl leading-relaxed text-xs shadow-xl ${
                msg.sender === 'user'
                  ? 'bg-cyan-500/15 border border-cyan-500/40 text-cyan-100 rounded-tr-sm'
                  : 'bg-surface-100 dark:bg-[#0a1628] border border-slate-700/80 dark:border-slate-800 text-slate-200 rounded-tl-sm space-y-4'
              }`}
            >
              {/* Question Text (for User) */}
              {msg.question && (
                <p className="text-sm font-medium text-white">{msg.question}</p>
              )}

              {/* Primary Answer (for Assistant) */}
              {msg.answer && (
                <p className="text-sm text-slate-100 font-normal leading-relaxed">
                  {msg.answer}
                </p>
              )}

              {/* Transparent Reasoning Summary */}
              {msg.reasoningSummary && (
                <div className="p-3.5 rounded-2xl bg-surface-200/50 dark:bg-[#07111f] border border-slate-800 space-y-1">
                  <div className="flex items-center gap-1.5 text-cyan-400 font-mono font-bold text-[11px]">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Operational Reasoning Summary</span>
                  </div>
                  <p className="text-[11px] font-mono text-slate-300 leading-normal">
                    {msg.reasoningSummary}
                  </p>
                </div>
              )}

              {/* Grounded Document Sources / Citations */}
              {msg.sources && msg.sources.length > 0 && (
                <div className="pt-2 border-t border-slate-800/80 space-y-2">
                  <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block">
                    Grounded Hospital Policy Sources:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {msg.sources.map((src, sIdx) => (
                      <div
                        key={sIdx}
                        onClick={() => setSelectedCitation(src)}
                        className="p-2.5 rounded-xl bg-surface-200/40 hover:bg-surface-200 border border-slate-800/80 hover:border-cyan-500/40 transition-all cursor-pointer group flex items-start justify-between gap-2"
                      >
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                              {src.documentCode}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono">
                              {(src.confidenceScore * 100).toFixed(0)}% match
                            </span>
                          </div>
                          <p className="text-[11px] font-bold text-white group-hover:text-cyan-300 transition-colors truncate mt-1">
                            {src.documentTitle}
                          </p>
                          <p className="text-[10px] text-slate-400 truncate">
                            {src.section}
                          </p>
                        </div>
                        <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-cyan-400 shrink-0 mt-1" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Suggested Follow-Ups */}
              {msg.suggestedFollowUps && msg.suggestedFollowUps.length > 0 && (
                <div className="pt-2 flex flex-wrap gap-2">
                  {msg.suggestedFollowUps.map((fu, fIdx) => (
                    <button
                      key={fIdx}
                      onClick={() => handleSend(fu)}
                      className="px-3 py-1 rounded-full bg-surface-200/80 hover:bg-cyan-500/15 border border-slate-700/80 hover:border-cyan-500/40 text-[11px] font-mono text-cyan-300 transition-all text-left cursor-pointer"
                    >
                      {fu} →
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Loading Spinner / Tensor Inference Pulse */}
        {isAskingAssistant && (
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-surface-100 dark:bg-[#0a1628] border border-slate-800 text-xs font-mono text-cyan-300 animate-pulse">
            <Sparkles className="w-4 h-4 text-cyan-400 animate-spin" />
            <span>Retrieving SOP vectors from pgvector & performing BM25 rerank...</span>
          </div>
        )}
      </div>

      {/* 3. Bottom Sticky Query Input */}
      <div className="sticky bottom-4 z-20 pt-4">
        <div className="p-2 rounded-2xl bg-surface-100/95 dark:bg-[#0a1628]/95 backdrop-blur-xl border border-slate-700/80 dark:border-slate-800 shadow-2xl flex items-center gap-2">
          <input
            type="text"
            value={inputQuestion}
            onChange={(e) => setInputQuestion(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isAskingAssistant}
            placeholder="Ask an operational question (e.g. 'Why is ICU nurse staffing being increased?')..."
            className="flex-1 bg-transparent px-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none"
          />

          <Button
            variant="primary"
            size="sm"
            icon={<Send className="w-3.5 h-3.5" />}
            onClick={() => handleSend()}
            disabled={!inputQuestion.trim() || isAskingAssistant}
            className="shrink-0"
          >
            <span className="hidden sm:inline">Ask RAG Core</span>
            <span className="sm:hidden">Send</span>
          </Button>
        </div>
      </div>

      {/* Source Citation Modal */}
      {selectedCitation && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedCitation(null)}
          title={
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-cyan-400" />
              <span>{selectedCitation.documentTitle}</span>
            </div>
          }
          subtitle={`${selectedCitation.documentCode} • ${selectedCitation.section} • Retrieval: ${selectedCitation.retrievalMethod}`}
          maxWidth="lg"
          footer={
            <Button variant="secondary" size="sm" onClick={() => setSelectedCitation(null)}>
              Close
            </Button>
          }
        >
          <div className="space-y-3 text-xs font-mono">
            <div className="p-3.5 rounded-xl bg-surface-200/50 border border-slate-800 space-y-1">
              <span className="text-cyan-400 font-bold block">Matched Text Chunk:</span>
              <p className="text-slate-200 leading-relaxed italic">
                "{selectedCitation.matchedSnippet}"
              </p>
            </div>
            <div className="flex justify-between text-[11px] text-slate-400 pt-1">
              <span>Confidence Score: {(selectedCitation.confidenceScore * 100).toFixed(1)}%</span>
              <span>Vector Similarity: Cosine Dense Matrix</span>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
