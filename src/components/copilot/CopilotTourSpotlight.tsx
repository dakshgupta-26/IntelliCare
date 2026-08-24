import React, { useEffect, useState } from 'react';
import { ArrowRight, ArrowLeft, X, Check, Compass } from 'lucide-react';
import { useCopilotStore } from '../../store/useCopilotStore';
import { useRouterStore } from '../../store/useRouterStore';

export const CopilotTourSpotlight: React.FC = () => {
  const isTourActive = useCopilotStore((state) => state.isTourActive);
  const tourStepIndex = useCopilotStore((state) => state.tourStepIndex);
  const tourSteps = useCopilotStore((state) => state.tourSteps);
  const nextTourStep = useCopilotStore((state) => state.nextTourStep);
  const prevTourStep = useCopilotStore((state) => state.prevTourStep);
  const endTour = useCopilotStore((state) => state.endTour);
  const setOpen = useCopilotStore((state) => state.setOpen);

  const currentPath = useRouterStore((state) => state.currentPath);
  const navigate = useRouterStore((state) => state.navigate);

  const [highlightRect, setHighlightRect] = useState<DOMRect | null>(null);

  const currentStep = tourSteps[tourStepIndex];

  // Route to required page if needed, then highlight target element
  useEffect(() => {
    if (!isTourActive || !currentStep) return;

    if (currentStep.route && currentPath !== currentStep.route) {
      navigate(currentStep.route);
    }

    const timer = setTimeout(() => {
      const el = document.getElementById(currentStep.targetId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        const rect = el.getBoundingClientRect();
        setHighlightRect(rect);
      } else {
        setHighlightRect(null);
      }
    }, 300);

    const handleResize = () => {
      const el = document.getElementById(currentStep.targetId);
      if (el) {
        setHighlightRect(el.getBoundingClientRect());
      }
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleResize);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleResize);
    };
  }, [isTourActive, tourStepIndex, currentStep, currentPath, navigate]);

  if (!isTourActive || !currentStep) return null;

  return (
    <div className="fixed inset-0 z-[85] pointer-events-none select-none">
      {/* Target Element Glowing Spotlight Frame */}
      {highlightRect && (
        <div
          className="pointer-events-none fixed transition-all duration-300 rounded-3xl border-2 border-cyan-400 shadow-[0_0_50px_rgba(22,199,243,0.45)] ring-4 ring-cyan-500/20 animate-pulse"
          style={{
            top: Math.max(0, highlightRect.top - 12),
            left: Math.max(0, highlightRect.left - 12),
            width: highlightRect.width + 24,
            height: highlightRect.height + 24
          }}
        />
      )}

      {/* Floating Coach Mark Card (Centered Bottom) */}

      <div className="pointer-events-auto fixed bottom-8 left-1/2 -translate-x-1/2 w-[92%] max-w-lg rounded-3xl bg-midnight-950/98 border border-cyan-400/40 p-5 shadow-[0_20px_70px_rgba(0,0,0,0.8)] backdrop-blur-3xl text-slate-100 animate-in fade-in slide-in-from-bottom-4 duration-300">
        {/* Step Header */}
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-cyan-500/20 border border-cyan-400/30 flex items-center justify-center text-brand-cyan">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-mono text-cyan-300 uppercase tracking-wider block">
                Platform Tour • Step {tourStepIndex + 1} of {tourSteps.length}
              </span>
              <h4 className="text-sm font-bold text-white font-display">
                {currentStep.title}
              </h4>
            </div>
          </div>

          <button
            onClick={endTour}
            className="p-1.5 rounded-full bg-surface-100 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Step Description */}
        <p className="text-xs text-slate-300 leading-relaxed my-3 font-sans">
          {currentStep.description}
        </p>

        {/* Progress Bar & Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-800">
          {/* Progress Dots */}
          <div className="flex items-center gap-1.5">
            {tourSteps.map((_, idx) => (
              <div
                key={idx}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  idx === tourStepIndex
                    ? 'w-6 bg-brand-cyan shadow-[0_0_8px_rgba(22,199,243,0.8)]'
                    : 'w-1.5 bg-slate-700'
                }`}
              />
            ))}
          </div>

          {/* Nav Buttons */}
          <div className="flex items-center gap-2">
            {tourStepIndex > 0 && (
              <button
                onClick={prevTourStep}
                className="px-3 py-1.5 rounded-xl bg-surface-100 hover:bg-surface-200 text-slate-300 text-xs font-semibold flex items-center gap-1 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
            )}

            <button
              onClick={() => {
                if (tourStepIndex === tourSteps.length - 1) {
                  endTour();
                  setOpen(true);
                } else {
                  nextTourStep();
                }
              }}
              className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-[0_0_20px_rgba(22,199,243,0.4)] transition-all"
            >
              <span>{tourStepIndex === tourSteps.length - 1 ? 'Finish Tour' : 'Next Step'}</span>
              {tourStepIndex === tourSteps.length - 1 ? <Check className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
