import React, { useState } from 'react';
import { Play } from 'lucide-react';
import { CartesianGrid, Legend, Line, LineChart, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { mlApi } from '../../services/mlApi';
import { useMLQuery } from '../../hooks/useMLQuery';
import { ScenarioResult, UNIT_LABEL, UnitId } from '../../types/ml';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { MLStatus, PageHeader, chartTheme } from '../../components/ml/MLStatus';

const UNITS: UnitId[] = ['ICU', 'GENERAL', 'EMERGENCY'];
type Params = { arrivals: Record<UnitId, number>; icuOffline: number; nurseShortage: number };
const EMPTY: Params = { arrivals: { ICU: 0, GENERAL: 0, EMERGENCY: 0 }, icuOffline: 0, nurseShortage: 0 };

const Slider: React.FC<{ label: string; value: number; max: number; suffix: string; onChange: (v: number) => void }> = ({ label, value, max, suffix, onChange }) => (
  <div>
    <div className="flex justify-between text-xs text-slate-300">
      <span>{label}</span><span className="font-mono text-cyan-300">{value}{suffix}</span>
    </div>
    <input type="range" min={0} max={max} value={value} onChange={(e) => onChange(Number(e.target.value))} className="w-full accent-cyan-500" />
  </div>
);

export const ScenariosPage: React.FC = () => {
  const presets = useMLQuery(() => mlApi.scenarioPresets());
  const [params, setParams] = useState<Params>(EMPTY);
  const [activePreset, setActivePreset] = useState<string | null>(null);
  const [result, setResult] = useState<ScenarioResult | null>(null);
  const [chartUnit, setChartUnit] = useState<UnitId>('EMERGENCY');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadPreset = (key: string) => {
    const p = presets.data![key];
    setActivePreset(key);
    setParams({ arrivals: { ...p.arrival_increase_pct }, icuOffline: p.icu_beds_offline, nurseShortage: p.nurse_shortage_pct });
  };

  const update = (next: Partial<Params>) => {
    setActivePreset(null);
    setParams({ ...params, ...next });
  };

  const run = async () => {
    setLoading(true);
    setError(null);
    try {
      setResult(await mlApi.scenario({
        arrival_increase_pct: params.arrivals, icu_beds_offline: params.icuOffline, nurse_shortage_pct: params.nurseShortage,
      }));
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  };

  const traj = result?.trajectory[chartUnit];
  const chartData = traj?.points.map((p) => ({ t: p.horizon_h, baseline: p.baseline, scenario: p.scenario }));

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        eyebrow="What-if simulation"
        title="Scenario Simulator"
        subtitle="Stress-test the next 24 hours without touching live operations: raise arrivals, take beds offline or remove staff, then see when each unit breaks and how the optimizer would respond."
      />

      <div className="grid lg:grid-cols-3 gap-6">
        <Card variant="solid" className="p-5 space-y-5">
          <div>
            <div className="text-[11px] font-mono uppercase tracking-wider text-slate-500 mb-2">Presets</div>
            <MLStatus loading={presets.loading} error={presets.error} onRetry={presets.reload} />
            <div className="grid grid-cols-2 gap-2">
              {presets.data && Object.entries(presets.data).map(([key, p]) => (
                <button key={key} onClick={() => loadPreset(key)}
                  className={`text-left px-3 py-2 rounded-lg text-xs border ${activePreset === key ? 'bg-cyan-500/15 border-cyan-500/40 text-cyan-200' : 'border-slate-800 text-slate-300 hover:border-slate-600'}`}>
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <div className="text-[11px] font-mono uppercase tracking-wider text-slate-500">Arrival increase</div>
            {UNITS.map((u) => (
              <Slider key={u} label={UNIT_LABEL[u]} value={params.arrivals[u]} max={150} suffix="%"
                onChange={(v) => update({ arrivals: { ...params.arrivals, [u]: v } })} />
            ))}
          </div>
          <div className="space-y-3">
            <div className="text-[11px] font-mono uppercase tracking-wider text-slate-500">Capacity loss</div>
            <Slider label="ICU beds offline" value={params.icuOffline} max={20} suffix=" beds" onChange={(v) => update({ icuOffline: v })} />
            <Slider label="Nurse shortage" value={params.nurseShortage} max={50} suffix="%" onChange={(v) => update({ nurseShortage: v })} />
          </div>

          <div className="flex gap-2">
            <Button onClick={run} disabled={loading} icon={<Play className="w-4 h-4" />} iconPosition="left" className="flex-1">
              {loading ? 'Simulating…' : 'Run simulation'}
            </Button>
            <Button variant="ghost" size="sm" onClick={() => { setParams(EMPTY); setActivePreset(null); }}>Reset</Button>
          </div>
        </Card>

        <div className="lg:col-span-2 space-y-6">
          <MLStatus loading={false} error={error} onRetry={run} />
          {!result && !error && (
            <Card variant="solid" className="p-10 text-center text-sm text-slate-400">Pick a preset or set parameters, then run the simulation.</Card>
          )}

          {result && traj && chartData && (
            <>
              <div className="grid sm:grid-cols-3 gap-3">
                {UNITS.map((u) => {
                  const b = result.bottlenecks[u];
                  const d = result.delta[u];
                  return (
                    <div key={u} className={`rounded-xl border p-4 ${b.breaches_capacity ? 'border-rose-500/40 bg-rose-500/5' : 'border-slate-800 bg-surface-100/60'}`}>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-white">{UNIT_LABEL[u]}</span>
                        <Badge size="sm" variant={b.breaches_capacity ? 'rose' : 'emerald'}>
                          {b.breaches_capacity ? `breach +${b.first_breach_in_h}h` : 'within capacity'}
                        </Badge>
                      </div>
                      <div className="mt-2 text-xs text-slate-400 space-y-0.5">
                        <div>Extra surge beds: <span className="text-slate-200">{d.extra_surge_beds}</span></div>
                        <div>Extra nurses: <span className="text-slate-200">{d.extra_nurses}</span></div>
                        <div>Patients without a bed: <span className={d.unmet_beds > 0 ? 'text-rose-400' : 'text-slate-200'}>{Math.ceil(d.unmet_beds)}</span></div>
                        <div>Nurse ratio: <span className={d.ratio_compliant ? 'text-emerald-400' : 'text-rose-400'}>{d.ratio_compliant ? 'maintained' : 'breached'}</span></div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <Card variant="solid" className="p-4 sm:p-6">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                  <h2 className="text-sm font-semibold text-white">Demand trajectory: baseline vs scenario</h2>
                  <div className="flex gap-1">
                    {UNITS.map((u) => (
                      <button key={u} onClick={() => setChartUnit(u)}
                        className={`px-3 py-1 rounded-lg text-xs border ${chartUnit === u ? 'border-cyan-500/40 text-cyan-300' : 'border-slate-800 text-slate-500'}`}>
                        {UNIT_LABEL[u]}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData} margin={{ top: 8, right: 16, left: -8, bottom: 0 }}>
                      <CartesianGrid stroke={chartTheme.grid} strokeDasharray="3 3" />
                      <XAxis dataKey="t" type="number" domain={[0, 24]} ticks={[0, 2, 6, 12, 24]} stroke={chartTheme.axis} fontSize={11}
                        tickFormatter={(t: number) => (t === 0 ? 'now' : `+${t}h`)} />
                      <YAxis stroke={chartTheme.axis} fontSize={11} domain={['auto', 'auto']} />
                      <Tooltip contentStyle={chartTheme.tooltip} labelStyle={{ color: '#e2e8f0' }} labelFormatter={(t: number) => (t === 0 ? 'Now' : `+${t}h`)} />
                      <Legend wrapperStyle={{ fontSize: 12 }} />
                      <Line dataKey="baseline" name="Baseline forecast" stroke="#64748b" strokeWidth={2} />
                      <Line dataKey="scenario" name="Scenario" stroke="#f59e0b" strokeWidth={2.5} />
                      <ReferenceLine y={traj.staffed_beds_scenario} stroke="#f43f5e" strokeDasharray="6 4"
                        label={{ value: `Staffed beds (${traj.staffed_beds_scenario})`, fill: '#f43f5e', fontSize: 11, position: 'insideTopLeft' }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              <Card variant="solid" className="p-4 sm:p-6">
                <h2 className="text-sm font-semibold text-white mb-1">Mitigation plan (re-optimized for the scenario peak)</h2>
                <p className="text-xs text-slate-500 mb-4">{result.scenario.method.replace(/_/g, ' ')} · {result.scenario.status} · {result.scenario.solve_ms} ms</p>
                {result.scenario.recommendations.length === 0 && <p className="text-sm text-slate-400">Existing capacity absorbs this scenario; no action needed.</p>}
                <ul className="space-y-2">
                  {result.scenario.recommendations.map((r, i) => (
                    <li key={i} className="flex flex-wrap items-start gap-2 text-sm">
                      <Badge size="sm" variant={r.type === 'ESCALATION' ? 'rose' : 'cyan'}>{r.type}</Badge>
                      <span className="text-slate-200">{r.action}</span>
                      {r.citations?.[0] && <span className="text-xs text-slate-500">({r.citations[0].sop_id})</span>}
                    </li>
                  ))}
                </ul>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
