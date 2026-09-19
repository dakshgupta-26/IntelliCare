import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Smartphone,
  Laptop,
  Globe,
  Trash2,
  Lock,
  Key,
  LogOut,
  CheckCircle2,
  ShieldAlert,
  Clock,
  Fingerprint
} from 'lucide-react';
import { useAuthStore } from '../../../../store/useAuthStore';
import { Input } from '../../../ui/Input';
import { Button } from '../../../ui/Button';
import { Modal } from '../../../ui/Modal';

interface SecuritySectionProps {
  onMarkDirty: () => void;
}

export const SecuritySection: React.FC<SecuritySectionProps> = ({ onMarkDirty }) => {
  const activeSessions = useAuthStore((state) => state.activeSessions);
  const auditLogs = useAuthStore((state) => state.auditLogs);
  const loadSessions = useAuthStore((state) => state.loadSessions);
  const revokeSession = useAuthStore((state) => state.revokeSession);
  const revokeAllOtherSessions = useAuthStore((state) => state.revokeAllOtherSessions);
  const loadAuditLogs = useAuthStore((state) => state.loadAuditLogs);
  const changePassword = useAuthStore((state) => state.changePassword);

  // Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  // Session revoke modal
  const [isConfirmRevokeAllOpen, setIsConfirmRevokeAllOpen] = useState(false);
  const [sessionTimeoutMinutes, setSessionTimeoutMinutes] = useState('30');

  useEffect(() => {
    loadSessions();
    loadAuditLogs();
  }, [loadSessions, loadAuditLogs]);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(null);

    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }

    if (newPassword.length < 8) {
      setPasswordError('New password must be at least 8 characters long.');
      return;
    }

    setPasswordLoading(true);
    try {
      await changePassword(currentPassword, newPassword, confirmPassword);
      setPasswordSuccess('Password changed successfully. All other device sessions have been invalidated.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      onMarkDirty();
    } catch (err: any) {
      setPasswordError(err.message || 'Failed to update access password.');
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleRevokeSession = async (sessionId: string) => {
    try {
      await revokeSession(sessionId);
    } catch (err: any) {
      alert(err.message || 'Failed to revoke device session.');
    }
  };

  const handleConfirmRevokeAll = async () => {
    try {
      await revokeAllOtherSessions();
      setIsConfirmRevokeAllOpen(false);
    } catch (err: any) {
      alert(err.message || 'Failed to revoke remote sessions.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Active Device Sessions Card */}
      <div className="p-6 rounded-3xl bg-[#070D1A] border border-white/[0.08] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/[0.06]">
          <div>
            <h3 className="text-base font-display font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-cyan-400" />
              <span>Active Sessions & Authorized Hardware Devices</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Devices holding active cryptographic session tokens for this hospital account.
            </p>
          </div>

          {activeSessions.filter((s) => !s.isCurrent).length > 0 && (
            <button
              onClick={() => setIsConfirmRevokeAllOpen(true)}
              className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-mono font-bold transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out All Other Devices</span>
            </button>
          )}
        </div>

        <div className="space-y-3">
          {activeSessions.length === 0 ? (
            <p className="text-xs text-slate-500 font-mono py-2">Loading active sessions...</p>
          ) : (
            activeSessions.map((session) => (
              <div
                key={session.id}
                className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  session.isCurrent
                    ? 'bg-cyan-500/[0.04] border-cyan-500/30 shadow-[0_0_20px_rgba(34,211,238,0.06)]'
                    : 'bg-black/40 border-white/[0.06] hover:border-white/[0.12]'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#050814] border border-white/[0.08] flex items-center justify-center shrink-0 mt-0.5">
                    {session.device === 'Mobile Device' ? (
                      <Smartphone className="w-5 h-5 text-cyan-400" />
                    ) : (
                      <Laptop className="w-5 h-5 text-cyan-400" />
                    )}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-display font-bold text-sm text-white">
                        {session.browser} on {session.os}
                      </span>
                      {session.isCurrent && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-bold">
                          CURRENT DEVICE
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3 text-xs font-mono text-slate-400 flex-wrap">
                      <span className="inline-flex items-center gap-1">
                        <Globe className="w-3 h-3 text-slate-500" />
                        <span>{session.approximateLocation}</span>
                      </span>
                      <span>•</span>
                      <span>IP: {session.ipAddress}</span>
                      <span>•</span>
                      <span>Last active: {new Date(session.lastUsedAt).toLocaleTimeString()}</span>
                    </div>
                  </div>
                </div>

                {!session.isCurrent && (
                  <button
                    onClick={() => handleRevokeSession(session.id)}
                    className="self-end sm:self-auto inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/[0.04] hover:bg-rose-500/20 text-slate-400 hover:text-rose-300 text-xs font-mono transition-colors cursor-pointer border border-white/[0.06] hover:border-rose-500/30"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Revoke</span>
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Session Inactivity Timeout Policy */}
      <div className="p-6 rounded-3xl bg-[#070D1A] border border-white/[0.08] space-y-4">
        <div className="pb-3 border-b border-white/[0.06]">
          <h3 className="text-base font-display font-bold text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-indigo-400" />
            <span>Clinical Workstation Inactivity Timeout</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Auto-lock clinical workstation sessions when unattended in shared emergency pods.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-mono uppercase tracking-wider text-slate-300 block mb-1.5">
              Auto-Lock Inactivity Period
            </label>
            <select
              value={sessionTimeoutMinutes}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                setSessionTimeoutMinutes(e.target.value);
                onMarkDirty();
              }}
              className="w-full px-3 py-2 text-xs bg-black/40 border border-white/[0.08] rounded-xl text-white font-mono focus:outline-none focus:border-cyan-500/50"
            >
              <option value="15" className="bg-[#091424]">15 Minutes (High-Security Clinical Pods)</option>
              <option value="30" className="bg-[#091424]">30 Minutes (Standard Hospital Baseline)</option>
              <option value="60" className="bg-[#091424]">60 Minutes (Executive Operations Center)</option>
            </select>
          </div>

          <div className="p-3.5 rounded-xl bg-black/40 border border-white/[0.06] flex items-center justify-between text-xs font-mono">
            <div>
              <span className="font-bold text-white block">Biometric Re-Authentication</span>
              <span className="text-slate-500 text-[11px]">Require TouchID / Windows Hello on wake</span>
            </div>
            <span className="text-emerald-400 font-bold">Enforced</span>
          </div>
        </div>
      </div>

      {/* Change Password Form Card */}
      <div className="p-6 rounded-3xl bg-[#070D1A] border border-white/[0.08] space-y-4">
        <div className="pb-3 border-b border-white/[0.06]">
          <h3 className="text-base font-display font-bold text-white flex items-center gap-2">
            <Key className="w-5 h-5 text-cyan-400" />
            <span>Update Account Credentials</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Updating your password automatically revokes all other active device tokens.
          </p>
        </div>

        {passwordError && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2 font-sans">
            <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <span>{passwordError}</span>
          </div>
        )}

        {passwordSuccess && (
          <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-start gap-2 font-sans">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>{passwordSuccess}</span>
          </div>
        )}

        <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md pt-1">
          <Input
            label="Current Password"
            type="password"
            value={currentPassword}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCurrentPassword(e.target.value)}
            icon={<Lock className="w-4 h-4 text-slate-400" />}
            required
          />

          <Input
            label="New Password (minimum 8 characters)"
            type="password"
            value={newPassword}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewPassword(e.target.value)}
            icon={<Lock className="w-4 h-4 text-slate-400" />}
            required
          />

          <Input
            label="Confirm New Password"
            type="password"
            value={confirmPassword}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
            icon={<Lock className="w-4 h-4 text-slate-400" />}
            required
          />

          <Button
            type="submit"
            variant="secondary"
            size="sm"
            disabled={passwordLoading || !currentPassword || !newPassword}
          >
            {passwordLoading ? 'Updating Credentials...' : 'Update Password'}
          </Button>
        </form>
      </div>

      {/* Security Audit Activity Ledger */}
      <div className="p-6 rounded-3xl bg-[#070D1A] border border-white/[0.08] space-y-4">
        <div className="pb-3 border-b border-white/[0.06]">
          <h3 className="text-base font-display font-bold text-white flex items-center gap-2">
            <Fingerprint className="w-5 h-5 text-emerald-400" />
            <span>Recent Authentication & Session Events</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Cryptographic ledger tracking authentication attempts, password updates, and token lifecycle events.
          </p>
        </div>

        <div className="space-y-2 text-xs font-mono">
          {auditLogs.length === 0 ? (
            <p className="text-slate-500 py-2">No security events recorded yet.</p>
          ) : (
            auditLogs.slice(0, 6).map((log) => (
              <div
                key={log.id}
                className="p-3 rounded-xl bg-black/40 border border-white/[0.05] flex items-center justify-between"
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  <span className="font-bold text-white">{log.eventType}</span>
                  {log.ipAddress && (
                    <span className="text-slate-500">({log.ipAddress.replace(/\.\d+$/, '.xxx')})</span>
                  )}
                </div>
                <span className="text-[11px] text-slate-400">
                  {new Date(log.timestamp).toLocaleString()}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Revoke All Confirmation Modal */}
      {isConfirmRevokeAllOpen && (
        <Modal
          isOpen={true}
          onClose={() => setIsConfirmRevokeAllOpen(false)}
          title="Sign Out All Other Active Devices?"
          subtitle="Are you sure you want to terminate all remote sessions across desktop, mobile, and triage workstations?"
          footer={
            <>
              <Button variant="ghost" size="sm" onClick={() => setIsConfirmRevokeAllOpen(false)}>
                Cancel
              </Button>
              <Button variant="danger" size="sm" onClick={handleConfirmRevokeAll}>
                Terminate Remote Sessions
              </Button>
            </>
          }
        >
          <div className="space-y-3 py-2 text-xs font-mono text-slate-300">
            <p>
              This action will invalidate all OAuth refresh tokens and JWT sessions on all other devices immediately.
            </p>
            <p className="text-amber-400">
              You will remain signed in exclusively on this current browser device.
            </p>
          </div>
        </Modal>
      )}
    </div>
  );
};
