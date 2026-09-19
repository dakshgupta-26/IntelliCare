import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Badge } from '../../ui/Badge';

export interface KPICardProps {
  label: string;
  value: string | number;
  unit?: string;
  trend: string;
  trendDirection?: 'up' | 'down' | 'neutral';
  trendType?: 'positive' | 'negative' | 'neutral' | 'warning';
  statusText: string;
  statusVariant?: 'emerald' | 'amber' | 'rose' | 'teal' | 'cyan';
  contextText: string;
  icon: LucideIcon;
  iconColor?: string;
  microVisualization?: React.ReactNode;
  onClick?: () => void;
}

export const KPICard: React.FC<KPICardProps> = ({
  label,
  value,
  unit,
  trend,
  trendDirection = 'up',
  trendType = 'warning',
  statusText,
  statusVariant = 'amber',
  contextText,
  icon: Icon,
  iconColor = 'text-cyan-400',
  microVisualization,
  onClick
}) => {
  const getTrendColor = () => {
    switch (trendType) {
      case 'negative':
      case 'warning':
        return 'text-rose-400';
      case 'positive':
        return 'text-emerald-400';
      case 'neutral':
      default:
        return 'text-slate-400';
    }
  };

  return (
    <div
      onClick={onClick}
      className={`relative p-3.5 sm:p-4 rounded-2xl bg-[#07111f] border border-slate-800/90 hover:border-slate-700 hover:bg-[#091526] transition-all flex flex-col justify-between overflow-hidden group ${
        onClick ? 'cursor-pointer' : ''
      }`}
    >
      {/* Top row: Label & Icon */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <span className="text-[11px] font-mono text-slate-400 font-medium truncate uppercase tracking-wider">
            {label}
          </span>
          <div className={`p-1.5 rounded-lg bg-surface-200/40 border border-slate-800 shrink-0 ${iconColor}`}>
            <Icon className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Main Number + Micro Visualization */}
        <div className="flex items-baseline justify-between gap-2 my-1">
          <div className="flex items-baseline gap-1">
            <span className="text-2xl sm:text-[26px] font-mono font-extrabold text-white tracking-tight">
              {value}
            </span>
            {unit && <span className="text-xs font-mono text-slate-400">{unit}</span>}
          </div>

          {/* Micro chart or gauge */}
          {microVisualization && (
            <div className="shrink-0 flex items-center justify-end">
              {microVisualization}
            </div>
          )}
        </div>

        {/* Secondary Context */}
        <div className="text-[11px] text-slate-400 truncate mt-0.5">
          {contextText}
        </div>
      </div>

      {/* Bottom row: Trend & Status */}
      <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between gap-2 text-[10px] font-mono">
        <span className={`font-bold truncate ${getTrendColor()}`}>
          {trendDirection === 'up' ? '↑' : trendDirection === 'down' ? '↓' : '→'} {trend}
        </span>
        <Badge variant={statusVariant} size="sm">
          {statusText}
        </Badge>
      </div>
    </div>
  );
};
