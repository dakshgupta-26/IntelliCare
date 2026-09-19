import React, { useState, useEffect } from 'react';
import {
  Sliders,
  RefreshCw
} from 'lucide-react';
import { useAuthStore } from '../../../store/useAuthStore';
import { useRouterStore } from '../../../store/useRouterStore';
import { Badge } from '../../ui/Badge';

interface CommandCenterHeaderProps {
  onRunScenario?: () => void;
  onRefresh?: () => void;
}

export const CommandCenterHeader: React.FC<CommandCenterHeaderProps> = ({
  onRunScenario,
  onRefresh
}) => {
  const currentUser = useAuthStore((state) => state.currentUser);
  const navigate = useRouterStore((state) => state.navigate);

  const [currentTime, setCurrentTime] = useState<string>('');
  const [secondsAgo, setSecondsAgo] = useState<number>(8);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Update clock every second
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Update sync timer
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsAgo((prev) => (prev >= 60 ? 3 : prev + 1));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleManualRefresh = () => {
    setIsRefreshing(true);
    if (onRefresh) onRefresh();
    setTimeout(() => {
      setSecondsAgo(1);
      setIsRefreshing(false);
    }, 600);
  };

  const getShiftName = () => {
    const hour = new Date().getHours();
    if (hour >= 7 && hour < 15) return 'DAY SHIFT (07:00 – 15:00)';
    if (hour >= 15 && hour < 23) return 'EVENING SHIFT (15:00 – 23:00)';
    return 'NIGHT SHIFT (23:00 – 07:00)';
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    const name = currentUser ? currentUser.name.split(',')[0] : 'Director';
    if (hour < 12) return `Good morning, ${name}`;
    if (hour < 17) return `Good afternoon, ${name}`;
    return `Good evening, ${name}`;
  };

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
      {/* Left: Shift & Command Center Title */}
      <div>
        <div className="flex flex-wrap items-center gap-2 mb-1">
          <span className="text-[11px] font-mono uppercase tracking-wider font-bold text-cyan-400">
            {getShiftName()}
          </span>
          <span className="text-slate-700 hidden sm:inline">•</span>
          <Badge variant="teal" size="sm">
            {getGreeting()}
          </Badge>
          <span className="text-slate-700 hidden sm:inline">•</span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
            SIMULATED DATA
          </span>
        </div>

        <div className="flex items-baseline gap-3">
          <h1 className="text-xl sm:text-2xl font-display font-extrabold text-white tracking-tight">
            Hospital Operations Command Center
          </h1>
        </div>

        <p className="text-xs text-slate-400 mt-0.5 max-w-2xl leading-normal">
          Real-time operational state, predictive demand, and resource intelligence.
        </p>
      </div>

      {/* Right: Live Telemetry Indicator & Primary Actions */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 shrink-0">
        {/* Real-time Streaming Pulse */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#091424] border border-slate-800 text-xs font-mono">
          <div className="flex items-center gap-1.5 text-emerald-400">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="font-bold tracking-wider text-[10px]">LIVE</span>
          </div>
          <span className="text-slate-700">|</span>
          <span className="text-slate-300 font-bold">{currentTime}</span>
          <span className="text-slate-500 text-[11px]">
            (Updated {secondsAgo}s ago)
          </span>
          <button
            onClick={handleManualRefresh}
            className={`p-1 rounded text-slate-400 hover:text-cyan-400 transition-colors cursor-pointer ${
              isRefreshing ? 'animate-spin text-cyan-400' : ''
            }`}
            title="Refresh Live Telemetry"
          >
            <RefreshCw className="w-3 h-3" />
          </button>
        </div>

        {/* Primary Action: Run Scenario */}
        <button
          onClick={() => {
            if (onRunScenario) onRunScenario();
            else navigate('/app/scenarios');
          }}
          className="group relative inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-purple-600/90 to-indigo-600/90 hover:from-purple-500 hover:to-indigo-500 border border-purple-400/30 text-white font-mono text-xs font-bold shadow-[0_0_15px_rgba(168,85,247,0.25)] hover:shadow-[0_0_22px_rgba(168,85,247,0.4)] transition-all cursor-pointer"
        >
          <Sliders className="w-3.5 h-3.5 text-purple-300 group-hover:rotate-12 transition-transform" />
          <span>Run Scenario →</span>
        </button>
      </div>
    </div>
  );
};
