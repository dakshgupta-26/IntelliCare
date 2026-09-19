import React, { useMemo, useState } from 'react';
import { AlertOctagon, RotateCcw, Siren, UserX } from 'lucide-react';
import { mlApi, PatientInput } from '../../services/mlApi';
import { useMLQuery } from '../../hooks/useMLQuery';
import { Appointment, ClinicEvent, ClinicMetrics, ClinicSimMetrics, DoctorStatus, NoShowPrediction } from '../../types/ml';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { MLStatus, PageHeader } from '../../components/ml/MLStatus';

const DEPARTMENTS = ['General Medicine', 'Cardiology', 'Orthopedics', 'Pediatrics', 'Dermatology'];
const DAY_START = 9 * 60;
const DAY_END = 18 * 60; // 17:00 close + 1h overrun allowance
const toMin = (t: string) => { const [h, m] = t.split(':').map(Number); return h * 60 + m; };
const selectClass = 'rounded-lg bg-slate-900/60 border border-slate-800 px-3 py-2 text-sm text-slate-200';

// ------------------------------------------------------------------ metrics comparison
const METRIC_ROWS: { key: keyof ClinicSimMetrics; label: string; lowerIsBetter: boolean; unit?: string }[] = [
  { key: 'patients_seen', label: 'Patients seen', lowerIsBetter: false },
  { key: 'waitlisted', label: 'Could not be booked today', lowerIsBetter: true },
  { key: 'avg_wait_min', label: 'Average wait after booked time', lowerIsBetter: true, unit: 'min' },
  { key: 'p90_wait_min', label: '90th-percentile wait', lowerIsBetter: true, unit: 'min' },
  { key: 'doctor_utilization_pct', label: 'Doctor utilization', lowerIsBetter: false, unit: '%' },
  { key: 'doctor_overtime_min', label: 'Doctor overtime (total)', lowerIsBetter: true, unit: 'min' },
];

const MetricsComparison: React.FC<{ m: ClinicMetrics }> = ({ m }) => (
  <Card variant="solid" className="p-4 sm:p-6 overflow-x-auto">
    <h2 className="text-sm font-semibold text-white mb-1">Static fixed slots vs ML-optimized schedule</h2>
    <p className="text-xs text-slate-400 mb-4">
      Both schedules are replayed against the day's actual consultation lengths and no-shows, which the scheduler never sees.
      Static = fixed slot per department, first-come-first-served. Optimized = predicted durations + no-show-aware overbooking, solved with CP-SAT.
    </p>
    <table className="w-full text-sm">
      <thead className="text-[11px] font-mono uppercase text-slate-500">
        <tr className="text-left"><th className="py-2 pr-4">Metric</th><th className="pr-4">Static</th><th className="pr-4">Optimized</th><th>Change</th></tr>
      </thead>
      <tbody className="tabular-nums">
        {METRIC_ROWS.map(({ key, label, lowerIsBetter, unit }) => {
          const a = m.static_fixed_slots[key];
          const b = m.optimized[key];
          const diff = +(b - a).toFixed(1);
          const better = diff !== 0 && (lowerIsBetter ? diff < 0 : diff > 0);
          return (
            <tr key={key} className="border-t border-slate-800/80">
              <td className="py-2 pr-4 text-slate-300">{label}</td>
              <td className="pr-4 text-slate-400">{a}{unit && ` ${unit}`}</td>
              <td className="pr-4 text-white font-medium">{b}{unit && ` ${unit}`}</td>
              <td className={diff === 0 ? 'text-slate-500' : better ? 'text-emerald-400' : 'text-rose-400'}>
                {diff > 0 ? '+' : ''}{diff}{unit && ` ${unit}`}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
    <p className="mt-3 text-xs text-slate-500">
      Solver: {m.solver.method.replace(/_/g, ' ')} · {m.solver.status} · {m.solver.solve_ms} ms · {m.predicted_high_risk} patients flagged high no-show risk
    </p>
  </Card>
);

// ------------------------------------------------------------------ doctor timeline
const DoctorTimeline: React.FC<{ appointments: Appointment[]; doctors: DoctorStatus[]; clock: string; onCancel: (id: string) => void }> = ({
  appointments, doctors, clock, onCancel,
}) => {
  const [dept, setDept] = useState(DEPARTMENTS[0]);
  const pct = (min: number) => ((min - DAY_START) / (DAY_END - DAY_START)) * 100;
  const byDoctor = useMemo(() => {
    const map: Record<string, Appointment[]> = {};
    appointments.filter((a) => a.status === 'SCHEDULED' && a.doctor).forEach((a) => (map[a.doctor!] ||= []).push(a));
    return map;
  }, [appointments]);
  const waitlisted = appointments.filter((a) => a.status === 'WAITLISTED' && a.department === dept);

  return (
    <Card variant="solid" className="p-4 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <h2 className="text-sm font-semibold text-white">Doctor schedules</h2>
        <select value={dept} onChange={(e) => setDept(e.target.value)} className={selectClass}>
          {DEPARTMENTS.map((d) => <option key={d}>{d}</option>)}
        </select>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[720px]">
          <div className="relative h-5 ml-36 text-[10px] font-mono text-slate-500">
            {Array.from({ length: 10 }, (_, i) => DAY_START + i * 60).map((m) => (
              <span key={m} className="absolute -translate-x-1/2" style={{ left: `${pct(m)}%` }}>{String(m / 60).padStart(2, '0')}:00</span>
            ))}
          </div>
          {doctors.filter((d) => d.department === dept).map((d) => (
            <div key={d.doctor} className="flex items-center gap-2 py-1.5">
              <div className="w-36 shrink-0">
                <div className={`text-sm ${d.available ? 'text-slate-200' : 'text-slate-600 line-through'}`}>{d.doctor}</div>
                <div className="text-[10px] text-slate-500">{d.appointments} appts · {d.booked_min} min</div>
              </div>
              <div className="relative flex-1 h-9 rounded-md bg-slate-900/60 border border-slate-800">
                <div className="absolute top-0 bottom-0 bg-slate-950/70" style={{ left: `${pct(17 * 60)}%`, right: 0 }} title="After clinic hours" />
                <div className="absolute top-0 bottom-0 w-px bg-cyan-400/80 z-10" style={{ left: `${pct(toMin(clock))}%` }} title={`Now ${clock}`} />
                {(byDoctor[d.doctor] || []).map((a) => (
                  <button
                    key={a.id}
                    onClick={() => a.priority !== 'EMERGENCY' && onCancel(a.id)}
                    title={`${a.id} ${a.patient}\n${a.start} · ${a.slot_min} min slot (predicted ${a.predicted_duration} min)\nNo-show risk ${(a.no_show_prob * 100).toFixed(0)}% · ${a.priority}${a.priority !== 'EMERGENCY' ? '\nClick to cancel' : ''}`}
                    className={`absolute top-1 bottom-1 rounded-sm border text-[9px] leading-none overflow-hidden transition-opacity hover:opacity-80 ${
                      a.priority === 'EMERGENCY' ? 'bg-rose-500/80 border-rose-300'
                        : a.priority === 'URGENT' ? 'bg-amber-500/60 border-amber-300/60'
                        : a.high_risk ? 'bg-violet-500/40 border-violet-300/50 border-dashed'
                        : 'bg-cyan-500/35 border-cyan-300/40'
                    }`}
                    style={{ left: `${pct(a.start_min!)}%`, width: `${((a.slot_min ?? 5) / (DAY_END - DAY_START)) * 100}%` }}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-3 text-[11px] text-slate-400">
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-cyan-500/35 border border-cyan-300/40" />Routine</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-violet-500/40 border border-dashed border-violet-300/50" />High no-show risk (shortened slot)</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-amber-500/60" />Urgent</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-rose-500/80" />Emergency override</span>
        <span className="flex items-center gap-1.5"><span className="w-px h-3 bg-cyan-400" />Current time</span>
        <span className="text-slate-500">Hover a block for details; click to cancel it.</span>
      </div>
      {waitlisted.length > 0 && (
        <p className="mt-3 text-xs text-amber-300">
          {waitlisted.length} {dept} patient{waitlisted.length > 1 ? 's' : ''} waitlisted: {waitlisted.slice(0, 8).map((a) => a.id).join(', ')}{waitlisted.length > 8 ? '…' : ''}
        </p>
      )}
    </Card>
  );
};

// ------------------------------------------------------------------ event log
const EventLog: React.FC<{ events: ClinicEvent[] }> = ({ events }) => (
  <Card variant="solid" className="p-4 sm:p-6">
    <h2 className="text-sm font-semibold text-white mb-3">Rescheduling log</h2>
    {events.length === 0 && <p className="text-sm text-slate-400">No disruptions yet. Trigger one above to see the schedule adapt.</p>}
    <ul className="space-y-3">
      {[...events].reverse().map((e, i) => {
        const counts = e.changes.reduce<Record<string, number>>((acc, c) => ({ ...acc, [c.change]: (acc[c.change] || 0) + 1 }), {});
        return (
          <li key={i} className="rounded-xl border border-slate-800 p-3">
            <div className="flex flex-wrap items-center gap-2">
              <Badge size="sm" variant={e.type === 'EMERGENCY_OVERRIDE' ? 'rose' : e.type === 'DOCTOR_UNAVAILABLE' ? 'amber' : 'slate'}>{e.type.replace(/_/g, ' ')}</Badge>
              <span className="text-xs font-mono text-slate-500">{e.at}</span>
              <span className="text-sm text-slate-200">{e.detail}</span>
            </div>
            <p className="mt-1 text-xs text-slate-400">
              Re-solved in {e.solve_ms} ms ({e.method.replace(/_/g, ' ')}) ·{' '}
              {Object.entries(counts).map(([k, v]) => `${v} ${k.toLowerCase()}`).join(', ') || 'no other bookings affected'}
            </p>
            {e.changes.filter((c) => c.change === 'MOVED').slice(0, 4).map((c) => (
              <p key={c.id} className="text-[11px] text-slate-500 font-mono">{c.id}: {c.from} → {c.to}</p>
            ))}
          </li>
        );
      })}
    </ul>
  </Card>
);

// ------------------------------------------------------------------ single-patient predictor
const DEFAULT_PATIENT: PatientInput = {
  department: 'General Medicine', age: 34, gender: 'F', lead_days: 14, sms_reminder: true, first_visit: false,
  prior_appointments: 4, prior_no_shows: 1, distance_km: 8, chronic_conditions: 0, weekday: 0, slot_hour: 9, insurance: true,
};

const NoShowPredictor: React.FC = () => {
  const [p, setP] = useState<PatientInput>(DEFAULT_PATIENT);
  const [result, setResult] = useState<NoShowPrediction | null>(null);
  const [error, setError] = useState<string | null>(null);
  const num = (k: keyof PatientInput) => (e: React.ChangeEvent<HTMLInputElement>) => setP({ ...p, [k]: Number(e.target.value) });
  const bool = (k: keyof PatientInput) => (e: React.ChangeEvent<HTMLInputElement>) => setP({ ...p, [k]: e.target.checked });

  const predict = async () => {
    setError(null);
    try {
      setResult(await mlApi.predictPatient(p));
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  };

  const field = (label: string, k: keyof PatientInput, min = 0, max = 100) => (
    <label className="text-xs text-slate-400">
      {label}
      <input type="number" min={min} max={max} value={p[k] as number} onChange={num(k)} className={`mt-1 w-full ${selectClass}`} />
    </label>
  );

  return (
    <Card variant="solid" className="p-4 sm:p-6">
      <h2 className="text-sm font-semibold text-white mb-1">Predict a single booking</h2>
      <p className="text-xs text-slate-400 mb-4">
        Random Forest no-show classifier + XGBoost duration regressor. Age and gender are shown for the record but are deliberately
        not model inputs (fairness requirement, SOP-OPD-05).
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <label className="text-xs text-slate-400 col-span-2">
          Department
          <select value={p.department} onChange={(e) => setP({ ...p, department: e.target.value })} className={`mt-1 w-full ${selectClass}`}>
            {DEPARTMENTS.map((d) => <option key={d}>{d}</option>)}
          </select>
        </label>
        {field('Age', 'age', 0, 110)}
        {field('Days booked ahead', 'lead_days', 0, 120)}
        {field('Previous appointments', 'prior_appointments', 0, 50)}
        {field('Previous no-shows', 'prior_no_shows', 0, 50)}
        {field('Distance (km)', 'distance_km', 0, 200)}
        {field('Chronic conditions', 'chronic_conditions', 0, 10)}
        {field('Slot hour (9–16)', 'slot_hour', 9, 16)}
        <label className="text-xs text-slate-400">
          Weekday
          <select value={p.weekday} onChange={(e) => setP({ ...p, weekday: Number(e.target.value) })} className={`mt-1 w-full ${selectClass}`}>
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d, i) => <option key={d} value={i}>{d}</option>)}
          </select>
        </label>
      </div>
      <div className="mt-3 flex flex-wrap gap-4 text-sm text-slate-300">
        {([['sms_reminder', 'SMS reminder'], ['first_visit', 'First visit'], ['insurance', 'Insured']] as const).map(([k, label]) => (
          <label key={k} className="flex items-center gap-2"><input type="checkbox" checked={p[k] as boolean} onChange={bool(k)} className="accent-cyan-500" />{label}</label>
        ))}
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-4">
        <Button size="sm" onClick={predict}>Predict</Button>
        {error && <span className="text-xs text-rose-400">{error}</span>}
        {result && (
          <div className="flex flex-wrap gap-2 text-sm">
            <Badge variant={result.high_risk ? 'rose' : 'emerald'}>No-show risk {(result.no_show_prob * 100).toFixed(0)}%{result.high_risk ? ' (high)' : ''}</Badge>
            <Badge variant="cyan">Predicted consult {result.predicted_duration_min} min</Badge>
            <Badge variant="indigo">Slot to reserve {result.recommended_slot_min} min</Badge>
          </div>
        )}
      </div>
    </Card>
  );
};

// ------------------------------------------------------------------ page
export const AppointmentsPage: React.FC = () => {
  const schedule = useMLQuery(() => mlApi.schedule());
  const metrics = useMLQuery(() => mlApi.clinicMetrics());
  const doctors = useMLQuery(() => mlApi.doctors());
  const [clock, setClock] = useState('11:00');
  const [emDept, setEmDept] = useState(DEPARTMENTS[1]);
  const [offDoctor, setOffDoctor] = useState('');
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const refresh = () => Promise.all([schedule.reload(), metrics.reload(), doctors.reload()]);

  const act = async (label: string, fn: () => Promise<unknown>) => {
    setBusy(label);
    setError(null);
    try {
      await mlApi.setClock(clock);
      await fn();
      await refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(null);
    }
  };

  const availableDoctors = doctors.data?.filter((d) => d.available) ?? [];

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        eyebrow="Predictive scheduling · OR-Tools CP-SAT"
        title="Outpatient Appointments"
        subtitle="Today's OPD schedule is built from predicted consultation durations and no-show risk, and re-optimized when something changes: cancellations, emergencies or a doctor becoming unavailable."
        actions={
          <Button variant="ghost" size="sm" icon={<RotateCcw className="w-3.5 h-3.5" />} iconPosition="left" disabled={!!busy}
            onClick={() => act('reset', () => mlApi.resetClinic())}>
            {busy === 'reset' ? 'Resetting…' : 'Reset day'}
          </Button>
        }
      />

      <MLStatus loading={metrics.loading && !metrics.data} error={metrics.error ?? schedule.error} onRetry={refresh} label="Building today's schedule" />
      {metrics.data && <MetricsComparison m={metrics.data} />}

      <Card variant="solid" className="p-4 sm:p-6">
        <h2 className="text-sm font-semibold text-white mb-1">Simulate a disruption</h2>
        <p className="text-xs text-slate-400 mb-4">
          Appointments that already started stay fixed; everything later is re-optimized with minimal changes to confirmed bookings.
          Emergencies bypass the queue entirely (SOP-EMG-06).
        </p>
        <div className="grid md:grid-cols-5 gap-4 items-end">
          <label className="text-xs text-slate-400">
            Current time
            <input type="time" min="09:00" max="17:00" value={clock} onChange={(e) => setClock(e.target.value)} className={`mt-1 w-full ${selectClass}`} />
          </label>
          <div className="flex gap-2 items-end md:col-span-2">
            <label className="text-xs text-slate-400 flex-1">
              Emergency in
              <select value={emDept} onChange={(e) => setEmDept(e.target.value)} className={`mt-1 w-full ${selectClass}`}>
                {DEPARTMENTS.map((d) => <option key={d}>{d}</option>)}
              </select>
            </label>
            <Button variant="danger" size="sm" disabled={!!busy} icon={<Siren className="w-3.5 h-3.5" />} iconPosition="left"
              onClick={() => act('emergency', () => mlApi.emergency(emDept))}>
              {busy === 'emergency' ? '…' : 'Add'}
            </Button>
          </div>
          <div className="flex gap-2 items-end md:col-span-2">
            <label className="text-xs text-slate-400 flex-1">
              Doctor becomes unavailable
              <select value={offDoctor} onChange={(e) => setOffDoctor(e.target.value)} className={`mt-1 w-full ${selectClass}`}>
                <option value="">Select doctor…</option>
                {availableDoctors.map((d) => <option key={d.doctor} value={d.doctor}>{d.doctor} ({d.department})</option>)}
              </select>
            </label>
            <Button variant="secondary" size="sm" disabled={!!busy || !offDoctor} icon={<UserX className="w-3.5 h-3.5" />} iconPosition="left"
              onClick={() => act('doctor', async () => { await mlApi.doctorUnavailable(offDoctor); setOffDoctor(''); })}>
              {busy === 'doctor' ? '…' : 'Apply'}
            </Button>
          </div>
        </div>
        {busy && <p className="mt-3 text-xs text-cyan-300">Re-optimizing schedule (solver time limit 3 s)…</p>}
        {error && <p className="mt-3 text-xs text-rose-400 flex items-center gap-1.5"><AlertOctagon className="w-3.5 h-3.5" />{error}</p>}
      </Card>

      {schedule.data && doctors.data && (
        <DoctorTimeline appointments={schedule.data.appointments} doctors={doctors.data} clock={schedule.data.clock}
          onCancel={(id) => { if (window.confirm(`Cancel appointment ${id}?`)) act('cancel', () => mlApi.cancelAppointment(id)); }} />
      )}

      <div className="grid xl:grid-cols-2 gap-6">
        <NoShowPredictor />
        {schedule.data && <EventLog events={schedule.data.events} />}
      </div>
    </div>
  );
};
