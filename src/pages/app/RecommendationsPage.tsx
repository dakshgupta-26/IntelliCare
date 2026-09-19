import React, { useEffect, useState } from 'react';
import { Check, Pencil, ShieldCheck, X } from 'lucide-react';
import { mlApi } from '../../services/mlApi';
import { useMLQuery } from '../../hooks/useMLQuery';
import { Recommendation, UNIT_LABEL } from '../../types/ml';
import { useAuthStore } from '../../store/useAuthStore';
import { useMLStore } from '../../store/useMLStore';
import { useRouterStore } from '../../store/useRouterStore';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { MLStatus, PageHeader } from '../../components/ml/MLStatus';

const STATUS_VARIANT = { PENDING: 'amber', APPROVED: 'emerald', MODIFIED: 'cyan', REJECTED: 'rose', EXPIRED: 'slate' } as const;

const RecommendationCard: React.FC<{ rec: Recommendation; actor: string; onDone: () => void }> = ({ rec, actor, onDone }) => {
  const [note, setNote] = useState('');
  const [quantity, setQuantity] = useState(rec.quantity);
  const [modifying, setModifying] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const pending = rec.status === 'PENDING';

  const decide = async (decision: 'APPROVE' | 'REJECT' | 'MODIFY') => {
    if (decision === 'REJECT' && !note.trim()) {
      setError('Please give a reason for rejecting.');
      return;
    }
    setBusy(true);
    setError(null);
    try {
      await mlApi.decide(rec.id!, { decision, actor, note, quantity: decision === 'MODIFY' ? quantity : undefined });
      onDone();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  };

  return (
    <Card variant="solid" className="p-4 sm:p-5">
      <div className="flex flex-wrap items-center gap-2">
        <Badge size="sm" variant={STATUS_VARIANT[rec.status ?? 'PENDING']}>{rec.status}</Badge>
        <Badge size="sm" variant={rec.type === 'ESCALATION' ? 'rose' : 'slate'}>{rec.type}</Badge>
        <span className="text-xs text-slate-500">{UNIT_LABEL[rec.unit]} · {rec.horizon_h}h plan · {rec.id}</span>
      </div>
      <h3 className="mt-2 text-base font-semibold text-white">{rec.action}</h3>
      <p className="mt-1 text-sm text-slate-300">{rec.reason}</p>

      {rec.justification && (
        <div className="mt-3 rounded-lg border border-slate-800 bg-slate-900/40 p-3">
          <div className="text-[11px] font-mono uppercase tracking-wider text-slate-500 mb-1">Policy grounding (RAG)</div>
          <p className="text-xs text-slate-300 leading-relaxed">{rec.justification}</p>
          {rec.citations && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {rec.citations.map((c, i) => <Badge key={i} size="sm" variant="indigo">{c.sop_id} · {c.section}</Badge>)}
            </div>
          )}
        </div>
      )}

      {pending ? (
        <div className="mt-4 space-y-3">
          <input
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Note (required to reject)"
            className="w-full rounded-lg bg-slate-900/60 border border-slate-800 px-3 py-2 text-sm text-slate-200 placeholder:text-slate-600"
          />
          {modifying && (
            <div className="flex items-center gap-3 text-sm text-slate-300">
              Approve a different quantity:
              <input type="number" min={0} value={quantity} onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-24 rounded-lg bg-slate-900/60 border border-slate-800 px-3 py-1.5" />
              <Button size="sm" onClick={() => decide('MODIFY')} disabled={busy}>Confirm</Button>
            </div>
          )}
          {error && <p className="text-xs text-rose-400">{error}</p>}
          <div className="flex flex-wrap gap-2">
            <Button size="sm" onClick={() => decide('APPROVE')} disabled={busy} icon={<Check className="w-3.5 h-3.5" />} iconPosition="left">Approve</Button>
            <Button size="sm" variant="secondary" onClick={() => setModifying(!modifying)} disabled={busy} icon={<Pencil className="w-3.5 h-3.5" />} iconPosition="left">Modify</Button>
            <Button size="sm" variant="danger" onClick={() => decide('REJECT')} disabled={busy} icon={<X className="w-3.5 h-3.5" />} iconPosition="left">Reject</Button>
          </div>
        </div>
      ) : (
        rec.decided_by && (
          <p className="mt-3 text-xs text-slate-400">
            {rec.status} by {rec.decided_by} at {new Date(rec.decided_at!).toLocaleString()}
            {rec.status === 'MODIFIED' && ` (quantity → ${rec.quantity})`}{rec.note && ` · "${rec.note}"`}
          </p>
        )
      )}
    </Card>
  );
};

export const RecommendationsPage: React.FC = () => {
  const navigate = useRouterStore((s) => s.navigate);
  const actor = useAuthStore((s) => s.currentUser?.name ?? 'Administrator');
  const refreshPending = useMLStore((s) => s.refreshPending);
  const [filter, setFilter] = useState<'PENDING' | 'ALL'>('PENDING');
  const recs = useMLQuery(() => mlApi.recommendations(filter === 'PENDING' ? 'PENDING' : undefined), [filter]);
  const audit = useMLQuery(() => mlApi.audit());

  useEffect(() => {
    refreshPending();
  }, [recs.data, refreshPending]);

  const onDone = () => {
    recs.reload();
    audit.reload();
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        eyebrow="Human-in-the-loop"
        title="Recommendation Review"
        subtitle="Nothing the optimizer suggests is executed automatically. An administrator approves, modifies or rejects each action, and every decision is written to the audit log (SOP-GOV-07)."
        actions={<Button variant="outline" size="sm" onClick={() => navigate('/app/optimization')}>Run optimizer</Button>}
      />

      <div className="flex gap-2">
        {(['PENDING', 'ALL'] as const).map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-sm border ${filter === f ? 'bg-cyan-500/15 border-cyan-500/40 text-cyan-300' : 'border-slate-800 text-slate-400'}`}>
            {f === 'PENDING' ? 'Pending' : 'All'}
          </button>
        ))}
      </div>

      <MLStatus loading={recs.loading && !recs.data} error={recs.error} onRetry={recs.reload} />
      {recs.data && recs.data.length === 0 && (
        <Card variant="solid" className="p-10 text-center text-sm text-slate-400">
          <ShieldCheck className="w-8 h-8 mx-auto mb-3 text-slate-600" />
          No {filter === 'PENDING' ? 'pending ' : ''}recommendations. Run the optimizer to generate some.
        </Card>
      )}
      <div className="grid xl:grid-cols-2 gap-4">
        {recs.data?.map((r) => <RecommendationCard key={r.id} rec={r} actor={actor} onDone={onDone} />)}
      </div>

      <Card variant="solid" className="p-4 sm:p-6 overflow-x-auto">
        <h2 className="text-sm font-semibold text-white mb-4">Decision audit log</h2>
        {audit.data && audit.data.length === 0 && <p className="text-sm text-slate-400">No decisions yet.</p>}
        {audit.data && audit.data.length > 0 && (
          <table className="w-full text-sm">
            <thead className="text-[11px] font-mono uppercase text-slate-500">
              <tr className="text-left"><th className="py-2 pr-4">Time</th><th className="pr-4">Actor</th><th className="pr-4">Decision</th><th className="pr-4">Action</th><th className="pr-4">Qty</th><th>Note</th></tr>
            </thead>
            <tbody className="text-slate-300">
              {audit.data.map((a, i) => (
                <tr key={i} className="border-t border-slate-800/80">
                  <td className="py-2 pr-4 whitespace-nowrap text-slate-500">{new Date(a.at).toLocaleTimeString()}</td>
                  <td className="pr-4">{a.actor}</td>
                  <td className="pr-4"><Badge size="sm" variant={a.action === 'REJECT' ? 'rose' : a.action === 'MODIFY' ? 'cyan' : 'emerald'}>{a.action}</Badge></td>
                  <td className="pr-4">{a.detail}</td>
                  <td className="pr-4 tabular-nums">{a.quantity_before === a.quantity_after ? a.quantity_after : `${a.quantity_before} → ${a.quantity_after}`}</td>
                  <td className="text-slate-400">{a.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>
    </div>
  );
};
