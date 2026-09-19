import React, { useEffect, useRef, useState } from 'react';
import { Send } from 'lucide-react';
import { mlApi } from '../../services/mlApi';
import { RagAnswer } from '../../types/ml';
import { useMLQuery } from '../../hooks/useMLQuery';
import { useRouterStore } from '../../store/useRouterStore';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { PageHeader } from '../../components/ml/MLStatus';

const SUGGESTIONS = [
  'What is the nurse-to-patient ratio in the ICU?',
  'When can surge beds be opened?',
  'What happens if the scheduling system goes down?',
  'Can no-show predictions use a patient\'s age?',
  'The ICU is full. What is the escalation process?',
  'Who has to approve AI recommendations?',
];

type Turn = { question: string; answer?: RagAnswer; error?: string };

export const KnowledgeAssistantPage: React.FC = () => {
  const navigate = useRouterStore((s) => s.navigate);
  const health = useMLQuery(() => mlApi.health());
  const [turns, setTurns] = useState<Turn[]>([]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [turns]);

  const ask = async (question: string) => {
    const q = question.trim();
    if (q.length < 3 || busy) return;
    setInput('');
    setBusy(true);
    setTurns((t) => [...t, { question: q }]);
    try {
      const answer = await mlApi.ask(q);
      setTurns((t) => t.map((turn, i) => (i === t.length - 1 ? { ...turn, answer } : turn)));
    } catch (e) {
      const error = e instanceof Error ? e.message : String(e);
      setTurns((t) => t.map((turn, i) => (i === t.length - 1 ? { ...turn, error } : turn)));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        eyebrow="Retrieval-augmented generation"
        title="Policy Assistant"
        subtitle="Ask about hospital SOPs. Answers are grounded only in retrieved policy passages and cite their source. Operational questions only; this assistant gives no clinical advice."
        actions={
          <>
            {health.data && (
              <Badge variant={health.data.llm_enabled ? 'emerald' : 'amber'} size="sm">
                {health.data.llm_enabled ? 'LLM synthesis on' : 'Extractive mode (no API key)'}
              </Badge>
            )}
            <Button variant="outline" size="sm" onClick={() => navigate('/app/knowledge')}>SOP library</Button>
          </>
        }
      />

      <Card variant="solid" className="p-4 sm:p-6 min-h-[420px] flex flex-col">
        <div className="flex-1 space-y-5">
          {turns.length === 0 && (
            <div>
              <p className="text-sm text-slate-400 mb-3">Try one of these:</p>
              <div className="flex flex-wrap gap-2">
                {SUGGESTIONS.map((s) => (
                  <button key={s} onClick={() => ask(s)} className="text-left text-xs px-3 py-2 rounded-lg border border-slate-800 text-slate-300 hover:border-cyan-500/40 hover:text-cyan-200">
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}
          {turns.map((t, i) => (
            <div key={i} className="space-y-2">
              <div className="flex justify-end">
                <div className="max-w-[80%] rounded-2xl rounded-br-sm bg-cyan-500/15 border border-cyan-500/30 px-4 py-2 text-sm text-cyan-100">{t.question}</div>
              </div>
              <div className="max-w-[90%] rounded-2xl rounded-bl-sm bg-slate-900/60 border border-slate-800 px-4 py-3">
                {!t.answer && !t.error && <p className="text-sm text-slate-500 animate-pulse">Retrieving policy passages…</p>}
                {t.error && <p className="text-sm text-rose-400">{t.error}</p>}
                {t.answer && (
                  <>
                    <p className="text-sm text-slate-200 leading-relaxed whitespace-pre-wrap">{t.answer.answer}</p>
                    <div className="mt-3 flex flex-wrap items-center gap-1.5">
                      <Badge size="sm" variant={t.answer.mode === 'LLM' ? 'emerald' : 'slate'}>{t.answer.mode === 'LLM' ? 'LLM' : 'extractive'}</Badge>
                      {t.answer.citations.map((c, j) => (
                        <span key={j} title={c.excerpt} className="text-[11px] px-2 py-0.5 rounded-full border border-indigo-500/30 text-indigo-300 bg-indigo-500/10">
                          {c.sop_id} · {c.section} · {c.score}
                        </span>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}
          <div ref={endRef} />
        </div>

        <form onSubmit={(e) => { e.preventDefault(); ask(input); }} className="mt-6 flex gap-2">
          <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask about staffing, surge capacity, scheduling policy…"
            className="flex-1 rounded-xl bg-slate-900/60 border border-slate-800 px-4 py-2.5 text-sm text-slate-200 placeholder:text-slate-600" />
          <Button type="submit" disabled={busy || input.trim().length < 3} icon={<Send className="w-4 h-4" />}>Ask</Button>
        </form>
      </Card>
    </div>
  );
};
