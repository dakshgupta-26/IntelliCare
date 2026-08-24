import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Square, 
  Mic, 
  Sparkles, 
  TrendingUp, 
  Cpu, 
  BookOpen, 
  Layers, 
  Sliders, 
  Compass, 
  AlertTriangle, 
  Activity, 
  CornerDownLeft
} from 'lucide-react';
import { COPILOT_SLASH_COMMANDS } from '../../data/copilotKnowledge';
import { useCopilotStore } from '../../store/useCopilotStore';


export const CopilotInput: React.FC = () => {
  const [inputVal, setInputVal] = useState('');
  const [placeholderIdx, setPlaceholderIdx] = useState(0);
  const [showSlashMenu, setShowSlashMenu] = useState(false);
  const [slashFilter, setSlashFilter] = useState('');
  const [selectedSlashIdx, setSelectedSlashIdx] = useState(0);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedSugIdx, setSelectedSugIdx] = useState(0);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const isStreaming = useCopilotStore((state) => state.isStreaming);
  const sendMessage = useCopilotStore((state) => state.sendMessage);
  const cancelStreaming = useCopilotStore((state) => state.cancelStreaming);
  const toggleVoiceMode = useCopilotStore((state) => state.toggleVoiceMode);

  const placeholders = [
    'Ask about ICU demand forecasting & LSTM...',
    'Ask how MILP optimization balances beds & nurses...',
    'Type / for quick operational commands...',
    'Query hospital SOPs and staffing mandates (RAG)...',
    'Simulate a mass casualty surge scenario...',
    'Explain the microservice architecture...'
  ];

  // Rotate placeholders every 4.5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setPlaceholderIdx((prev) => (prev + 1) % placeholders.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  // Filter slash commands
  const filteredCommands = COPILOT_SLASH_COMMANDS.filter((cmd) =>
    cmd.command.toLowerCase().includes(slashFilter.toLowerCase()) ||
    cmd.label.toLowerCase().includes(slashFilter.toLowerCase()) ||
    cmd.description.toLowerCase().includes(slashFilter.toLowerCase())
  );

  // Autocomplete suggestions based on keywords
  const autocompletePool = [
    'forecast ICU demand for next 24 hours',
    'forecast emergency patient presentations',
    'explain MILP optimization and Google OR-Tools solver',
    'show hospital microservice architecture',
    'what are the statutory nurse-to-patient staffing ratios?',
    'simulate mass casualty surge (+35% intake)',
    'what is the difference between LSTM and XGBoost?',
    'give me a guided tour of IntelliCare'
  ];

  const filteredSuggestions = inputVal.length > 2 && !inputVal.startsWith('/')
    ? autocompletePool.filter((s) => s.toLowerCase().includes(inputVal.toLowerCase()))
    : [];

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setInputVal(val);

    // Auto-adjust textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }

    // Check slash command trigger
    if (val.startsWith('/')) {
      setShowSlashMenu(true);
      setSlashFilter(val);
      setSelectedSlashIdx(0);
      setShowSuggestions(false);
    } else {
      setShowSlashMenu(false);
      setShowSuggestions(val.length > 2);
      setSelectedSugIdx(0);
    }
  };

  const executeSend = (textToSend?: string) => {
    const query = textToSend || inputVal;
    if (!query.trim() || isStreaming) return;

    sendMessage(query.trim());
    setInputVal('');
    setShowSlashMenu(false);
    setShowSuggestions(false);

    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Slash menu keyboard navigation
    if (showSlashMenu && filteredCommands.length > 0) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedSlashIdx((prev) => (prev + 1) % filteredCommands.length);
        return;
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedSlashIdx((prev) => (prev - 1 + filteredCommands.length) % filteredCommands.length);
        return;
      }
      if (e.key === 'Enter' || e.key === 'Tab') {
        e.preventDefault();
        const selected = filteredCommands[selectedSlashIdx];
        if (selected) {
          executeSend(selected.prompt);
        }
        return;
      }
      if (e.key === 'Escape') {
        setShowSlashMenu(false);
        return;
      }
    }

    // Autocomplete dropdown navigation
    if (showSuggestions && filteredSuggestions.length > 0) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedSugIdx((prev) => (prev + 1) % filteredSuggestions.length);
        return;
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedSugIdx((prev) => (prev - 1 + filteredSuggestions.length) % filteredSuggestions.length);
        return;
      }
      if (e.key === 'Tab') {
        e.preventDefault();
        setInputVal(filteredSuggestions[selectedSugIdx]);
        setShowSuggestions(false);
        return;
      }
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        executeSend(filteredSuggestions[selectedSugIdx]);
        return;
      }
    }

    // Normal Send
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      executeSend();
    }
  };

  const getCommandIcon = (iconName: string) => {
    switch (iconName) {
      case 'TrendingUp': return <TrendingUp className="w-4 h-4 text-cyan-400" />;
      case 'Cpu': return <Cpu className="w-4 h-4 text-teal-400" />;
      case 'BookOpen': return <BookOpen className="w-4 h-4 text-purple-400" />;
      case 'Sliders': return <Sliders className="w-4 h-4 text-amber-400" />;
      case 'Layers': return <Layers className="w-4 h-4 text-indigo-400" />;
      case 'Compass': return <Compass className="w-4 h-4 text-cyan-400" />;
      case 'AlertTriangle': return <AlertTriangle className="w-4 h-4 text-rose-400" />;
      case 'Activity': return <Activity className="w-4 h-4 text-emerald-400" />;
      default: return <Sparkles className="w-4 h-4 text-cyan-400" />;
    }
  };

  return (
    <div className="relative p-3 border-t border-cyan-500/15 bg-midnight-950/95 backdrop-blur-2xl">
      {/* Slash Commands Dropdown Menu */}
      {showSlashMenu && (
        <div className="absolute bottom-full left-3 right-3 mb-2 max-h-64 overflow-y-auto custom-scrollbar rounded-2xl bg-midnight-950/98 border border-cyan-500/40 shadow-[0_15px_50px_rgba(0,0,0,0.8)] backdrop-blur-2xl p-1.5 z-50 animate-in fade-in slide-in-from-bottom-2 duration-150">
          <div className="px-3 py-1.5 border-b border-slate-800 text-[10px] font-mono text-cyan-400 uppercase tracking-wider flex items-center justify-between">
            <span>Operational Commands</span>
            <span>Tab / Enter to select</span>
          </div>

          {filteredCommands.length === 0 ? (
            <div className="px-3 py-3 text-xs text-slate-400 text-center">
              No matching commands
            </div>
          ) : (
            filteredCommands.map((cmd, idx) => (
              <button
                key={cmd.command}
                onClick={() => executeSend(cmd.prompt)}
                className={`w-full flex items-start gap-2.5 px-3 py-2 rounded-xl text-left transition-all ${
                  selectedSlashIdx === idx
                    ? 'bg-cyan-500/20 text-white border border-cyan-500/40 shadow-[0_0_15px_rgba(22,199,243,0.2)]'
                    : 'text-slate-300 hover:bg-surface-100'
                }`}
              >
                <div className="mt-0.5 shrink-0">{getCommandIcon(cmd.icon)}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-cyan-300">{cmd.command}</span>
                    <span className="text-xs font-semibold text-white truncate">{cmd.label}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 truncate mt-0.5">{cmd.description}</p>
                </div>
              </button>
            ))
          )}
        </div>
      )}

      {/* Autocomplete Suggestions Dropdown */}
      {showSuggestions && filteredSuggestions.length > 0 && !showSlashMenu && (
        <div className="absolute bottom-full left-3 right-3 mb-2 max-h-48 overflow-y-auto custom-scrollbar rounded-2xl bg-midnight-950/98 border border-slate-800 shadow-[0_15px_40px_rgba(0,0,0,0.8)] backdrop-blur-2xl p-1.5 z-50 animate-in fade-in slide-in-from-bottom-2 duration-150">
          <div className="px-2 py-1 text-[9px] font-mono text-slate-400 uppercase tracking-wider">
            Suggested Queries (Tab to complete)
          </div>
          {filteredSuggestions.map((sug, idx) => (
            <button
              key={idx}
              onClick={() => executeSend(sug)}
              className={`w-full flex items-center justify-between px-3 py-1.5 rounded-xl text-xs text-left transition-colors ${
                selectedSugIdx === idx
                  ? 'bg-cyan-500/20 text-cyan-300 font-semibold'
                  : 'text-slate-300 hover:bg-surface-100'
              }`}
            >
              <span className="truncate">{sug}</span>
              <CornerDownLeft className="w-3 h-3 text-slate-500 shrink-0 ml-2" />
            </button>
          ))}
        </div>
      )}

      {/* Main Input Surface */}
      <div className="relative flex items-end gap-2 rounded-2xl bg-midnight-900/90 border border-slate-800 focus-within:border-cyan-500/50 focus-within:shadow-[0_0_20px_rgba(22,199,243,0.2)] transition-all p-2">
        {/* Voice Mode Icon Trigger */}
        <button
          onClick={() => toggleVoiceMode(true)}
          title="Voice input mode"
          className="p-1.5 rounded-xl text-slate-400 hover:text-cyan-300 hover:bg-surface-100 transition-colors shrink-0"
        >
          <Mic className="w-4 h-4" />
        </button>

        {/* Text Area */}
        <textarea
          ref={textareaRef}
          value={inputVal}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholders[placeholderIdx]}
          rows={1}
          className="flex-1 bg-transparent border-0 resize-none text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none custom-scrollbar max-h-32 py-1 leading-relaxed"
        />

        {/* Send / Stop Streaming Button */}
        {isStreaming ? (
          <button
            onClick={cancelStreaming}
            title="Stop generating"
            className="p-2 rounded-xl bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30 transition-all shrink-0 animate-pulse"
          >
            <Square className="w-4 h-4 fill-current" />
          </button>
        ) : (
          <button
            onClick={() => executeSend()}
            disabled={!inputVal.trim()}
            title="Send query (Enter)"
            className={`p-2 rounded-xl text-white transition-all shrink-0 ${
              inputVal.trim()
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-[0_0_15px_rgba(22,199,243,0.4)] scale-100'
                : 'bg-surface-100 text-slate-500 cursor-not-allowed opacity-60'
            }`}
          >
            <Send className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Micro Footer Hint */}
      <div className="flex items-center justify-between px-2 pt-1.5 text-[10px] font-mono text-slate-500 select-none">
        <span className="flex items-center gap-1">
          <kbd className="px-1 py-0.2 rounded bg-surface-100 border border-slate-700 text-slate-400 text-[9px]">/</kbd>
          Commands
        </span>
        <span>
          Enter sends • Shift+Enter newline
        </span>
      </div>
    </div>
  );
};
