import React from 'react';
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { mlApi } from '../../services/mlApi';
import { useMLQuery } from '../../hooks/useMLQuery';
import { UNIT_LABEL, UnitId } from '../../types/ml';
import { Badge } from '../../components/ui/Badge';
import { Card } from '../../components/ui/Card';
import { MLStatus, PageHeader, Stat, chartTheme } from '../../components/ml/MLStatus';

const UNITS: UnitId[] = ['ICU', 'GENERAL', 'EMERGENCY'];

/** Model evaluation report: everything here is read from ml-service/reports/metrics.json (produced by train.py). */
export const MLStudioPage: React.FC = () => {
  const { data: m, loading, error, reload } = useMLQuery(() => mlApi.metrics());

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        eyebrow="Model evaluation"
        title="Model Performance & Fairness"
        subtitle="Held-out test results for every trained model, produced by `python train.py`. Nothing on this page is hand-entered."
        actions={m && <Badge variant="slate" size="sm">trained {new Date(m.generated_at).toLocaleString()}</Badge>}
      />
      <MLStatus loading={loading} error={error} onRetry={reload} label="Loading evaluation report" />

      {m && (
        <>
          <Card variant="solid" className="p-4 sm:p-6">
            <h2 className="text-sm font-semibold text-white mb-1">Demand forecasting: mean absolute percentage error</h2>
            <p className="text-xs text-slate-400 mb-4">Last 60 days held out. Lower is better. Persistence = naive "no change" baseline.</p>
            <div className="grid md:grid-cols-3 gap-4">
              {UNITS.map((u) => {
                const f = m.forecasting[u];
                const data = Object.keys(f.XGBoost).map((h) => ({ h, LSTM: f.LSTM[h].MAPE, XGBoost: f.XGBoost[h].MAPE, Persistence: f.Persistence[h].MAPE }));
                return (
                  <div key={u}>
                    <div className="text-xs text-slate-300 mb-2">{UNIT_LABEL[u]}</div>
                    <div className="h-52">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
                          <CartesianGrid stroke={chartTheme.grid} strokeDasharray="3 3" vertical={false} />
                          <XAxis dataKey="h" stroke={chartTheme.axis} fontSize={11} />
                          <YAxis stroke={chartTheme.axis} fontSize={11} unit="%" />
                          <Tooltip contentStyle={chartTheme.tooltip} formatter={(v: number) => `${v}%`} />
                          <Legend wrapperStyle={{ fontSize: 11 }} />
                          <Bar dataKey="LSTM" fill="#a78bfa" radius={[3, 3, 0, 0]} />
                          <Bar dataKey="XGBoost" fill="#22d3ee" radius={[3, 3, 0, 0]} />
                          <Bar dataKey="Persistence" fill="#475569" radius={[3, 3, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          <div className="grid lg:grid-cols-2 gap-6">
            <Card variant="solid" className="p-4 sm:p-6 overflow-x-auto">
              <h2 className="text-sm font-semibold text-white mb-1">No-show classifier</h2>
              <p className="text-xs text-slate-400 mb-4">20% stratified hold-out. Threshold 0.25 for "high risk" (≈ base no-show rate).</p>
              <table className="w-full text-sm">
                <thead className="text-[11px] font-mono uppercase text-slate-500">
                  <tr className="text-left"><th className="py-2 pr-3">Model</th><th className="pr-3">ROC-AUC</th><th className="pr-3">Acc.</th><th className="pr-3">Prec.</th><th className="pr-3">Recall</th><th>F1</th></tr>
                </thead>
                <tbody className="tabular-nums text-slate-200">
                  {(['RandomForest', 'XGBoost'] as const).map((name) => {
                    const r = m.appointments.no_show[name];
                    return (
                      <tr key={name} className="border-t border-slate-800/80">
                        <td className="py-2 pr-3">{name} {m.appointments.no_show.selected === name && <Badge size="sm" variant="emerald">selected</Badge>}</td>
                        <td className="pr-3">{r.ROC_AUC}</td><td className="pr-3">{r.accuracy}</td><td className="pr-3">{r.precision}</td><td className="pr-3">{r.recall}</td><td>{r.F1}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <div className="mt-4 text-[11px] font-mono uppercase text-slate-500 mb-2">Top features</div>
              <div className="space-y-1.5">
                {Object.entries(m.appointments.no_show.top_features).map(([k, v]) => (
                  <div key={k} className="flex items-center gap-2 text-xs">
                    <span className="w-36 text-slate-300 truncate">{k.replace(/_/g, ' ')}</span>
                    <div className="flex-1 h-2 rounded bg-slate-800"><div className="h-2 rounded bg-cyan-500/70" style={{ width: `${v * 300}%` }} /></div>
                    <span className="w-10 text-right tabular-nums text-slate-400">{v}</span>
                  </div>
                ))}
              </div>
            </Card>

            <Card variant="solid" className="p-4 sm:p-6 overflow-x-auto">
              <h2 className="text-sm font-semibold text-white mb-1">Consultation-duration regressor</h2>
              <p className="text-xs text-slate-400 mb-4">Attended visits only. The baseline is what a static system assumes: a fixed slot per department.</p>
              <table className="w-full text-sm">
                <thead className="text-[11px] font-mono uppercase text-slate-500">
                  <tr className="text-left"><th className="py-2 pr-3">Model</th><th className="pr-3">MAE (min)</th><th>R²</th></tr>
                </thead>
                <tbody className="tabular-nums text-slate-200">
                  {(['RandomForest', 'XGBoost', 'FixedSlotBaseline'] as const).map((name) => (
                    <tr key={name} className="border-t border-slate-800/80">
                      <td className={`py-2 pr-3 ${name === 'FixedSlotBaseline' ? 'text-slate-500' : ''}`}>
                        {name} {m.appointments.duration.selected === name && <Badge size="sm" variant="emerald">selected</Badge>}
                      </td>
                      <td className="pr-3">{m.appointments.duration[name].MAE_min}</td>
                      <td>{m.appointments.duration[name].R2}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          </div>

          <Card variant="solid" className="p-4 sm:p-6 overflow-x-auto">
            <div className="flex flex-wrap items-center gap-3 mb-1">
              <h2 className="text-sm font-semibold text-white">Fairness audit</h2>
              <Badge variant={m.appointments.fairness.passed ? 'emerald' : 'rose'}>{m.appointments.fairness.passed ? 'PASSED' : 'FAILED'}</Badge>
            </div>
            <p className="text-xs text-slate-400 mb-4">
              Demographic parity: patients in every gender and age group must be flagged "high risk" at similar rates (gap ≤ {m.appointments.fairness.max_allowed_parity_gap * 100} points).
              Gender and age are not model inputs.
            </p>
            <div className="grid sm:grid-cols-3 gap-3 mb-5">
              <Stat label="Gender parity gap" value={`${(m.appointments.fairness.gender.demographic_parity_gap * 100).toFixed(1)} pts`} tone="good" />
              <Stat label="Age-band parity gap" value={`${(m.appointments.fairness.age_band.demographic_parity_gap * 100).toFixed(1)} pts`} tone="good" />
              <Stat
                label="If age were used"
                value={`${(m.appointments.age_ablation.age_parity_gap_with_age * 100).toFixed(1)} pts`}
                tone="bad"
                hint={`AUC ${m.appointments.age_ablation.ROC_AUC_without_age} → ${m.appointments.age_ablation.ROC_AUC_with_age}: too little gain for the bias`}
              />
            </div>
            <table className="w-full text-sm">
              <thead className="text-[11px] font-mono uppercase text-slate-500">
                <tr className="text-left"><th className="py-2 pr-3">Group</th><th className="pr-3">n</th><th className="pr-3">Flagged</th><th className="pr-3">Actual no-show</th><th>Caught (TPR)</th></tr>
              </thead>
              <tbody className="tabular-nums text-slate-200">
                {(['gender', 'age_band'] as const).flatMap((attr) =>
                  Object.entries(m.appointments.fairness[attr].groups).sort().map(([g, r]) => (
                    <tr key={attr + g} className="border-t border-slate-800/80">
                      <td className="py-2 pr-3">{attr === 'gender' ? `Gender ${g}` : `Age ${g}`}</td>
                      <td className="pr-3 text-slate-400">{r.n}</td>
                      <td className="pr-3">{(r.flag_rate * 100).toFixed(1)}%</td>
                      <td className="pr-3 text-slate-400">{(r.actual_no_show_rate * 100).toFixed(1)}%</td>
                      <td>{r.true_positive_rate === null ? '–' : `${(r.true_positive_rate * 100).toFixed(1)}%`}</td>
                    </tr>
                  )),
                )}
              </tbody>
            </table>
          </Card>
        </>
      )}
    </div>
  );
};
