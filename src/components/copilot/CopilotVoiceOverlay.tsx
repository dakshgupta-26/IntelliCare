import React, { useState, useEffect, useRef } from 'react';
import { X, Mic, MicOff, Volume2, MessageSquare, Sparkles } from 'lucide-react';
import { CopilotOrb } from './CopilotOrb';
import { useCopilotStore } from '../../store/useCopilotStore';

export const CopilotVoiceOverlay: React.FC = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [statusText, setStatusText] = useState('Listening for clinical operations queries...');

  const recognitionRef = useRef<any>(null);

  const isVoiceMode = useCopilotStore((state) => state.isVoiceMode);
  const toggleVoiceMode = useCopilotStore((state) => state.toggleVoiceMode);
  const sendMessage = useCopilotStore((state) => state.sendMessage);
  const isStreaming = useCopilotStore((state) => state.isStreaming);

  useEffect(() => {
    if (!isVoiceMode) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
      return;
    }

    // Initialize Web Speech Recognition if available
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        setStatusText('Listening... Say your operations question.');
      };

      recognition.onresult = (event: any) => {
        let interimTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            const finalTranscript = event.results[i][0].transcript;
            setTranscript(finalTranscript);
            setStatusText('Analyzing question and formulating response...');
            sendMessage(finalTranscript);
          } else {
            interimTranscript += event.results[i][0].transcript;
            setTranscript(interimTranscript);
          }
        }
      };

      recognition.onerror = (e: any) => {
        console.warn('Speech recognition error:', e);
        setStatusText('Mic active. You can also tap below to query.');
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      try {
        recognition.start();
      } catch (err) {
        console.warn('Speech recognition start failed:', err);
      }
    } else {
      setStatusText('Speech recognition not supported on this browser. Voice interface active.');
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [isVoiceMode, sendMessage]);

  if (!isVoiceMode) return null;

  const toggleMic = () => {
    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (e) {
        console.warn(e);
      }
    }
  };


  return (
    <div className="fixed inset-0 z-[90] flex flex-col items-center justify-between p-6 sm:p-12 bg-midnight-950/95 backdrop-blur-3xl text-slate-100 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="w-full max-w-2xl flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-brand-cyan animate-pulse" />
          <span className="font-display font-bold text-sm text-white tracking-wide">
            IntelliCare Voice Intelligence
          </span>
        </div>

        <button
          onClick={() => toggleVoiceMode(false)}
          className="p-2 rounded-full bg-surface-100/80 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Center AI Orb & Visualizer */}
      <div className="flex flex-col items-center justify-center my-auto space-y-8">
        <div className="relative">
          {/* Animated concentric audio wave rings */}
          <div className="absolute inset-0 -m-8 rounded-full border border-cyan-500/20 animate-ping opacity-40" />
          <div className="absolute inset-0 -m-16 rounded-full border border-teal-500/10 animate-pulse opacity-60" />

          {/* AI Neural Orb */}
          <CopilotOrb
            size="xl"
            state={isStreaming ? 'streaming' : isListening ? 'listening' : 'idle'}
          />
        </div>

        {/* Live Status & Transcript Display */}
        <div className="text-center max-w-lg space-y-3">
          <p className="text-sm font-mono text-cyan-300 font-semibold uppercase tracking-wider">
            {isStreaming ? 'Synthesizing Audio Response...' : statusText}
          </p>

          {transcript ? (
            <p className="text-lg sm:text-xl font-display font-medium text-white italic px-4">
              "{transcript}"
            </p>
          ) : (
            <p className="text-xs text-slate-400">
              Try asking: "What is the ICU bed forecast for tonight?" or "Explain the MILP nurse allocation."
            </p>
          )}
        </div>
      </div>

      {/* Bottom Control Dock */}
      <div className="w-full max-w-md flex items-center justify-center gap-6">
        <button
          onClick={() => toggleVoiceMode(false)}
          title="Switch to Text Mode"
          className="p-3.5 rounded-2xl bg-surface-100/90 border border-slate-800 text-slate-300 hover:text-white transition-all shadow-md flex items-center gap-2 text-xs font-semibold"
        >
          <MessageSquare className="w-4 h-4 text-brand-cyan" />
          <span>Text Chat</span>
        </button>

        {/* Big Mic Toggle Button */}
        <button
          onClick={toggleMic}
          className={`p-5 rounded-full border transition-all shadow-[0_0_30px_rgba(22,199,243,0.4)] ${
            isListening
              ? 'bg-gradient-to-tr from-cyan-500 to-blue-600 text-white border-cyan-300 scale-110'
              : 'bg-surface-100 text-rose-400 border-rose-500/30 hover:bg-surface-200'
          }`}
        >
          {isListening ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
        </button>

        <button
          onClick={() => sendMessage('Give me a quick 30-second operational briefing for ICU and Emergency.')}
          className="p-3.5 rounded-2xl bg-surface-100/90 border border-slate-800 text-slate-300 hover:text-white transition-all shadow-md flex items-center gap-2 text-xs font-semibold"
        >
          <Volume2 className="w-4 h-4 text-teal-400" />
          <span>Briefing</span>
        </button>
      </div>
    </div>
  );
};
