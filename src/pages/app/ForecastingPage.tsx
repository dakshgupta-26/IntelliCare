import React, { useMemo, useState } from 'react';
import { RefreshCw } from 'lucide-react';
import {
  Area, CartesianGrid, ComposedChart, Legend, Line, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts';
import { mlApi } from '../../services/mlApi';
import { useMLQuery } from '../../hooks/useMLQuery';
import { UNIT_LABEL, UnitId } from '../../types/ml';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { MLStatus, PageHeader, Stat, chartTheme } from '../../components/ml/MLStatus';

const UNITS: UnitId[] = ['ICU', 'GENERAL', 'EMERGENCY'];
const hourLabel = (iso: string) => new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

export const ForecastingPage: React.FC = () => {
  const [unit, setUnit] = useState<UnitId>('ICU');
  const forecasts = useMLQuery(() => mlApi.forecasts());
  const metrics = useMLQuery(() => mlApi.metrics());
  const f = forecasts.data?.[unit];

  const chartData = useMemo(() => {
    if (!f) return [];
    const n = f.history.length;
    const history = f.history.map((h, i) => ({ t: i - (n - 1), actual: h.value }));
    // Anchor every forecast series at the last observed value so the lines join the history.
    const last = history[history.length - 1];
    Object.assign(last, { lstm: f.current, xgboost: f.current, band: [f.current, f.current] });
    const future = f.forecast.map((p) => ({
      t: p.horizon_h,
      lstm: p.lstm,
      xgboost: p.xgboost,
      ensemble: p.ensemble,
      band: [p.lower, p.upper],
    }));
    return [...history, ...future];
  }, [f]);

  const unitMetrics = metrics.data?.forecasting[unit];
  const peak = f ? f.forecast.reduce((a, b) => (b.upper > a.upper ? b : a)) : null;

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        eyebrow="Predictive demand engine"
        title="Demand Forecasting"
        subtitle="Bed demand forecast 2, 6, 12 and 24 hours ahead by an LSTM network and an XGBoost regressor, with 95% intervals from test-set residuals."
        actions={
          <Button variant="secondary" size="sm" icon={<RefreshCw className="w-3.5 h-3.5" />} onClick={forecasts.reload}>
            Re-run inference
          </Button>
        }
      />

      <div className="flex flex-wrap gap-2">
        {UNITS.map((u) => (
          <button
            key={u}
            onClick={() => setUnit(u)}
            className={`px-4 py-2 rounded-xl text-sm border transition-colors ${
              unit === u ? 'bg-cyan-500/15 border-cyan-500/40 text-cyan-300' : 'border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            {UNIT_LABEL[u]}
          </button>
        ))}
      </div>

      <MLStatus loading={forecasts.loading && !f} error={forecasts.error} onRetry={forecasts.reload} label="Running forecast models" />

      {f && peak && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <Stat label="Current census" value={`${f.current} / ${f.capacity}`} hint={`${Math.round((f.current / f.capacity) * 100)}% of staffed beds`} />
            <Stat
              label="24h forecast (ensemble)"
              value={f.forecast[f.forecast.length - 1].ensemble}
              hint={`95% interval ${f.forecast[f.forecast.length - 1].lower} – ${f.forecast[f.forecast.length - 1].upper}`}
            />
            <Stat
              label="Worst case in next 24h"
              value={peak.upper}
              tone={peak.upper > f.capacity ? 'bad' : peak.upper > f.capacity * 0.9 ? 'warn' : 'good'}
              hint={peak.upper > f.capacity ? `Exceeds capacity at +${peak.horizon_h}h` : `Within capacity (peak at +${peak.horizon_h}h)`}
            />
            <Stat label="As of" value={hourLabel(f.as_of)} hint={new Date(f.as_of).toLocaleDateString()} />
          </div>

          <Card variant="solid" className="p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-white">{UNIT_LABEL[unit]}: last 48h and forecast</h2>
              <Badge variant="slate" size="sm">synthetic evaluation data</Badge>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={chartData} margin={{ top: 8, right: 16, left: -8, bottom: 0 }}>
                  <CartesianGrid stroke={chartTheme.grid} strokeDasharray="3 3" />
                  <XAxis dataKey="t" type="number" domain={[-47, 24]} ticks={[-36, -24, -12, 0, 6, 12, 24]}
                    tickFormatter={(t: number) => (t === 0 ? 'now' : t > 0 ? `+${t}h` : `${t}h`)} stroke={chartTheme.axis} fontSize={11} />
                  <YAxis stroke={chartTheme.axis} fontSize={11} domain={['auto', 'auto']} />
                  <Tooltip contentStyle={chartTheme.tooltip} labelStyle={{ color: '#e2e8f0' }}
                    labelFormatter={(t: number) => (t === 0 ? 'Now' : t > 0 ? `Forecast +${t}h` : `${-t}h ago`)} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <ReferenceLine x={0} stroke="#334155" />
                  <Area dataKey="band" name="95% interval" stroke="none" fill="#06b6d4" fillOpacity={0.12} />
                  <Line dataKey="actual" name="Observed" stroke="#e2e8f0" dot={false} strokeWidth={1.5} />
                  <Line dataKey="lstm" name="LSTM" stroke="#a78bfa" strokeWidth={2} dot={{ r: 3 }} connectNulls />
                  <Line dataKey="xgboost" name="XGBoost" stroke="#22d3ee" strokeWidth={2} dot={{ r: 3 }} connectNulls />
                  <ReferenceLine y={f.capacity} stroke="#f43f5e" strokeDasharray="6 4" label={{ value: 'Staffed beds', fill: '#f43f5e', fontSize: 11, position: 'insideTopLeft' }} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card variant="solid" className="p-4 sm:p-6 overflow-x-auto">
            <h2 className="text-sm font-semibold text-white mb-1">Forecast by horizon</h2>
            <p className="text-xs text-slate-400 mb-4">Ensemble = mean of the two models; this is what the optimizer plans against.</p>
            <table className="w-full text-sm">
              <thead className="text-[11px] font-mono uppercase text-slate-500">
                <tr className="text-left">
                  <th className="py-2 pr-4">Horizon</th><th className="pr-4">LSTM</th><th className="pr-4">XGBoost</th>
                  <th className="pr-4">Ensemble</th><th className="pr-4">95% interval</th><th>vs capacity</th>
                </tr>
              </thead>
              <tbody className="text-slate-200 tabular-nums">
                {f.forecast.map((p) => (
                  <tr key={p.horizon_h} className="border-t border-slate-800/80">
                    <td className="py-2 pr-4 font-mono">+{p.horizon_h}h</td>
                    <td className="pr-4">{p.lstm}</td>
                    <td className="pr-4">{p.xgboost}</td>
                    <td className="pr-4 font-semibold">{p.ensemble}</td>
                    <td className="pr-4 text-slate-400">{p.lower} – {p.upper}</td>
                    <td>
                      <Badge size="sm" variant={p.upper > f.capacity ? 'rose' : p.ensemble > f.capacity * 0.9 ? 'amber' : 'emerald'}>
                        {Math.round((p.ensemble / f.capacity) * 100)}%
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </>
      )}

      {unitMetrics && (
        <Card variant="solid" className="p-4 sm:p-6 overflow-x-auto">
          <h2 className="text-sm font-semibold text-white mb-1">Model accuracy on held-out data ({UNIT_LABEL[unit]})</h2>
          <p className="text-xs text-slate-400 mb-4">
            Mean absolute error in beds over the last 60 days, which neither model saw during training. Persistence is the naive baseline
            ("occupancy stays the same"); a model is useful only if it beats it.
          </p>
          <table className="w-full text-sm">
            <thead className="text-[11px] font-mono uppercase text-slate-500">
              <tr className="text-left">
                <th className="py-2 pr-4">Model</th>
                {Object.keys(unitMetrics.XGBoost).map((h) => <th key={h} className="pr-4">MAE {h}</th>)}
                {Object.keys(unitMetrics.XGBoost).map((h) => <th key={h} className="pr-4">MAPE {h}</th>)}
              </tr>
            </thead>
            <tbody className="text-slate-200 tabular-nums">
              {(['LSTM', 'XGBoost', 'Persistence'] as const).map((m) => (
                <tr key={m} className="border-t border-slate-800/80">
                  <td className={`py-2 pr-4 ${m === 'Persistence' ? 'text-slate-500' : 'font-medium'}`}>{m}</td>
                  {Object.values(unitMetrics[m]).map((v, i) => <td key={i} className="pr-4">{v.MAE}</td>)}
                  {Object.values(unitMetrics[m]).map((v, i) => <td key={`p${i}`} className="pr-4 text-slate-400">{v.MAPE}%</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
};
