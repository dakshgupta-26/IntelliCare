import React, { useState } from 'react';
import { Workflow, Key, CheckCircle2, Copy, Trash2, Plus, ShieldCheck } from 'lucide-react';
import { Modal } from '../../../ui/Modal';
import { Input } from '../../../ui/Input';
import { Button } from '../../../ui/Button';

interface IntegrationsSectionProps {
  onMarkDirty: () => void;
}

interface ApiKeyItem {
  id: string;
  name: string;
  maskedKey: string;
  created: string;
  lastUsed: string;
  scope: string;
}

export const IntegrationsSection: React.FC<IntegrationsSectionProps> = ({ onMarkDirty }) => {
  const [apiKeys, setApiKeys] = useState<ApiKeyItem[]>([
    {
      id: 'key-01',
      name: 'EHR Real-Time Telemetry Ingest',
      maskedKey: 'ic_live_••••••••••••88f2',
      created: '2026-02-14',
      lastUsed: '4 minutes ago',
      scope: 'telemetry:write, beds:read'
    },
    {
      id: 'key-02',
      name: 'Regional EMS Mutual Aid Sync',
      maskedKey: 'ic_live_••••••••••••33b1',
      created: '2026-03-01',
      lastUsed: 'Yesterday',
      scope: 'forecast:read, beds:read'
    }
  ]);

  const [isCreateKeyOpen, setIsCreateKeyOpen] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [newKeyCreated, setNewKeyCreated] = useState<string | null>(null);

  const handleGenerateKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyName) return;

    const rawSecret = `ic_live_${Math.random().toString(36).substring(2, 12)}_${Math.random().toString(36).substring(2, 10)}`;
    const masked = `ic_live_••••••••••••${rawSecret.slice(-4)}`;

    setApiKeys([
      ...apiKeys,
      {
        id: `key-${Date.now()}`,
        name: newKeyName,
        maskedKey: masked,
        created: 'Just now',
        lastUsed: 'Never',
        scope: 'telemetry:read, optimize:run'
      }
    ]);

    setNewKeyCreated(rawSecret);
    setNewKeyName('');
    onMarkDirty();
  };

  const handleRevokeKey = (id: string) => {
    if (confirm('Revoke this API Key immediately? All external services using this token will fail authentication.')) {
      setApiKeys(apiKeys.filter((k) => k.id !== id));
      onMarkDirty();
    }
  };

  return (
    <div className="space-y-6">
      {/* Healthcare Systems & EHR Connectors */}
      <div className="p-6 rounded-3xl bg-[#070D1A] border border-white/[0.08] space-y-4">
        <div className="pb-3 border-b border-white/[0.06]">
          <h3 className="text-base font-display font-bold text-white flex items-center gap-2">
            <Workflow className="w-5 h-5 text-cyan-400" />
            <span>Healthcare Interoperability & EHR Connectors</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Enterprise clinical integrations connecting bed states, ADT feeds, and patient flow telemetry.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {/* HL7 FHIR R4 */}
          <div className="p-4 rounded-2xl bg-black/40 border border-white/[0.06] flex items-start justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-display font-bold text-sm text-white">HL7 FHIR R4 Gateway</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 font-bold border border-emerald-500/30">
                  CONNECTED
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono">
                Endpoint: <span className="text-slate-200">https://fhir.hospital.org/r4/metro</span>
              </p>
              <p className="text-[11px] text-slate-500 font-mono">
                Resources: Bed, Encounter, Practitioner, Observation
              </p>
            </div>
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse mt-1" />
          </div>

          {/* Epic Systems */}
          <div className="p-4 rounded-2xl bg-black/40 border border-white/[0.06] flex items-start justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-display font-bold text-sm text-white">Epic Systems Interconnect</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 font-bold border border-emerald-500/30">
                  ACTIVE
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono">
                App Orchard Integration: Verified Level 3
              </p>
              <p className="text-[11px] text-slate-500 font-mono">
                ADT Feed Latency: ~140ms continuous
              </p>
            </div>
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse mt-1" />
          </div>
        </div>
      </div>

      {/* Developer API Keys Management */}
      <div className="p-6 rounded-3xl bg-[#070D1A] border border-white/[0.08] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/[0.06]">
          <div>
            <h3 className="text-base font-display font-bold text-white flex items-center gap-2">
              <Key className="w-5 h-5 text-indigo-400" />
              <span>Developer API Access Tokens</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Cryptographically signed tokens for programmatic solver ingestion and external microservices.
            </p>
          </div>

          <button
            onClick={() => {
              setNewKeyCreated(null);
              setIsCreateKeyOpen(true);
            }}
            className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-bold transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Generate API Token</span>
          </button>
        </div>

        <div className="space-y-3">
          {apiKeys.map((key) => (
            <div
              key={key.id}
              className="p-4 rounded-2xl bg-black/40 border border-white/[0.06] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-display font-bold text-sm text-white">{key.name}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.06] text-slate-400">
                    Scope: {key.scope}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs font-mono text-slate-400 flex-wrap">
                  <span className="text-cyan-300 font-bold tracking-wider">{key.maskedKey}</span>
                  <span>•</span>
                  <span>Created: {key.created}</span>
                  <span>•</span>
                  <span>Last used: {key.lastUsed}</span>
                </div>
              </div>

              <button
                onClick={() => handleRevokeKey(key.id)}
                className="self-end sm:self-auto inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/[0.04] hover:bg-rose-500/20 text-slate-400 hover:text-rose-300 text-xs font-mono transition-colors cursor-pointer border border-white/[0.06] hover:border-rose-500/30"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Revoke</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Generate API Key Modal */}
      {isCreateKeyOpen && (
        <Modal
          isOpen={true}
          onClose={() => setIsCreateKeyOpen(false)}
          title="Generate Service API Key"
          subtitle="Tokens inherit restricted hospital tenant permissions."
        >
          {newKeyCreated ? (
            <div className="space-y-4 py-2 text-xs font-mono">
              <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>API token successfully generated. Copy it now — it will never be displayed again.</span>
              </div>

              <div className="p-3 rounded-xl bg-black/60 border border-white/[0.1] text-cyan-300 font-mono break-all select-all flex items-center justify-between">
                <span>{newKeyCreated}</span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(newKeyCreated);
                    alert('API key copied to clipboard!');
                  }}
                  className="p-1 rounded bg-white/[0.08] hover:bg-white/[0.15] text-slate-200"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>

              <div className="pt-2 flex justify-end">
                <Button variant="primary" size="sm" onClick={() => setIsCreateKeyOpen(false)}>
                  Done
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleGenerateKey} className="space-y-4 py-2">
              <Input
                label="Integration / Application Name"
                value={newKeyName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewKeyName(e.target.value)}
                placeholder="e.g. Cerner Inpatient Bridge"
                required
              />

              <div className="p-3.5 rounded-xl bg-cyan-500/[0.05] border border-cyan-500/20 text-xs font-mono text-slate-300">
                <ShieldCheck className="w-4 h-4 text-cyan-400 inline mr-1" />
                All API requests are signed via mTLS and rate-limited to 2,000 requests/minute.
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <Button variant="ghost" size="sm" type="button" onClick={() => setIsCreateKeyOpen(false)}>
                  Cancel
                </Button>
                <Button variant="primary" size="sm" type="submit">
                  Generate Key
                </Button>
              </div>
            </form>
          )}
        </Modal>
      )}
    </div>
  );
};
