import React, { useState } from 'react';
import { ArrowRight, Cpu, Play } from 'lucide-react';
import { mlApi } from '../../services/mlApi';
import { AllocationResult, UNIT_LABEL, UnitId } from '../../types/ml';
import { useRouterStore } from '../../store/useRouterStore';
import { useMLStore } from '../../store/useMLStore';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { MLStatus, PageHeader, Stat } from '../../components/ml/MLStatus';

const HORIZONS = [2, 6, 12, 24];
const WEIGHT_LABELS: Record<string, string> = {
  unmet_demand: 'Unmet bed demand',
  ratio_violation: 'Nurse-ratio violation',
  overtime: 'Staff overtime',
  transfer: 'Transfer / opening cost',
  idle: 'Idle surge beds',
};
const DEFAULT_WEIGHTS = { unmet_demand: 10, ratio_violation: 8, overtime: 2, transfer: 1, idle: 0.5 };
const UNITS: UnitId[] = ['ICU', 'GENERAL', 'EMERGENCY'];

export const OptimizationPage: React.FC = () => {
  const navigate = useRouterStore((s) => s.navigate);
  const refreshPending = useMLStore((s) => s.refreshPending);
  const [horizon, setHorizon] = useState(12);
  const [conservative, setConservative] = useState(true);
  const [useSolver, setUseSolver] = useState(true);
  const [weights, setWeights] = useState<Record<string, number>>(DEFAULT_WEIGHTS);
  const [result, setResult] = useState<AllocationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const run = async () => {
    setLoading(true);
    setError(null);
    try {
      setResult(await mlApi.optimize({ horizon_h: horizon, conservative, weights, use_solver: useSolver }));
      refreshPending();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        eyebrow="Constraint optimization · Google OR-Tools"
        title="Resource Allocation (MILP)"
        subtitle="Turns the demand forecast into concrete actions: open surge beds, move float nurses, approve overtime and assign ventilators, while holding statutory nurse-to-patient ratios."
      />

      <div className="grid lg:grid-cols-3 gap-6">
        <Card variant="solid" className="p-5 space-y-5 lg:col-span-1">
          <div>
            <label className="text-[11px] font-mono uppercase tracking-wider text-slate-500">Plan for demand in</label>
            <div className="mt-2 grid grid-cols-4 gap-2">
              {HORIZONS.map((h) => (
                <button key={h} onClick={() => setHorizon(h)}
                  className={`py-2 rounded-lg text-sm border ${horizon === h ? 'bg-cyan-500/15 border-cyan-500/40 text-cyan-300' : 'border-slate-800 text-slate-400'}`}>
                  {h}h
                </button>
              ))}
            </div>
          </div>

          <label className="flex items-start gap-3 cursor-pointer">
            <input type="checkbox" checked={conservative} onChange={(e) => setConservative(e.target.checked)} className="mt-1 accent-cyan-500" />
            <span className="text-sm text-slate-300">
              Plan for worst case
              <span className="block text-xs text-slate-500">Use the upper 95% forecast bound instead of the mean.</span>
            </span>
          </label>

          <div className="space-y-3">
            <div className="text-[11px] font-mono uppercase tracking-wider text-slate-500">Objective weights (penalty per unit)</div>
            {Object.entries(WEIGHT_LABELS).map(([key, label]) => (
              <div key={key}>
                <div className="flex justify-between text-xs text-slate-300">
                  <span>{label}</span><span className="font-mono text-cyan-300">{weights[key]}</span>
                </div>
                <input type="range" min={0} max={20} step={0.5} value={weights[key]}
                  onChange={(e) => setWeights({ ...weights, [key]: Number(e.target.value) })}
                  className="w-full accent-cyan-500" />
              </div>
            ))}
          </div>

          <label className="flex items-start gap-3 cursor-pointer">
            <input type="checkbox" checked={!useSolver} onChange={(e) => setUseSolver(!e.target.checked)} className="mt-1 accent-amber-500" />
            <span className="text-sm text-slate-300">
              Simulate solver outage
              <span className="block text-xs text-slate-500">Falls back to deterministic priority rules (ICU → Emergency → General).</span>
            </span>
          </label>

          <div className="flex gap-2">
            <Button onClick={run} disabled={loading} icon={<Play className="w-4 h-4" />} iconPosition="left" className="flex-1">
              {loading ? 'Solving…' : 'Run optimizer'}
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setWeights(DEFAULT_WEIGHTS)}>Reset</Button>
          </div>
        </Card>

        <div className="lg:col-span-2 space-y-6">
          <MLStatus loading={false} error={error} onRetry={run} />
          {!result && !error && (
            <Card variant="solid" className="p-10 text-center text-slate-400 text-sm">
              <Cpu className="w-8 h-8 mx-auto mb-3 text-slate-600" />
              Choose a horizon and run the optimizer.
            </Card>
          )}

          {result && (
            <>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <Stat label="Method" value={<span className="text-base">{result.method.replace(/_/g, ' ')}</span>} tone={result.method.includes('FALLBACK') ? 'warn' : 'default'} />
                <Stat label="Status" value={<span className="text-base">{result.status}</span>} tone={result.status === 'OPTIMAL' ? 'good' : 'warn'} />
                <Stat label="Solve time" value={`${result.solve_ms} ms`} />
                <Stat label="Objective" value={result.objective ?? '—'} hint="weighted penalty, lower is better" />
              </div>

              <Card variant="solid" className="p-4 sm:p-6 overflow-x-auto">
                <h2 className="text-sm font-semibold text-white mb-4">Allocation by unit ({horizon}h {conservative ? 'worst-case' : 'expected'} demand)</h2>
                <table className="w-full text-sm">
                  <thead className="text-[11px] font-mono uppercase text-slate-500">
                    <tr className="text-left">
                      <th className="py-2 pr-3">Unit</th><th className="pr-3">Demand</th><th className="pr-3">Beds</th><th className="pr-3">+Surge</th>
                      <th className="pr-3">Nurses</th><th className="pr-3">+Float</th><th className="pr-3">+OT</th><th className="pr-3">Vents</th>
                      <th className="pr-3">Occupancy</th><th>Ratio</th>
                    </tr>
                  </thead>
                  <tbody className="text-slate-200 tabular-nums">
                    {UNITS.map((u) => {
                      const a = result.units[u];
                      return (
                        <tr key={u} className="border-t border-slate-800/80">
                          <td className="py-2 pr-3 font-medium">{UNIT_LABEL[u]}</td>
                          <td className="pr-3">{a.demand}</td>
                          <td className="pr-3">{a.beds}</td>
                          <td className="pr-3 text-cyan-300">{a.surge_beds || '–'}</td>
                          <td className="pr-3">{a.nurses}</td>
                          <td className="pr-3 text-cyan-300">{a.float_nurses || '–'}</td>
                          <td className="pr-3 text-amber-300">{a.overtime_nurses || '–'}</td>
                          <td className="pr-3">{a.ventilators}/{a.ventilators_needed}</td>
                          <td className="pr-3">
                            <span className="text-slate-500">{a.occupancy_before}%</span> → {a.occupancy_after}%
                            {a.unmet_beds > 0 && <span className="text-rose-400"> ({Math.ceil(a.unmet_beds)} unbedded)</span>}
                          </td>
                          <td>
                            <Badge size="sm" variant={a.ratio_compliant ? 'emerald' : 'rose'}>
                              1:{a.ratio} {a.ratio_compliant ? 'met' : 'breached'}
                            </Badge>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                <p className="mt-3 text-xs text-slate-500">
                  Pools used: {result.pool_usage.surge_beds}/{result.pools.surge_beds} surge beds · {result.pool_usage.float_nurses}/{result.pools.float_nurses} float nurses ·{' '}
                  {result.pool_usage.ventilators}/{result.pools.ventilators} ventilators
                </p>
              </Card>

              <Card variant="solid" className="p-4 sm:p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm font-semibold text-white">Recommended actions ({result.recommendations.length})</h2>
                  {result.recommendations.length > 0 && (
                    <Button variant="outline" size="sm" onClick={() => navigate('/app/recommendations')} icon={<ArrowRight className="w-3.5 h-3.5" />}>
                      Review & approve
                    </Button>
                  )}
                </div>
                {result.recommendations.length === 0 && <p className="text-sm text-slate-400">No changes needed: current capacity covers forecast demand.</p>}
                <ul className="space-y-3">
                  {result.recommendations.map((r) => (
                    <li key={r.id ?? r.action} className="rounded-xl border border-slate-800 p-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge size="sm" variant={r.type === 'ESCALATION' ? 'rose' : r.type === 'OVERTIME' ? 'amber' : 'cyan'}>{r.type}</Badge>
                        <span className="text-sm text-white font-medium">{r.action}</span>
                      </div>
                      <p className="mt-1 text-xs text-slate-400">{r.reason}</p>
                      {r.citations && r.citations.length > 0 && (
                        <p className="mt-1 text-xs text-slate-500">Policy: {r.citations.map((c) => `${c.sop_id} (${c.section})`).join(', ')}</p>
                      )}
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
