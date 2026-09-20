import React from 'react';
import { AlertTriangle, Loader2 } from 'lucide-react';
import { Button } from '../ui/Button';

/** Shared loading / error states for pages backed by the ML service. */
export const MLStatus: React.FC<{ loading: boolean; error: string | null; onRetry?: () => void; label?: string }> = ({
  loading, error, onRetry, label = 'Loading',
}) => {
  if (error) {
    return (
      <div className="rounded-2xl border border-rose-500/30 bg-rose-500/5 p-5 flex flex-col sm:flex-row sm:items-center gap-4">
        <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
        <p className="text-sm text-rose-200 flex-1 font-mono break-words">{error}</p>
        {onRetry && <Button variant="danger" size="sm" onClick={onRetry}>Retry</Button>}
      </div>
    );
  }
  if (loading) {
    return (
      <div className="flex items-center gap-3 text-sm text-slate-400 py-10 justify-center">
        <Loader2 className="w-4 h-4 animate-spin text-cyan-400" /> {label}…
      </div>
    );
  }
  return null;
};

export const PageHeader: React.FC<{ eyebrow: string; title: string; subtitle: string; actions?: React.ReactNode }> = ({
  eyebrow, title, subtitle, actions,
}) => (
  <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
    <div>
      <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider font-bold">{eyebrow}</span>
      <h1 className="mt-1 text-2xl sm:text-3xl font-display font-extrabold text-white tracking-tight">{title}</h1>
      <p className="mt-1 text-sm text-slate-400 max-w-3xl">{subtitle}</p>
    </div>
    {actions && <div className="flex flex-wrap items-center gap-2 shrink-0">{actions}</div>}
  </div>
);

export const Stat: React.FC<{ label: string; value: React.ReactNode; hint?: React.ReactNode; tone?: 'default' | 'good' | 'bad' | 'warn' }> = ({
  label, value, hint, tone = 'default',
}) => {
  const toneClass = { default: 'text-white', good: 'text-emerald-400', bad: 'text-rose-400', warn: 'text-amber-300' }[tone];
  return (
    <div className="rounded-xl border border-slate-800 bg-surface-100/60 p-4">
      <div className="text-[11px] font-mono uppercase tracking-wider text-slate-500">{label}</div>
      <div className={`mt-1 text-2xl font-display font-bold tabular-nums ${toneClass}`}>{value}</div>
      {hint && <div className="mt-1 text-xs text-slate-400">{hint}</div>}
    </div>
  );
};

export const chartTheme = {
  grid: '#1e293b',
  axis: '#64748b',
  tooltip: { backgroundColor: '#0b1628', border: '1px solid #1e293b', borderRadius: 10, fontSize: 12 },
};
