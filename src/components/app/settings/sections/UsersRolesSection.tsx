import React, { useState } from 'react';
import { Users, UserPlus, Check, Mail, Key } from 'lucide-react';
import { SAMPLE_USERS } from '../../../../data/mockDatabase';
import { UserRole, Permission, ROLE_PERMISSIONS } from '../../../../types/auth';
import { Modal } from '../../../ui/Modal';
import { Input } from '../../../ui/Input';
import { Button } from '../../../ui/Button';

interface UsersRolesSectionProps {
  onMarkDirty: () => void;
}

const ALL_ROLES: UserRole[] = [
  'SUPER_ADMIN',
  'HOSPITAL_ADMIN',
  'DEPARTMENT_MANAGER',
  'OPERATIONS_COORDINATOR',
  'AUTHORIZED_STAFF'
];

const PERMISSIONS_LIST: { key: Permission; label: string; group: string }[] = [
  { key: 'VIEW_RESOURCES', label: 'View Real-Time Beds & Telemetry', group: 'Resources' },
  { key: 'MANAGE_RESOURCES', label: 'Override & Reserve Hospital Beds', group: 'Resources' },
  { key: 'VIEW_FORECAST', label: 'View Multi-Horizon Neural Forecasts', group: 'Intelligence' },
  { key: 'RUN_OPTIMIZATION', label: 'Execute OR-Tools MILP Allocation', group: 'Intelligence' },
  { key: 'RUN_SCENARIO', label: 'Simulate Surge & Mass Casualty Tensors', group: 'Scenarios' },
  { key: 'VIEW_KNOWLEDGE', label: 'Access SOPs & Clinical Guidance', group: 'RAG' },
  { key: 'MANAGE_KNOWLEDGE', label: 'Upload & Index Clinical Protocols', group: 'RAG' },
  { key: 'REVIEW_RECOMMENDATION', label: 'Review Generated Allocations', group: 'Decisions' },
  { key: 'APPROVE_RECOMMENDATION', label: 'Sign-Off Clinical Reallocations', group: 'Decisions' },
  { key: 'ACKNOWLEDGE_ALERTS', label: 'Acknowledge & Triage Surge Alerts', group: 'Alerts' },
  { key: 'MANAGE_USERS', label: 'Manage Accounts & RBAC Policies', group: 'Administration' },
  { key: 'MANAGE_ORGANIZATION', label: 'Configure Hospital Entity & Thresholds', group: 'Administration' },
  { key: 'VIEW_AUDIT', label: 'Inspect Cryptographic Audit Trail', group: 'Compliance' }
];

export const UsersRolesSection: React.FC<UsersRolesSectionProps> = ({ onMarkDirty }) => {
  const [usersList, setUsersList] = useState(SAMPLE_USERS);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteName, setInviteName] = useState('');
  const [inviteRole, setInviteRole] = useState<UserRole>('AUTHORIZED_STAFF');
  const [inviteDept, setInviteDept] = useState('dept-er');

  const handleSendInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail || !inviteName) return;

    const newUser = {
      id: `usr-${Date.now().toString().slice(-4)}`,
      email: inviteEmail,
      name: inviteName,
      title: 'Clinical Practitioner',
      role: inviteRole,
      departmentId: inviteDept,
      departmentName: inviteDept === 'dept-er' ? 'Emergency & Trauma' : 'Intensive Care Unit',
      organizationId: 'org-metro-01',
      organizationName: 'IntelliCare Metropolitan Medical Center',
      permissions: ROLE_PERMISSIONS[inviteRole],
      lastLoginAt: 'Invitation Pending',
      createdAt: new Date().toISOString().split('T')[0],
      status: 'ACTIVE' as const
    };

    setUsersList([...usersList, newUser]);
    setIsInviteModalOpen(false);
    setInviteEmail('');
    setInviteName('');
    onMarkDirty();
    alert(`Invitation dispatched to ${inviteEmail} with temporary credential verification link.`);
  };

  return (
    <div className="space-y-6">
      {/* User Accounts Management Header & Table */}
      <div className="p-6 rounded-3xl bg-[#070D1A] border border-white/[0.08] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/[0.06]">
          <div>
            <h3 className="text-base font-display font-bold text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-cyan-400" />
              <span>Authorized Clinical Users & Practitioners</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Active clinicians authorized to inspect telemetry, approve solver reallocations, or administer the platform.
            </p>
          </div>

          <button
            onClick={() => setIsInviteModalOpen(true)}
            className="self-start sm:self-auto inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-bold transition-colors cursor-pointer"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Invite Clinician</span>
          </button>
        </div>

        {/* Users Table */}
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-white/[0.08] text-[10px] uppercase tracking-wider text-slate-500">
                <th className="pb-2.5 font-bold">Clinician</th>
                <th className="pb-2.5 font-bold">Role</th>
                <th className="pb-2.5 font-bold">Department</th>
                <th className="pb-2.5 font-bold">Status</th>
                <th className="pb-2.5 font-bold">Auth Method</th>
                <th className="pb-2.5 font-bold">Last Active</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {usersList.map((user) => (
                <tr key={user.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={user.avatarUrl || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=256'}
                        alt={user.name}
                        className="w-7 h-7 rounded-lg object-cover border border-white/[0.1]"
                      />
                      <div>
                        <span className="text-white font-bold block">{user.name}</span>
                        <span className="text-slate-400 text-[11px] block">{user.email}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 pr-4">
                    <span className="px-2 py-0.5 rounded-md bg-white/[0.06] border border-white/[0.08] text-cyan-300 font-bold text-[10px]">
                      {user.role}
                    </span>
                  </td>
                  <td className="py-3 pr-4 text-slate-300">
                    {user.departmentName || 'Executive Operations'}
                  </td>
                  <td className="py-3 pr-4">
                    <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-bold">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      <span>{user.status || 'ACTIVE'}</span>
                    </span>
                  </td>
                  <td className="py-3 pr-4 text-slate-400">
                    SAML 2.0 / SSO
                  </td>
                  <td className="py-3 text-slate-400">
                    {user.lastLoginAt}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Role & Permissions Matrix */}
      <div className="p-6 rounded-3xl bg-[#070D1A] border border-white/[0.08] space-y-4">
        <div className="pb-3 border-b border-white/[0.06]">
          <h3 className="text-base font-display font-bold text-white flex items-center gap-2">
            <Key className="w-5 h-5 text-indigo-400" />
            <span>Role-Based Access Control (RBAC) Permission Matrix</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Clear separation of duties across medical management, clinical coordination, and nursing staff.
          </p>
        </div>

        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-white/[0.08] text-[10px] uppercase tracking-wider text-slate-500">
                <th className="pb-3 pr-4 font-bold min-w-[240px]">Operational Capability</th>
                {ALL_ROLES.map((role) => (
                  <th key={role} className="pb-3 px-2 font-bold text-center">
                    <span className="text-[10px] block font-bold text-slate-300 truncate max-w-[110px]">
                      {role.replace('_', ' ')}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {PERMISSIONS_LIST.map((perm) => (
                <tr key={perm.key} className="hover:bg-white/[0.02]">
                  <td className="py-2.5 pr-4">
                    <span className="text-white block font-medium">{perm.label}</span>
                    <span className="text-[10px] text-slate-500 block">{perm.key}</span>
                  </td>
                  {ALL_ROLES.map((role) => {
                    const hasPerm = ROLE_PERMISSIONS[role]?.includes(perm.key);
                    return (
                      <td key={role} className="py-2.5 px-2 text-center">
                        {hasPerm ? (
                          <div className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
                            <Check className="w-3 h-3" />
                          </div>
                        ) : (
                          <div className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-white/[0.03] text-slate-600">
                            <span className="text-[10px]">—</span>
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invite Clinician Modal */}
      {isInviteModalOpen && (
        <Modal
          isOpen={true}
          onClose={() => setIsInviteModalOpen(false)}
          title="Invite Clinical Team Member"
          subtitle="Provision access to the IntelliCare Hospital Operations & Governance Console."
        >
          <form onSubmit={handleSendInvite} className="space-y-4 py-2">
            <Input
              label="Practitioner Full Name"
              value={inviteName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInviteName(e.target.value)}
              placeholder="Dr. Emily Watson, MD"
              required
            />

            <Input
              label="Hospital Work Email"
              type="email"
              value={inviteEmail}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInviteEmail(e.target.value)}
              placeholder="e.watson@hospital.org"
              icon={<Mail className="w-4 h-4 text-slate-500" />}
              required
            />

            <div>
              <label className="text-xs font-mono uppercase tracking-wider text-slate-300 block mb-1.5">
                Assigned RBAC Role
              </label>
              <select
                value={inviteRole}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setInviteRole(e.target.value as UserRole)}
                className="w-full px-3 py-2 text-xs bg-black/40 border border-white/[0.08] rounded-xl text-white font-mono focus:outline-none focus:border-cyan-500/50"
              >
                {ALL_ROLES.map((role) => (
                  <option key={role} value={role} className="bg-[#091424]">
                    {role}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-mono uppercase tracking-wider text-slate-300 block mb-1.5">
                Primary Department Assignment
              </label>
              <select
                value={inviteDept}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setInviteDept(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-black/40 border border-white/[0.08] rounded-xl text-white font-mono focus:outline-none focus:border-cyan-500/50"
              >
                <option value="dept-er" className="bg-[#091424]">Emergency & Trauma (ED-TRAUMA)</option>
                <option value="dept-icu" className="bg-[#091424]">Intensive Care Unit (ICU-MED)</option>
                <option value="dept-ot" className="bg-[#091424]">Surgical Theatres & PACU</option>
                <option value="dept-ward" className="bg-[#091424]">Inpatient General Medicine</option>
              </select>
            </div>

            <div className="pt-3 flex items-center justify-end gap-2">
              <Button variant="ghost" size="sm" type="button" onClick={() => setIsInviteModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" type="submit">
                Dispatch Invitation
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
