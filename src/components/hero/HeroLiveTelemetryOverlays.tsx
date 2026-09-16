import React from 'react';
import { Heart, Activity, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import { WaveformCanvas } from './WaveformCanvas';
import { useRouterStore } from '../../store/useRouterStore';

interface HeroLiveTelemetryOverlaysProps {
  onInspectSurge?: () => void;
}

export const HeroLiveTelemetryOverlays: React.FC<HeroLiveTelemetryOverlaysProps> = ({
  onInspectSurge
}) => {
  const navigate = useRouterStore((state) => state.navigate);

  const handleSurgeAction = () => {
    if (onInspectSurge) {
      onInspectSurge();
    } else {
      navigate('/app/dashboard');
    }
  };

  return (
    <>
      {/* 1. TOP-LEFT: Live Patient & ICU Telemetry Panel */}
      <div 
        className="absolute top-4 left-4 z-20 w-[270px] sm:w-[290px] p-3.5 rounded-xl bg-[#060D1A]/88 backdrop-blur-xl border border-cyan-500/30 shadow-[0_16px_36px_rgba(0,0,0,0.7)] transition-all duration-300 hover:border-cyan-400/50 hover:shadow-[0_20px_45px_rgba(25,199,243,0.15)] group"
      >
        <div className="flex items-center justify-between pb-2 border-b border-white/[0.08]">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
            </span>
            <span className="text-[10px] font-mono font-bold tracking-wider text-white uppercase">
              BED 04 TELEMETRY
            </span>
          </div>
          <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-semibold">
            LEAD II • 1.0mV
          </span>
        </div>

        {/* Real-time Mathematical ECG Waveform */}
        <div className="my-2">
          <WaveformCanvas width={256} height={42} color="#10B981" type="ecg" bpm={74} />
        </div>

        {/* 4 Critical Clinical Vitals Grid */}
        <div className="grid grid-cols-4 gap-1.5 pt-1 text-center font-mono">
          <div className="p-1.5 rounded-lg bg-black/40 border border-white/[0.05]">
            <div className="flex items-center justify-center gap-1 text-[9px] text-slate-400">
              <Heart className="w-2.5 h-2.5 text-rose-400 fill-rose-400 animate-pulse" />
              <span>HR</span>
            </div>
            <div className="text-sm font-bold text-emerald-400 tracking-tight">74</div>
            <div className="text-[8px] text-slate-400">bpm</div>
          </div>

          <div className="p-1.5 rounded-lg bg-black/40 border border-white/[0.05]">
            <div className="text-[9px] text-slate-400">SpO2</div>
            <div className="text-sm font-bold text-cyan-400 tracking-tight">98%</div>
            <div className="text-[8px] text-slate-400">room air</div>
          </div>

          <div className="p-1.5 rounded-lg bg-black/40 border border-white/[0.05]">
            <div className="text-[9px] text-slate-400">NIBP</div>
            <div className="text-xs font-bold text-white tracking-tight pt-0.5">118/76</div>
            <div className="text-[8px] text-slate-400">mmHg</div>
          </div>

          <div className="p-1.5 rounded-lg bg-black/40 border border-white/[0.05]">
            <div className="text-[9px] text-slate-400">RESP</div>
            <div className="text-sm font-bold text-indigo-300 tracking-tight">16</div>
            <div className="text-[8px] text-slate-400">/min</div>
          </div>
        </div>
      </div>

      {/* 2. TOP-RIGHT: ICU Bed Occupancy Radial Gauge */}
      <div 
        className="absolute top-4 right-4 z-20 w-[210px] sm:w-[225px] p-3.5 rounded-xl bg-[#060D1A]/88 backdrop-blur-xl border border-rose-500/30 shadow-[0_16px_36px_rgba(0,0,0,0.7)] transition-all duration-300 hover:border-rose-400/50 hover:shadow-[0_20px_45px_rgba(244,63,94,0.15)] group"
      >
        <div className="flex items-center justify-between pb-1.5 border-b border-white/[0.08]">
          <span className="text-[10px] font-mono font-bold tracking-wider text-slate-300 uppercase">
            ICU OCCUPANCY
          </span>
          <span className="inline-flex items-center gap-1 text-[9px] font-mono text-rose-400 font-bold bg-rose-500/10 px-1.5 py-0.5 rounded border border-rose-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
            CRITICAL
          </span>
        </div>

        <div className="flex items-center gap-3 pt-2">
          {/* Radial circular progress meter */}
          <div className="relative w-14 h-14 shrink-0">
            <svg className="w-14 h-14 -rotate-90" viewBox="0 0 48 48">
              <circle
                cx="24"
                cy="24"
                r="19"
                stroke="rgba(255,255,255,0.08)"
                strokeWidth="4"
                fill="none"
              />
              <circle
                cx="24"
                cy="24"
                r="19"
                stroke="#F43F5E"
                strokeWidth="4"
                strokeDasharray="119.38"
                strokeDashoffset="9.55" /* 92% filled */
                strokeLinecap="round"
                fill="none"
                style={{ filter: 'drop-shadow(0 0 6px rgba(244,63,94,0.6))' }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center font-display font-bold text-white text-xs">
              92%
            </div>
          </div>

          <div className="flex flex-col text-left">
            <div className="text-base font-display font-bold text-white tracking-tight">
              29 <span className="text-xs font-mono font-normal text-slate-400">/ 32 Beds</span>
            </div>
            <div className="text-[10px] font-mono text-rose-300 font-medium pt-0.5">
              3 Available Beds
            </div>
            <div className="text-[9px] text-slate-400 font-sans">
              1 Isolation • 2 Step-Down
            </div>
          </div>
        </div>
      </div>

      {/* 3. BOTTOM-LEFT: Neural Forecasting +18% Surge Influx */}
      <div 
        className="absolute bottom-4 left-4 z-20 w-[240px] sm:w-[260px] p-3.5 rounded-xl bg-[#060D1A]/88 backdrop-blur-xl border border-amber-500/30 shadow-[0_16px_36px_rgba(0,0,0,0.7)] transition-all duration-300 hover:border-amber-400/50 hover:shadow-[0_20px_45px_rgba(245,158,11,0.15)] group"
      >
        <div className="flex items-center justify-between pb-1.5 border-b border-white/[0.08]">
          <div className="flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-[10px] font-mono font-bold tracking-wider text-slate-200 uppercase">
              PREDICTED INFLUX
            </span>
          </div>
          <span className="text-[9px] font-mono text-amber-400 font-bold bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
            +18.4%
          </span>
        </div>

        <div className="pt-2 flex items-baseline justify-between">
          <div>
            <div className="text-lg font-display font-bold text-white tracking-tight">
              +14 Patients
            </div>
            <div className="text-[10px] font-mono text-slate-400">
              Next 4-Hour Window (T+4h)
            </div>
          </div>
          <div className="text-right">
            <div className="text-[10px] font-mono text-emerald-400 font-semibold">95% Conf.</div>
            <div className="text-[9px] font-mono text-slate-400">LSTM DeepAR</div>
          </div>
        </div>

        {/* Mini Neural Forecast Sparkline */}
        <div className="mt-2 h-7 w-full">
          <svg className="w-full h-full" viewBox="0 0 160 28" preserveAspectRatio="none">
            <defs>
              <linearGradient id="forecastGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.0" />
              </linearGradient>
            </defs>
            {/* Shaded confidence bound */}
            <path
              d="M0,18 L30,16 L60,15 L90,11 L120,7 L160,4 L160,20 L120,22 L90,23 L60,24 L30,22 L0,22 Z"
              fill="rgba(245, 158, 11, 0.12)"
            />
            {/* Historical line */}
            <path
              d="M0,18 L30,16 L60,15 L90,14"
              fill="none"
              stroke="#94A3B8"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
            {/* Forecast dashed projection */}
            <path
              d="M90,14 L120,9 L160,4"
              fill="none"
              stroke="#F59E0B"
              strokeWidth="2"
              strokeDasharray="3 3"
              strokeLinecap="round"
              style={{ filter: 'drop-shadow(0 0 4px rgba(245,158,11,0.7))' }}
            />
            <circle cx="160" cy="4" r="2.5" fill="#F59E0B" />
          </svg>
        </div>
      </div>

      {/* 4. BOTTOM-RIGHT: MILP Solver Surge Action Alert */}
      <div 
        className="absolute bottom-4 right-4 z-20 w-[260px] sm:w-[285px] p-3.5 rounded-xl bg-[#060D1A]/92 backdrop-blur-xl border border-cyan-500/40 shadow-[0_16px_36px_rgba(0,0,0,0.7)] transition-all duration-300 hover:border-cyan-300 hover:shadow-[0_20px_45px_rgba(25,199,243,0.25)] group"
      >
        <div className="flex items-center justify-between pb-1.5 border-b border-white/[0.08]">
          <div className="flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-[10px] font-mono font-bold tracking-wider text-cyan-300 uppercase">
              MILP RE-BALANCER
            </span>
          </div>
          <span className="inline-flex items-center gap-1 text-[9px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20 font-bold">
            <ShieldCheck className="w-2.5 h-2.5" />
            HUMAN GOVERNED
          </span>
        </div>

        <p className="pt-2 text-xs text-slate-200 font-sans leading-snug">
          Predicted capacity strain at 18:40. Ready to re-route 3 step-down discharges to Ward 4B.
        </p>

        <div className="mt-2.5 flex items-center justify-between pt-1 border-t border-white/[0.06]">
          <span className="text-[9px] font-mono text-slate-400">
            Solver: OR-Tools CBC
          </span>
          <button
            onClick={handleSurgeAction}
            className="inline-flex items-center gap-1 text-xs font-mono font-bold text-cyan-400 hover:text-cyan-300 transition-colors group-hover:translate-x-0.5 duration-200 cursor-pointer"
          >
            <span>Review Plan</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </>
  );
};
