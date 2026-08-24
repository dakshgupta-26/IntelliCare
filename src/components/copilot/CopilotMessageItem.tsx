import React, { useState } from 'react';
import { 
  Copy, 
  Check, 
  RotateCw, 
  ThumbsUp, 
  ThumbsDown, 
  Volume2, 
  Bookmark, 
  BookmarkCheck, 
  Share2, 
  ChevronDown, 
  ChevronUp, 
  ShieldCheck 
} from 'lucide-react';
import { CopilotMessage } from '../../types/copilot';
import { CopilotOrb } from './CopilotOrb';
import { ForecastCard } from './cards/ForecastCard';
import { OptimizationCard } from './cards/OptimizationCard';
import { ArchitectureCard } from './cards/ArchitectureCard';
import { AlgorithmCard } from './cards/AlgorithmCard';
import { ShareModal } from './cards/ShareModal';
import { useCopilotStore } from '../../store/useCopilotStore';

interface CopilotMessageItemProps {
  message: CopilotMessage;
}

export const CopilotMessageItem: React.FC<CopilotMessageItemProps> = ({ message }) => {
  const [copied, setCopied] = useState(false);
  const [showSources, setShowSources] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const toggleLikeMessage = useCopilotStore((state) => state.toggleLikeMessage);
  const toggleBookmark = useCopilotStore((state) => state.toggleBookmark);
  const regenerateMessage = useCopilotStore((state) => state.regenerateMessage);
  const bookmarks = useCopilotStore((state) => state.bookmarks);

  const isBookmarked = bookmarks.some((b) => b.messageId === message.id);
  const isUser = message.sender === 'user';


  // Copy handler
  const handleCopy = () => {
    navigator.clipboard.writeText(message.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Text-To-Speech handler
  const handleSpeak = () => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    // Clean markdown text for voice
    const cleanText = message.text
      .replace(/#{1,6}\s+/g, '')
      .replace(/\*\*/g, '')
      .replace(/\*/g, '')
      .replace(/`{1,3}/g, '')
      .replace(/\$\$/g, '')
      .replace(/\$/g, '');

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.05;
    utterance.pitch = 1.0;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  // Simple clean markdown formatter
  const renderFormattedMarkdown = (content: string) => {
    const lines = content.split('\n');

    return lines.map((line, idx) => {
      // Heading 3 / 4
      if (line.startsWith('### ')) {
        return (
          <h3 key={idx} className="text-sm font-bold text-white font-display mt-3 mb-1.5 flex items-center gap-1.5">
            {line.replace('### ', '')}
          </h3>
        );
      }
      if (line.startsWith('#### ')) {
        return (
          <h4 key={idx} className="text-xs font-semibold text-cyan-300 font-display mt-2 mb-1">
            {line.replace('#### ', '')}
          </h4>
        );
      }

      // Code block lines
      if (line.startsWith('```')) {
        return null;
      }

      // Bullet points
      if (line.startsWith('* ') || line.startsWith('- ')) {
        const itemText = line.replace(/^[\*\-]\s+/, '');
        return (
          <li key={idx} className="ml-4 list-disc text-xs text-slate-300 leading-relaxed my-0.5">
            <span dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(itemText) }} />
          </li>
        );
      }

      // Numbered lists
      if (/^\d+\.\s+/.test(line)) {
        const itemText = line.replace(/^\d+\.\s+/, '');
        return (
          <li key={idx} className="ml-4 list-decimal text-xs text-slate-300 leading-relaxed my-0.5">
            <span dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(itemText) }} />
          </li>
        );
      }

      // Table formatting (basic detection)
      if (line.startsWith('|')) {
        if (line.includes('---')) return null;
        const cells = line.split('|').filter((c) => c.trim() !== '');
        return (
          <div key={idx} className="grid grid-cols-4 gap-2 text-[11px] font-mono py-1 px-2 bg-midnight-950/60 border-b border-slate-800/60 rounded">
            {cells.map((cell, cIdx) => (
              <span key={cIdx} className={cIdx === 0 ? 'font-bold text-white' : 'text-slate-300'}>
                {cell.trim()}
              </span>
            ))}
          </div>
        );
      }

      // Empty line
      if (!line.trim()) {
        return <div key={idx} className="h-1.5" />;
      }

      // Normal paragraph
      return (
        <p
          key={idx}
          className="text-xs text-slate-200 leading-relaxed my-1"
          dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(line) }}
        />
      );
    });
  };

  const formatInlineMarkdown = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-white">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="text-slate-300 italic">$1</em>')
      .replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 rounded bg-surface-100/90 text-cyan-300 font-mono text-[11px] border border-cyan-500/20">$1</code>')
      .replace(/\$([^\$]+)\$/g, '<span class="px-1 py-0.2 rounded bg-purple-950/40 text-purple-300 font-mono text-[11px]">$1</span>');
  };

  return (
    <div className={`group flex flex-col my-3 ${isUser ? 'items-end' : 'items-start'}`}>
      <div className={`flex items-start gap-2.5 max-w-[92%] sm:max-w-[86%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        {/* Avatar */}
        <div className="shrink-0 mt-0.5">
          {isUser ? (
            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-cyan-600 to-indigo-600 border border-cyan-400/40 flex items-center justify-center text-[10px] font-bold text-white shadow-[0_0_12px_rgba(22,199,243,0.3)]">
              US
            </div>
          ) : (
            <CopilotOrb size="sm" state={message.isStreaming ? 'streaming' : 'idle'} />
          )}
        </div>

        {/* Bubble Container */}
        <div className="flex-1 min-w-0">
          {/* User Message Bubble */}
          {isUser ? (
            <div className="px-4 py-2.5 rounded-2xl rounded-tr-sm bg-gradient-to-r from-blue-600/90 to-indigo-700/90 border border-cyan-400/30 text-white shadow-[0_4px_20px_rgba(14,165,233,0.25)] backdrop-blur-xl">
              <p className="text-xs leading-relaxed font-sans">{message.text}</p>
              <span className="text-[9px] font-mono text-cyan-200/60 block text-right mt-1">
                {message.timestamp}
              </span>
            </div>
          ) : (
            /* Assistant Message Bubble */
            <div className="px-4 py-3 rounded-2xl rounded-tl-sm bg-midnight-950/80 border border-cyan-500/20 text-slate-200 shadow-[0_8px_32px_rgba(0,0,0,0.5)] backdrop-blur-2xl">
              {/* Formatted Text Content */}
              <div className="space-y-1">
                {renderFormattedMarkdown(message.text)}
                {message.isStreaming && (
                  <span className="inline-block w-1.5 h-3.5 bg-brand-cyan ml-1 animate-pulse" />
                )}
              </div>

              {/* Rich Interactive Cards */}
              {message.cards && message.cards.length > 0 && (
                <div className="mt-3 space-y-2">
                  {message.cards.map((card, cIdx) => {
                    if (card.type === 'forecast') {
                      return <ForecastCard key={cIdx} title={card.title} subtitle={card.subtitle} meta={card.meta} />;
                    }
                    if (card.type === 'optimization') {
                      return <OptimizationCard key={cIdx} title={card.title} subtitle={card.subtitle} data={card.data} />;
                    }
                    if (card.type === 'architecture') {
                      return <ArchitectureCard key={cIdx} title={card.title} subtitle={card.subtitle} />;
                    }
                    if (card.type === 'algorithm') {
                      return <AlgorithmCard key={cIdx} title={card.title} subtitle={card.subtitle} />;
                    }
                    return null;
                  })}
                </div>
              )}

              {/* RAG Grounded Citations Accordion */}
              {message.citations && message.citations.length > 0 && (
                <div className="mt-3 pt-2 border-t border-slate-800/80">
                  <button
                    onClick={() => setShowSources(!showSources)}
                    className="w-full flex items-center justify-between text-[11px] font-mono text-cyan-300 hover:text-cyan-200 py-1 transition-colors"
                  >
                    <span className="flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
                      Grounded in {message.citations.length} Verified Hospital Protocol{message.citations.length > 1 ? 's' : ''}
                    </span>
                    {showSources ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>

                  {showSources && (
                    <div className="mt-2 space-y-2 animate-in fade-in duration-150">
                      {message.citations.map((cite, sIdx) => (
                        <div
                          key={sIdx}
                          className="p-2.5 rounded-xl bg-midnight-900/90 border border-slate-800 text-[11px] space-y-1"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-white font-display">{cite.documentTitle}</span>
                            <span className="px-1.5 py-0.2 rounded bg-cyan-500/10 border border-cyan-500/30 text-[9px] font-mono text-cyan-300">
                              {(cite.confidenceScore * 100).toFixed(0)}% Confidence
                            </span>
                          </div>
                          <p className="text-[10px] font-mono text-slate-400">
                            {cite.documentCode} — {cite.section}
                          </p>
                          <blockquote className="pl-2 border-l-2 border-brand-cyan/40 text-slate-300 italic text-[10px] my-1">
                            "{cite.matchedSnippet}"
                          </blockquote>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Assistant Footer Action Toolbar */}
              {!message.isStreaming && (
                <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-800/60 text-[11px] text-slate-400">
                  <span className="text-[9px] font-mono text-slate-500">
                    {message.timestamp}
                  </span>

                  <div className="flex items-center gap-1">
                    {/* Copy Button */}
                    <button
                      onClick={handleCopy}
                      title="Copy response"
                      className="p-1 rounded-md hover:bg-surface-100 hover:text-white transition-colors"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>

                    {/* Speak TTS Button */}
                    <button
                      onClick={handleSpeak}
                      title={isSpeaking ? 'Stop speaking' : 'Read aloud'}
                      className={`p-1 rounded-md hover:bg-surface-100 transition-colors ${
                        isSpeaking ? 'text-cyan-300 bg-cyan-500/20' : 'hover:text-white'
                      }`}
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>

                    {/* Bookmark Button */}
                    <button
                      onClick={() => toggleBookmark(message)}
                      title={isBookmarked ? 'Remove bookmark' : 'Bookmark insight'}
                      className={`p-1 rounded-md hover:bg-surface-100 transition-colors ${
                        isBookmarked ? 'text-purple-300' : 'hover:text-white'
                      }`}
                    >
                      {isBookmarked ? <BookmarkCheck className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
                    </button>

                    {/* Like / Dislike */}
                    <button
                      onClick={() => toggleLikeMessage(message.id, true)}
                      title="Helpful"
                      className={`p-1 rounded-md hover:bg-surface-100 transition-colors ${
                        message.liked === true ? 'text-emerald-400' : 'hover:text-white'
                      }`}
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => toggleLikeMessage(message.id, false)}
                      title="Not helpful"
                      className={`p-1 rounded-md hover:bg-surface-100 transition-colors ${
                        message.liked === false ? 'text-rose-400' : 'hover:text-white'
                      }`}
                    >
                      <ThumbsDown className="w-3.5 h-3.5" />
                    </button>

                    {/* Share Button */}
                    <button
                      onClick={() => setShowShareModal(true)}
                      title="Share insight"
                      className="p-1 rounded-md hover:bg-surface-100 hover:text-white transition-colors"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                    </button>

                    {/* Regenerate Button */}
                    <button
                      onClick={() => regenerateMessage(message.id)}
                      title="Regenerate answer"
                      className="p-1 rounded-md hover:bg-surface-100 hover:text-cyan-300 transition-colors"
                    >
                      <RotateCw className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Share Modal Dialog */}
      {showShareModal && (
        <ShareModal message={message} onClose={() => setShowShareModal(false)} />
      )}
    </div>
  );
};
