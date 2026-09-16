import React, { useState, useEffect } from 'react';
import {
  Save,
  ShieldCheck,
  Smartphone,
  Laptop,
  Globe,
  Trash2,
  Lock,
  Key,
  LogOut,
  CheckCircle2,
  ShieldAlert
} from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { Tabs } from '../../components/ui/Tabs';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

export const SettingsPage: React.FC = () => {
  const currentUser = useAuthStore((state) => state.currentUser);
  const activeSessions = useAuthStore((state) => state.activeSessions);
  const auditLogs = useAuthStore((state) => state.auditLogs);
  const loadSessions = useAuthStore((state) => state.loadSessions);
  const revokeSession = useAuthStore((state) => state.revokeSession);
  const revokeAllOtherSessions = useAuthStore((state) => state.revokeAllOtherSessions);
  const loadAuditLogs = useAuthStore((state) => state.loadAuditLogs);
  const changePassword = useAuthStore((state) => state.changePassword);

  const [activeTab, setActiveTab] = useState<'profile' | 'organization' | 'notifications' | 'security'>('profile');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Change Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  // Load sessions and audit logs when opening security tab
  useEffect(() => {
    if (activeTab === 'security') {
      loadSessions();
      loadAuditLogs();
    }
  }, [activeTab, loadSessions, loadAuditLogs]);

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

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
      setPasswordSuccess('Password changed successfully. All other sessions have been signed out.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setPasswordError(err.message || 'Failed to change password.');
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleRevokeSession = async (sessionId: string) => {
    try {
      await revokeSession(sessionId);
    } catch (err: any) {
      alert(err.message || 'Failed to revoke session');
    }
  };

  const handleRevokeAllOther = async () => {
    if (confirm('Are you sure you want to sign out all other devices? You will remain signed in on this current device.')) {
      try {
        await revokeAllOtherSessions();
      } catch (err: any) {
        alert(err.message || 'Failed to sign out other sessions');
      }
    }
  };

  const tabs = [
    { id: 'profile', label: 'User Profile & Identity' },
    { id: 'organization', label: 'Hospital Organization' },
    { id: 'notifications', label: 'Alerting Thresholds' },
    { id: 'security', label: 'Security & Active Sessions' }
  ];

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider font-bold">
              Configuration & Governance
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-white tracking-tight">
            System & Organization Settings
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Manage operational parameters, role permissions, alert thresholds, and security preferences.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          icon={<Save className="w-3.5 h-3.5" />}
          onClick={handleSave}
        >
          {savedSuccess ? 'Settings Saved!' : 'Save Changes'}
        </Button>
      </div>

      {/* 2. Navigation Tabs */}
      <Tabs
        tabs={tabs}
        activeTab={activeTab}
        onChange={(id) => setActiveTab(id as any)}
      />

      {/* Tab 1: Profile */}
      {activeTab === 'profile' && (
        <div className="p-6 rounded-3xl bg-[#070D1A] border border-white/[0.08] space-y-4">
          <h3 className="text-base font-display font-bold text-white">Clinical Identity</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Display Name" defaultValue={currentUser?.name || ''} />
            <Input label="Clinical Title" defaultValue={currentUser?.title || ''} />
            <Input label="Hospital Email Address" defaultValue={currentUser?.email || ''} disabled />
            <Input label="Assigned Role" defaultValue={currentUser?.role || ''} disabled />
          </div>
        </div>
      )}

      {/* Tab 2: Organization */}
      {activeTab === 'organization' && (
        <div className="p-6 rounded-3xl bg-[#070D1A] border border-white/[0.08] space-y-4">
          <h3 className="text-base font-display font-bold text-white">Hospital Configuration</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Hospital Name" defaultValue="IntelliCare Metropolitan Medical Center" />
            <Input label="Organization ID" defaultValue="org-metro-01" disabled />
            <Input label="Emergency Shift Handover Window" defaultValue="07:00 / 15:00 / 23:00" />
            <Input label="Statutory ICU Nurse Ratio Mandate" defaultValue="1:2 Standard / 1:1 Ventilated" disabled />
          </div>
        </div>
      )}

      {/* Tab 3: Notifications */}
      {activeTab === 'notifications' && (
        <div className="p-6 rounded-3xl bg-[#070D1A] border border-white/[0.08] space-y-4">
          <h3 className="text-base font-display font-bold text-white">Alert Trigger Thresholds</h3>
          <div className="space-y-3 text-xs font-mono">
            <div className="p-4 rounded-xl bg-black/40 border border-white/[0.06] flex items-center justify-between">
              <div>
                <span className="font-bold text-white block">ICU Occupancy Critical Threshold</span>
                <span className="text-slate-400">Trigger critical alert when bed occupancy exceeds:</span>
              </div>
              <span className="text-rose-400 font-bold text-sm">90%</span>
            </div>

            <div className="p-4 rounded-xl bg-black/40 border border-white/[0.06] flex items-center justify-between">
              <div>
                <span className="font-bold text-white block">Emergency Surge Delta Alert</span>
                <span className="text-slate-400">Trigger alert when forecast exceeds seasonal baseline by:</span>
              </div>
              <span className="text-amber-400 font-bold text-sm">+15%</span>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Security & Sessions */}
      {activeTab === 'security' && (
        <div className="space-y-6">
          {/* Active Sessions & Device Management Card */}
          <div className="p-6 rounded-3xl bg-[#070D1A] border border-white/[0.08] space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/[0.08]">
              <div>
                <h3 className="text-base font-display font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-cyan-400" />
                  <span>Active Sessions & Authorized Devices</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Devices currently signed into your hospital operations account.
                </p>
              </div>

              {activeSessions.filter((s) => !s.isCurrent).length > 0 && (
                <button
                  onClick={handleRevokeAllOther}
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
                        ? 'bg-cyan-500/[0.04] border-cyan-500/30 shadow-[0_0_20px_rgba(25,199,243,0.08)]'
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

          {/* Change Password Card */}
          <div className="p-6 rounded-3xl bg-[#070D1A] border border-white/[0.08] space-y-4">
            <h3 className="text-base font-display font-bold text-white flex items-center gap-2">
              <Key className="w-5 h-5 text-indigo-400" />
              <span>Change Access Password</span>
            </h3>
            <p className="text-xs text-slate-400">
              Updating your credentials will automatically terminate all other active device sessions.
            </p>

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
                onChange={(e) => setCurrentPassword(e.target.value)}
                icon={<Lock className="w-4 h-4 text-slate-400" />}
                required
              />

              <Input
                label="New Password (min 8 characters)"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                icon={<Lock className="w-4 h-4 text-slate-400" />}
                required
              />

              <Input
                label="Confirm New Password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                icon={<Lock className="w-4 h-4 text-slate-400" />}
                required
              />

              <Button
                type="submit"
                variant="secondary"
                size="sm"
                disabled={passwordLoading || !currentPassword || !newPassword}
              >
                {passwordLoading ? 'Updating Password...' : 'Update Password'}
              </Button>
            </form>
          </div>

          {/* Security Audit Activity Ledger */}
          <div className="p-6 rounded-3xl bg-[#070D1A] border border-white/[0.08] space-y-4">
            <h3 className="text-base font-display font-bold text-white flex items-center gap-2">
              <Lock className="w-5 h-5 text-emerald-400" />
              <span>Recent Security Activity Ledger</span>
            </h3>
            <p className="text-xs text-slate-400">
              Audit log of authentication events, password updates, and session authorizations.
            </p>

            <div className="space-y-2 text-xs font-mono">
              {auditLogs.length === 0 ? (
                <p className="text-slate-500 py-2">No security events recorded yet.</p>
              ) : (
                auditLogs.slice(0, 8).map((log) => (
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
        </div>
      )}
    </div>
  );
};
