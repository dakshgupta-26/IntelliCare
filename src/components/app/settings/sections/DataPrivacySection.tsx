import React, { useState } from 'react';
import { Database, Download, Lock, FileText } from 'lucide-react';
import { Button } from '../../../ui/Button';

interface DataPrivacySectionProps {
  onMarkDirty: () => void;
}

export const DataPrivacySection: React.FC<DataPrivacySectionProps> = ({ onMarkDirty }) => {
  const [telemetryRetention, setTelemetryRetention] = useState('90');
  const [tensorRetention, setTensorRetention] = useState('30');

  const handleExportData = (type: string) => {
    alert(`Exporting ${type} bundle. Cryptographically signed package generated.`);
  };

  return (
    <div className="space-y-6">
      {/* Retention Policy Card */}
      <div className="p-6 rounded-3xl bg-[#070D1A] border border-white/[0.08] space-y-5">
        <div className="pb-3 border-b border-white/[0.06]">
          <h3 className="text-base font-display font-bold text-white flex items-center gap-2">
            <Database className="w-5 h-5 text-cyan-400" />
            <span>Operational Data Retention Schedules</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Retention rules applied across time-series arrival tensors, solver executions, and audit records.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-mono uppercase tracking-wider text-slate-300 block mb-1.5">
              Telemetry Ingest Stream Retention
            </label>
            <select
              value={telemetryRetention}
              onChange={(e) => {
                setTelemetryRetention(e.target.value);
                onMarkDirty();
              }}
              className="w-full px-3 py-2 text-xs bg-black/40 border border-white/[0.08] rounded-xl text-white font-mono focus:outline-none focus:border-cyan-500/50"
            >
              <option value="30" className="bg-[#091424]">30 Days Rolling</option>
              <option value="90" className="bg-[#091424]">90 Days Rolling (Recommended)</option>
              <option value="180" className="bg-[#091424]">180 Days Rolling</option>
              <option value="365" className="bg-[#091424]">1 Year Historical Census</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-mono uppercase tracking-wider text-slate-300 block mb-1.5">
              Simulation Scenario Tensor Retention
            </label>
            <select
              value={tensorRetention}
              onChange={(e) => {
                setTensorRetention(e.target.value);
                onMarkDirty();
              }}
              className="w-full px-3 py-2 text-xs bg-black/40 border border-white/[0.08] rounded-xl text-white font-mono focus:outline-none focus:border-cyan-500/50"
            >
              <option value="14" className="bg-[#091424]">14 Days</option>
              <option value="30" className="bg-[#091424]">30 Days (Standard)</option>
              <option value="60" className="bg-[#091424]">60 Days</option>
            </select>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-black/40 border border-white/[0.06] flex items-center justify-between text-xs font-mono">
          <div>
            <span className="font-bold text-white block">Audit Trail Immutable Retention</span>
            <span className="text-slate-400 text-[11px]">Statutory healthcare regulatory compliance requirement</span>
          </div>
          <span className="text-cyan-400 font-bold">7 Years Locked</span>
        </div>
      </div>

      {/* Sensitive Data Handling & De-Identification */}
      <div className="p-6 rounded-3xl bg-[#070D1A] border border-white/[0.08] space-y-4">
        <div className="pb-3 border-b border-white/[0.06]">
          <h3 className="text-base font-display font-bold text-white flex items-center gap-2">
            <Lock className="w-5 h-5 text-emerald-400" />
            <span>Sensitive Data Protection & Surrogate Tokenization</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Mechanisms ensuring patient privacy during optimization tensor formulation and model training.
          </p>
        </div>

        <div className="space-y-3 text-xs font-mono">
          <div className="p-3.5 rounded-xl bg-black/40 border border-white/[0.06] flex items-center justify-between">
            <div>
              <span className="font-bold text-white block">Safe-Harbor Direct Identifier Masking</span>
              <span className="text-slate-400 text-[11px]">MRNs and names converted to SHA-256 ephemeral surrogate tokens</span>
            </div>
            <span className="text-emerald-400 font-bold">Always Enforced</span>
          </div>

          <div className="p-3.5 rounded-xl bg-black/40 border border-white/[0.06] flex items-center justify-between">
            <div>
              <span className="font-bold text-white block">Encryption In-Transit & At-Rest</span>
              <span className="text-slate-400 text-[11px]">AES-256-GCM hardware encryption across all tensor databases</span>
            </div>
            <span className="text-emerald-400 font-bold">Active (TLS 1.3)</span>
          </div>
        </div>
      </div>

      {/* Data Export & Backup Tools */}
      <div className="p-6 rounded-3xl bg-[#070D1A] border border-white/[0.08] space-y-4">
        <div className="pb-3 border-b border-white/[0.06]">
          <h3 className="text-base font-display font-bold text-white flex items-center gap-2">
            <Download className="w-5 h-5 text-indigo-400" />
            <span>Governance Data Export & Compliance Packages</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Download institutional configurations, model weights, or historical census records for external audit.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => handleExportData('Platform Configuration (JSON)')}
            icon={<Download className="w-3.5 h-3.5" />}
          >
            Export System Configuration (.json)
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={() => handleExportData('Department Census & Bed Data (CSV)')}
            icon={<Download className="w-3.5 h-3.5" />}
          >
            Export Department Census (.csv)
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={() => handleExportData('Cryptographic Audit Ledger (JSON)')}
            icon={<FileText className="w-3.5 h-3.5" />}
          >
            Export Audit Ledger (.json)
          </Button>
        </div>
      </div>
    </div>
  );
};
