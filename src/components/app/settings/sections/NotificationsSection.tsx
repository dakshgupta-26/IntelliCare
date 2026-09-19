import React, { useState } from 'react';
import { Bell, Mail, Smartphone, Globe, ShieldAlert } from 'lucide-react';

interface NotificationsSectionProps {
  onMarkDirty: () => void;
}

export const NotificationsSection: React.FC<NotificationsSectionProps> = ({ onMarkDirty }) => {
  const [inAppSound, setInAppSound] = useState(true);
  const [emailImmediate, setEmailImmediate] = useState(true);
  const [pushUrgent, setPushUrgent] = useState(true);
  const [webhookDispatch, setWebhookDispatch] = useState(false);
  const [tier2Minutes, setTier2Minutes] = useState('15');
  const [tier3Minutes, setTier3Minutes] = useState('30');

  const handleToggle = (setter: React.Dispatch<React.SetStateAction<boolean>>, val: boolean) => {
    setter(val);
    onMarkDirty();
  };

  return (
    <div className="space-y-6">
      {/* Dispatch Channels */}
      <div className="p-6 rounded-3xl bg-[#070D1A] border border-white/[0.08] space-y-4">
        <div className="pb-3 border-b border-white/[0.06]">
          <h3 className="text-base font-display font-bold text-white flex items-center gap-2">
            <Bell className="w-5 h-5 text-cyan-400" />
            <span>Operational Notification Dispatch Channels</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Configure delivery methods for critical bed alerts, surge forecasts, and clinician recommendations.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {/* In-App */}
          <div className="p-4 rounded-2xl bg-black/40 border border-white/[0.06] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-xs text-white block">In-App Command Center Banners</span>
                <span className="text-[11px] text-slate-400 font-mono">Audible alert on Critical</span>
              </div>
            </div>
            <button
              onClick={() => handleToggle(setInAppSound, !inAppSound)}
              className={`px-3 py-1 text-xs font-mono rounded-lg border transition-colors cursor-pointer ${
                inAppSound
                  ? 'bg-cyan-500/15 border-cyan-500/30 text-cyan-300'
                  : 'bg-white/[0.05] border-white/[0.08] text-slate-500'
              }`}
            >
              {inAppSound ? 'Active' : 'Muted'}
            </button>
          </div>

          {/* Email */}
          <div className="p-4 rounded-2xl bg-black/40 border border-white/[0.06] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                <Mail className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-xs text-white block">Hospital Secure Email Dispatch</span>
                <span className="text-[11px] text-slate-400 font-mono">Immediate on Critical</span>
              </div>
            </div>
            <button
              onClick={() => handleToggle(setEmailImmediate, !emailImmediate)}
              className={`px-3 py-1 text-xs font-mono rounded-lg border transition-colors cursor-pointer ${
                emailImmediate
                  ? 'bg-indigo-500/15 border-indigo-500/30 text-indigo-300'
                  : 'bg-white/[0.05] border-white/[0.08] text-slate-500'
              }`}
            >
              {emailImmediate ? 'Immediate' : 'Digest Only'}
            </button>
          </div>

          {/* Mobile Pager */}
          <div className="p-4 rounded-2xl bg-black/40 border border-white/[0.06] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <Smartphone className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-xs text-white block">Clinical Pager & Push Notification</span>
                <span className="text-[11px] text-slate-400 font-mono">VoIP high-priority override</span>
              </div>
            </div>
            <button
              onClick={() => handleToggle(setPushUrgent, !pushUrgent)}
              className={`px-3 py-1 text-xs font-mono rounded-lg border transition-colors cursor-pointer ${
                pushUrgent
                  ? 'bg-amber-500/15 border-amber-500/30 text-amber-300'
                  : 'bg-white/[0.05] border-white/[0.08] text-slate-500'
              }`}
            >
              {pushUrgent ? 'Enabled' : 'Disabled'}
            </button>
          </div>

          {/* Webhooks */}
          <div className="p-4 rounded-2xl bg-black/40 border border-white/[0.06] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                <Globe className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-xs text-white block">Emergency EOC Webhook Relay</span>
                <span className="text-[11px] text-slate-400 font-mono">JSON payload to third-party</span>
              </div>
            </div>
            <button
              onClick={() => handleToggle(setWebhookDispatch, !webhookDispatch)}
              className={`px-3 py-1 text-xs font-mono rounded-lg border transition-colors cursor-pointer ${
                webhookDispatch
                  ? 'bg-purple-500/15 border-purple-500/30 text-purple-300'
                  : 'bg-white/[0.05] border-white/[0.08] text-slate-500'
              }`}
            >
              {webhookDispatch ? 'Active' : 'Disabled'}
            </button>
          </div>
        </div>
      </div>

      {/* Visual Hospital Escalation Policy Chain */}
      <div className="p-6 rounded-3xl bg-[#070D1A] border border-white/[0.08] space-y-5">
        <div className="pb-3 border-b border-white/[0.06]">
          <h3 className="text-base font-display font-bold text-white flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-rose-400" />
            <span>Automated Hospital Surge Escalation Chain</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Visual cascade policy triggered automatically when a critical bed or surge alert remains unacknowledged.
          </p>
        </div>

        {/* Visual 3-Tier Escalation Flow */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative">
          {/* Tier 1 */}
          <div className="p-4 rounded-2xl bg-black/40 border border-cyan-500/30 relative">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/15 text-cyan-300 font-bold">
                TIER 1 (IMMEDIATE)
              </span>
              <span className="text-xs font-mono text-cyan-400 font-bold">T + 0 min</span>
            </div>
            <h4 className="font-display font-bold text-sm text-white mb-1">
              Floor Charge Coordinator
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              Direct notification to triage charge nurse and unit flow coordinator for bedside triage verification.
            </p>
          </div>

          {/* Tier 2 */}
          <div className="p-4 rounded-2xl bg-black/40 border border-amber-500/30 relative">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 font-bold">
                TIER 2 (ESCALATION)
              </span>
              <span className="text-xs font-mono text-amber-400 font-bold">T + {tier2Minutes} min</span>
            </div>
            <h4 className="font-display font-bold text-sm text-white mb-1">
              Clinical Department Director
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              Dispatches pager notification to on-call ICU / Emergency Department medical director.
            </p>
          </div>

          {/* Tier 3 */}
          <div className="p-4 rounded-2xl bg-black/40 border border-rose-500/30 relative">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/15 text-rose-300 font-bold">
                TIER 3 (EXECUTIVE COMMAND)
              </span>
              <span className="text-xs font-mono text-rose-400 font-bold">T + {tier3Minutes} min</span>
            </div>
            <h4 className="font-display font-bold text-sm text-white mb-1">
              Chief Medical Operations Officer
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              Activates Hospital Emergency Operations Center (EOC) and mutual-aid ambulance diversion protocols.
            </p>
          </div>
        </div>

        {/* Escalation Timing Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div>
            <label className="text-xs font-mono uppercase tracking-wider text-slate-300 block mb-1.5">
              Tier 2 Director Escalation Delay
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={tier2Minutes}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setTier2Minutes(e.target.value);
                  onMarkDirty();
                }}
                className="w-24 px-3 py-1.5 text-xs bg-black/40 border border-white/[0.08] rounded-xl text-white font-mono focus:outline-none focus:border-amber-500/50"
              />
              <span className="text-xs font-mono text-slate-400">minutes after trigger</span>
            </div>
          </div>

          <div>
            <label className="text-xs font-mono uppercase tracking-wider text-slate-300 block mb-1.5">
              Tier 3 Executive EOC Escalation Delay
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={tier3Minutes}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setTier3Minutes(e.target.value);
                  onMarkDirty();
                }}
                className="w-24 px-3 py-1.5 text-xs bg-black/40 border border-white/[0.08] rounded-xl text-white font-mono focus:outline-none focus:border-rose-500/50"
              />
              <span className="text-xs font-mono text-slate-400">minutes after trigger</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
