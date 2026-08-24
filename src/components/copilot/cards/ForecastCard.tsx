import React, { useState } from 'react';
import { TrendingUp, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { useRouterStore } from '../../../store/useRouterStore';
import { useCopilotStore } from '../../../store/useCopilotStore';

interface ForecastCardProps {
  title: string;
  subtitle?: string;
  meta?: {
    currentCensus?: number;
    projectedPeak?: number;
    peakTime?: string;
    confidenceBand?: string;
    modelMape?: string;
  };
}

export const ForecastCard: React.FC<ForecastCardProps> = ({
  title,
  subtitle,
  meta = {
    currentCensus: 24,
    projectedPeak: 29,
    peakTime: '20:00',
    confidenceBand: '±1.8 beds',
    modelMape: '4.2%'
  }
}) => {
  const [showCI, setShowCI] = useState(true);
  const navigate = useRouterStore((state) => state.navigate);
  const setOpen = useCopilotStore((state) => state.setOpen);

  const handleOpenWorkspace = () => {
    navigate('/app/forecasting');
    setOpen(false);
  };


  return (
    <div className="my-3 rounded-2xl bg-midnight-900/90 border border-cyan-500/30 p-4 shadow-[0_4px_24px_rgba(0,0,0,0.4)] backdrop-blur-xl text-slate-100">
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center text-brand-cyan">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white font-display tracking-wide">{title}</h4>
            {subtitle && <p className="text-[11px] text-slate-400">{subtitle}</p>}
          </div>
        </div>

        <button
          onClick={() => setShowCI(!showCI)}
          className={`px-2 py-1 rounded-md text-[10px] font-mono border transition-colors ${
            showCI 
              ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300' 
              : 'bg-surface-100 border-slate-700 text-slate-400'
          }`}
        >
          {showCI ? '95% CI ON' : '95% CI OFF'}
        </button>
      </div>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-3 gap-2 mb-3 bg-surface-50/70 p-2.5 rounded-xl border border-white/5">
        <div>
          <span className="text-[10px] font-mono text-slate-400 uppercase block">Current Census</span>
          <span className="text-sm font-bold text-white font-mono">{meta.currentCensus} beds</span>
        </div>
        <div>
          <span className="text-[10px] font-mono text-slate-400 uppercase block">Projected Peak</span>
          <span className="text-sm font-bold text-cyan-300 font-mono">{meta.projectedPeak} beds ({meta.peakTime})</span>
        </div>
        <div>
          <span className="text-[10px] font-mono text-slate-400 uppercase block">Model Accuracy</span>
          <span className="text-sm font-bold text-emerald-400 font-mono">{meta.modelMape} MAPE</span>
        </div>
      </div>

      {/* Mini SVG Forecast Curve */}
      <div className="relative w-full h-24 bg-midnight-950/80 rounded-xl p-2 border border-slate-800 flex items-end">
        <svg viewBox="0 0 300 80" className="w-full h-full overflow-visible">
          <defs>
            <linearGradient id="forecastAreaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#16C7F3" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#16C7F3" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          <line x1="0" y1="20" x2="300" y2="20" stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" />
          <line x1="0" y1="50" x2="300" y2="50" stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" />

          {/* 95% Confidence Interval Band */}
          {showCI && (
            <path
              d="M 10 55 L 50 48 L 100 42 L 150 20 L 200 12 L 250 24 L 290 50 L 290 70 L 250 56 L 200 48 L 150 58 L 100 66 L 50 68 L 10 72 Z"
              fill="rgba(22, 199, 243, 0.12)"
            />
          )}

          {/* Historical Actual line */}
          <path
            d="M 10 65 L 50 58 L 100 52"
            fill="none"
            stroke="#94a3b8"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* LSTM Forecast Future curve */}
          <path
            d="M 100 52 L 150 35 L 200 24 L 250 38 L 290 60"
            fill="none"
            stroke="#16C7F3"
            strokeWidth="2.5"
            strokeDasharray="4 3"
          />

          {/* Peak Indicator Node */}
          <circle cx="200" cy="24" r="4" fill="#16C7F3" stroke="#ffffff" strokeWidth="1.5" />
          <text x="200" y="14" fill="#16C7F3" fontSize="9" fontWeight="bold" textAnchor="middle">29 Peak</text>

          {/* Actual Points */}
          <circle cx="10" cy="65" r="3" fill="#cbd5e1" />
          <circle cx="50" cy="58" r="3" fill="#cbd5e1" />
          <circle cx="100" cy="52" r="3" fill="#cbd5e1" />
        </svg>
      </div>

      {/* Footer / Deep-Dive CTA */}
      <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-800/80">
        <span className="text-[11px] text-slate-400 flex items-center gap-1">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          PyTorch Stacked LSTM (128 units)
        </span>

        <button
          onClick={handleOpenWorkspace}
          className="text-xs font-semibold text-brand-cyan hover:text-cyan-300 flex items-center gap-1 transition-colors"
        >
          Open Workspace
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
