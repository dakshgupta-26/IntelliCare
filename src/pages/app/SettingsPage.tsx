import React, { useState } from 'react';
import {
  Save
} from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { Tabs } from '../../components/ui/Tabs';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';

export const SettingsPage: React.FC = () => {
  const currentUser = useAuthStore((state) => state.currentUser);

  const [activeTab, setActiveTab] = useState<'profile' | 'organization' | 'notifications' | 'security'>('profile');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const tabs = [
    { id: 'profile', label: 'User Profile & Identity' },
    { id: 'organization', label: 'Hospital Organization' },
    { id: 'notifications', label: 'Alerting Thresholds' },
    { id: 'security', label: 'Security & Sessions' }
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
        variant="pills"
      />

      {/* Tab 1: Profile */}
      {activeTab === 'profile' && currentUser && (
        <div className="p-6 rounded-3xl bg-surface-100 dark:bg-[#0a1628] border border-slate-700/80 dark:border-slate-800 space-y-6">
          <div className="flex items-center gap-4 pb-6 border-b border-slate-800">
            <img
              src={currentUser.avatarUrl}
              alt={currentUser.name}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-cyan-500/40"
            />
            <div>
              <h3 className="text-lg font-display font-bold text-white">{currentUser.name}</h3>
              <p className="text-xs text-slate-400 font-mono">{currentUser.email}</p>
              <div className="mt-2 flex items-center gap-2">
                <Badge variant="cyan" size="sm">{currentUser.role.replace('_', ' ')}</Badge>
                <span className="text-[11px] text-slate-500 font-mono">{currentUser.organizationName}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Full Name" defaultValue={currentUser.name} />
            <Input label="Email Address" defaultValue={currentUser.email} disabled />
            <Input label="Professional Title" defaultValue={currentUser.title} />
            <Input label="Assigned Department" defaultValue={currentUser.departmentName} disabled />
          </div>
        </div>
      )}

      {/* Tab 2: Organization */}
      {activeTab === 'organization' && (
        <div className="p-6 rounded-3xl bg-surface-100 dark:bg-[#0a1628] border border-slate-700/80 dark:border-slate-800 space-y-4">
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
        <div className="p-6 rounded-3xl bg-surface-100 dark:bg-[#0a1628] border border-slate-700/80 dark:border-slate-800 space-y-4">
          <h3 className="text-base font-display font-bold text-white">Alert Trigger Thresholds</h3>
          <div className="space-y-3 text-xs font-mono">
            <div className="p-4 rounded-xl bg-surface-200/40 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="font-bold text-white block">ICU Occupancy Critical Threshold</span>
                <span className="text-slate-400">Trigger critical alert when bed occupancy exceeds:</span>
              </div>
              <span className="text-rose-400 font-bold text-sm">90%</span>
            </div>

            <div className="p-4 rounded-xl bg-surface-200/40 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="font-bold text-white block">Emergency Surge Delta Alert</span>
                <span className="text-slate-400">Trigger alert when forecast exceeds seasonal baseline by:</span>
              </div>
              <span className="text-amber-400 font-bold text-sm">+15%</span>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Security */}
      {activeTab === 'security' && (
        <div className="p-6 rounded-3xl bg-surface-100 dark:bg-[#0a1628] border border-slate-700/80 dark:border-slate-800 space-y-4 text-xs font-mono">
          <h3 className="text-base font-display font-bold text-white">Session Security & Credentials</h3>
          <div className="p-4 rounded-xl bg-surface-200/40 border border-slate-800 space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-bold text-white">Active Session Token</span>
              <Badge variant="emerald" size="sm">ACTIVE (TLS 1.3)</Badge>
            </div>
            <p className="text-slate-400">Current session encrypted and authenticated via HMAC-SHA256 JWT.</p>
          </div>
        </div>
      )}
    </div>
  );
};
