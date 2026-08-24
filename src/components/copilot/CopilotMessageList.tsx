import React, { useRef, useEffect } from 'react';
import { Sparkles, Activity, Cpu, BookOpen, Layers, Sliders, TrendingUp, Compass } from 'lucide-react';
import { CopilotMessageItem } from './CopilotMessageItem';
import { useCopilotStore } from '../../store/useCopilotStore';

export const CopilotMessageList: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const activeThreadId = useCopilotStore((state) => state.activeThreadId);
  const threads = useCopilotStore((state) => state.threads);
  const isStreaming = useCopilotStore((state) => state.isStreaming);
  const activeThinkingStage = useCopilotStore((state) => state.activeThinkingStage);
  const sendMessage = useCopilotStore((state) => state.sendMessage);


  const currentThread = threads.find((t) => t.id === activeThreadId) || threads[0];
  const messages = currentThread ? currentThread.messages : [];
  const isFirstVisit = messages.length <= 1;

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isStreaming, activeThinkingStage]);

  const quickPromptChips = [
    { label: 'Explain IntelliCare', icon: Sparkles, prompt: 'Provide a comprehensive overview of the IntelliCare hybrid AI and operations research platform.' },
    { label: 'How Forecasting Works', icon: TrendingUp, prompt: 'How does time-series demand forecasting work in IntelliCare using LSTM vs XGBoost?' },
    { label: 'Explain MILP Optimization', icon: Cpu, prompt: 'Explain the Mixed-Integer Linear Programming (MILP) mathematical formulation and solver.' },
    { label: 'Show Architecture', icon: Layers, prompt: 'Show the complete end-to-end microservice architecture and data pipeline.' },
    { label: 'Query SOPs (RAG)', icon: BookOpen, prompt: 'What are the current emergency overflow escalation rules and ICU staffing ratios under hospital SOPs?' },
    { label: 'What-If Simulation', icon: Sliders, prompt: 'Run a what-if mass casualty surge simulation and explain the resource reallocation response.' },
    { label: 'Take a Guided Tour', icon: Compass, prompt: 'Give me a complete guided tour of the IntelliCare platform.' }
  ];

  const thinkingLabels = {
    TELEMETRY: 'Analyzing real-time hospital telemetry & bed occupancy...',
    RAG_RETRIEVAL: 'Querying institutional SOP vector knowledge base...',
    OPTIMIZATION: 'Running Google OR-Tools MILP constraint formulation...',
    SYNTHESIS: 'Synthesizing clinical operations response...'
  };

  return (
    <div
      ref={scrollRef}
      className="flex-1 overflow-y-auto custom-scrollbar px-4 py-3 space-y-2 bg-gradient-to-b from-midnight-950/70 to-midnight-900/60"
    >
      {/* Messages */}
      {messages.map((message) => (
        <CopilotMessageItem key={message.id} message={message} />
      ))}

      {/* Thinking Status Indicator Banner */}
      {activeThinkingStage && (
        <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl bg-midnight-950/80 border border-cyan-500/30 text-xs text-cyan-300 max-w-sm animate-pulse shadow-[0_0_20px_rgba(22,199,243,0.15)]">
          <Activity className="w-4 h-4 animate-spin text-brand-cyan shrink-0" />
          <span className="font-mono text-[11px] leading-tight">
            {thinkingLabels[activeThinkingStage] || 'Processing operational query...'}
          </span>
        </div>
      )}

      {/* Welcome Quick Action Chips (Staggered) */}
      {isFirstVisit && (
        <div className="pt-2 pb-1 space-y-2">
          <p className="text-[11px] font-mono text-slate-400 uppercase tracking-wider px-1">
            Suggested Quick Actions:
          </p>
          <div className="flex flex-wrap gap-1.5">
            {quickPromptChips.map((chip, idx) => {
              const Icon = chip.icon;
              return (
                <button
                  key={idx}
                  onClick={() => sendMessage(chip.prompt)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-midnight-900/90 border border-slate-800 hover:border-cyan-500/40 hover:bg-cyan-500/10 text-slate-300 hover:text-cyan-200 text-xs transition-all shadow-sm group"
                >
                  <Icon className="w-3.5 h-3.5 text-brand-cyan group-hover:scale-110 transition-transform" />
                  <span>{chip.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Suggested Follow-Ups after assistant responses */}
      {!isFirstVisit && !isStreaming && messages[messages.length - 1]?.suggestedFollowUps && (
        <div className="pt-2 pb-1 space-y-1.5">
          <p className="text-[10px] font-mono text-slate-400 uppercase tracking-wider px-1">
            Explore Follow-Up Questions:
          </p>
          <div className="flex flex-wrap gap-1.5">
            {messages[messages.length - 1].suggestedFollowUps?.map((followUp, fIdx) => (
              <button
                key={fIdx}
                onClick={() => sendMessage(followUp)}
                className="px-2.5 py-1 rounded-lg bg-surface-50 border border-slate-800 hover:border-cyan-500/40 hover:bg-cyan-500/10 text-slate-300 hover:text-cyan-200 text-[11px] transition-all"
              >
                {followUp}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
