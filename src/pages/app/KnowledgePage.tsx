import React, { useState } from 'react';
import { MessageSquare } from 'lucide-react';
import { mlApi } from '../../services/mlApi';
import { useMLQuery } from '../../hooks/useMLQuery';
import { useRouterStore } from '../../store/useRouterStore';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { MLStatus, PageHeader } from '../../components/ml/MLStatus';

export const KnowledgePage: React.FC = () => {
  const navigate = useRouterStore((s) => s.navigate);
  const docs = useMLQuery(() => mlApi.documents());
  const [open, setOpen] = useState<string | null>(null);
  const selected = docs.data?.find((d) => d.sop_id === open) ?? docs.data?.[0];

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        eyebrow="Policy corpus"
        title="SOP Library"
        subtitle="The standard operating procedures indexed by the RAG engine. Every optimizer recommendation is matched to one of these."
        actions={<Button size="sm" onClick={() => navigate('/app/knowledge/assistant')} icon={<MessageSquare className="w-3.5 h-3.5" />} iconPosition="left">Ask the assistant</Button>}
      />
      <MLStatus loading={docs.loading} error={docs.error} onRetry={docs.reload} />
      {docs.data && selected && (
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="space-y-2">
            {docs.data.map((d) => (
              <button key={d.sop_id} onClick={() => setOpen(d.sop_id)}
                className={`w-full text-left rounded-xl border px-4 py-3 ${selected.sop_id === d.sop_id ? 'border-cyan-500/40 bg-cyan-500/10' : 'border-slate-800 hover:border-slate-600'}`}>
                <div className="text-[11px] font-mono text-cyan-400">{d.sop_id}</div>
                <div className="text-sm text-slate-200">{d.title.split(': ')[1]}</div>
              </button>
            ))}
          </div>
          <Card variant="solid" className="lg:col-span-2 p-5 sm:p-6">
            <h2 className="text-lg font-semibold text-white">{selected.title}</h2>
            <div className="mt-4 space-y-5">
              {selected.sections.map((s) => (
                <div key={s.section}>
                  <h3 className="text-sm font-semibold text-cyan-300">{s.section}</h3>
                  <p className="mt-1 text-sm text-slate-300 leading-relaxed whitespace-pre-line">{s.text}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
