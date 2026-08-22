import React, { useState } from 'react';
import {
  UserPlus,
  Lock,
  Sparkles
} from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { SAMPLE_USERS } from '../../data/mockDatabase';
import { User, UserRole } from '../../types/auth';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';

export const AdminPage: React.FC = () => {
  const currentUser = useAuthStore((state) => state.currentUser);
  const hasPermission = useAuthStore((state) => state.hasPermission);
  const setRoleSwitchingOpen = useAuthStore((state) => state.setRoleSwitchingOpen);

  const [usersList, setUsersList] = useState<User[]>(SAMPLE_USERS);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteName, setInviteName] = useState('');
  const [inviteRole, setInviteRole] = useState<UserRole>('OPERATIONS_COORDINATOR');

  const isAuthorized = hasPermission('MANAGE_ORGANIZATION') || currentUser?.role === 'SUPER_ADMIN' || currentUser?.role === 'HOSPITAL_ADMIN';

  const handleInvite = () => {
    if (!inviteEmail.trim() || !inviteName.trim()) return;
    const newUser: User = {
      id: `usr-${Date.now()}`,
      email: inviteEmail,
      name: inviteName,
      title: 'Healthcare Operations Specialist',
      role: inviteRole,
      departmentId: 'dept-all',
      departmentName: 'General Operations',
      organizationId: 'org-metro-01',
      organizationName: 'IntelliCare Metropolitan Medical Center',
      permissions: [],
      lastLoginAt: 'Never (Invited)',
      createdAt: new Date().toISOString().split('T')[0]
    };
    setUsersList([...usersList, newUser]);
    setIsInviteModalOpen(false);
    setInviteEmail('');
    setInviteName('');
  };

  if (!isAuthorized) {
    return (
      <div className="p-12 text-center rounded-3xl bg-surface-100 dark:bg-[#0a1628] border border-slate-700/80 dark:border-slate-800 space-y-4 max-w-xl mx-auto my-12 animate-fade-in">
        <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 mx-auto">
          <Lock className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-display font-bold text-white">
          Access Restricted by RBAC Policy
        </h2>
        <p className="text-xs text-slate-400 leading-relaxed font-mono">
          Your current persona ({currentUser?.role}) does not possess the <code>MANAGE_ORGANIZATION</code> permission required to view or configure administrative user roles.
        </p>
        <div className="pt-2">
          <Button
            variant="primary"
            size="sm"
            icon={<Sparkles className="w-4 h-4" />}
            onClick={() => setRoleSwitchingOpen(true)}
          >
            Switch to Hospital Admin Persona
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono text-rose-400 uppercase tracking-wider font-bold">
              Organization Administration
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-xs font-mono text-slate-400">
              Role-Based Access Control (RBAC)
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-white tracking-tight">
            User Governance & Role Scopes
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Invite clinical personnel, assign department scopes, and audit cryptographic credentials.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          icon={<UserPlus className="w-3.5 h-3.5" />}
          onClick={() => setIsInviteModalOpen(true)}
        >
          Invite Operations Staff
        </Button>
      </div>

      {/* 2. Registered Users Table */}
      <div className="rounded-2xl bg-surface-100 dark:bg-[#0a1628] border border-slate-700/80 dark:border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-surface-200/40 text-[11px] font-mono uppercase text-slate-400">
                <th className="py-3.5 px-4">User</th>
                <th className="py-3.5 px-4">Role</th>
                <th className="py-3.5 px-4">Department Scope</th>
                <th className="py-3.5 px-4">Last Login</th>
                <th className="py-3.5 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs">
              {usersList.map((u) => (
                <tr key={u.id} className="hover:bg-surface-200/40 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={u.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256'}
                        alt={u.name}
                        className="w-8 h-8 rounded-xl object-cover border border-slate-700 shrink-0"
                      />
                      <div>
                        <div className="font-bold text-white">{u.name}</div>
                        <span className="text-[10px] font-mono text-slate-400">{u.email}</span>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <Badge variant="cyan" size="sm">{u.role.replace('_', ' ')}</Badge>
                  </td>

                  <td className="py-3.5 px-4 font-mono text-slate-300">
                    {u.departmentName}
                  </td>

                  <td className="py-3.5 px-4 font-mono text-slate-400">
                    {u.lastLoginAt}
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <span className="text-emerald-400 font-mono font-bold text-[11px]">ACTIVE</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invite Modal */}
      <Modal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        title="Invite New Hospital Staff Member"
        subtitle="Provision an authenticated account with granular RBAC permissions."
        footer={
          <>
            <Button variant="secondary" size="sm" onClick={() => setIsInviteModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleInvite}>
              Send Invitation
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="Full Name"
            value={inviteName}
            onChange={(e) => setInviteName(e.target.value)}
            placeholder="e.g. Dr. Arthur Pendelton"
          />
          <Input
            label="Hospital Email"
            type="email"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            placeholder="e.g. arthur.p@intellicare.health"
          />
          <div className="space-y-1.5">
            <label className="text-xs font-mono font-medium text-slate-300 block">
              Assigned RBAC Role:
            </label>
            <select
              value={inviteRole}
              onChange={(e) => setInviteRole(e.target.value as any)}
              className="w-full bg-surface-200/60 border border-slate-700/80 rounded-xl p-2.5 text-xs text-slate-100 focus:outline-none"
            >
              <option value="HOSPITAL_ADMIN">Hospital Administrator</option>
              <option value="DEPARTMENT_MANAGER">Department Clinical Manager</option>
              <option value="OPERATIONS_COORDINATOR">Operations Coordinator</option>
              <option value="AUTHORIZED_STAFF">Authorized Staff</option>
            </select>
          </div>
        </div>
      </Modal>
    </div>
  );
};
