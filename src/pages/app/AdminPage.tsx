import React, { useState, useEffect, useCallback } from 'react';
import {
  UserPlus,
  Lock,
  Sparkles,
  Search,
  RefreshCw,
  Mail,
  ShieldCheck,
  Building2,
  Users,
  CheckCircle2,
  AlertCircle,
  Clock,
  Copy,
  Check,
  UserX,
  UserCheck,
  Edit3,
  Trash2,
  Filter
} from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { AuthApi } from '../../services/authApi';
import { User, UserRole } from '../../types/auth';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';

const CLINICAL_DEPARTMENTS = [
  { id: 'dept-er', name: 'Emergency Medicine & Trauma' },
  { id: 'dept-icu', name: 'Cardiovascular & Surgical ICU' },
  { id: 'dept-neuro', name: 'Neuro-Intensive Care' },
  { id: 'dept-surg', name: 'Surgical Operations & OR Suites' },
  { id: 'dept-inpatient', name: 'General Inpatient & Step-Down' },
  { id: 'dept-admin', name: 'Hospital Administration & Executive' },
  { id: 'dept-all', name: 'Inter-Departmental Operations' }
];

export const AdminPage: React.FC = () => {
  const currentUser = useAuthStore((state) => state.currentUser);
  const hasPermission = useAuthStore((state) => state.hasPermission);
  const setRoleSwitchingOpen = useAuthStore((state) => state.setRoleSwitchingOpen);

  // Staff list state
  const [staffList, setStaffList] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');

  // Invite Modal state
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteName, setInviteName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<UserRole>('DEPARTMENT_MANAGER');
  const [inviteDepartmentId, setInviteDepartmentId] = useState(CLINICAL_DEPARTMENTS[0].id);
  const [inviteTitle, setInviteTitle] = useState('');
  const [inviteLoading, setInviteLoading] = useState(false);
  const [inviteSuccessInfo, setInviteSuccessInfo] = useState<{
    name: string;
    email: string;
    inviteUrl?: string;
  } | null>(null);

  // Edit Role Modal state
  const [editingStaff, setEditingStaff] = useState<User | null>(null);
  const [editRole, setEditRole] = useState<UserRole>('AUTHORIZED_STAFF');
  const [editDepartmentId, setEditDepartmentId] = useState('');
  const [editTitle, setEditTitle] = useState('');
  const [editLoading, setEditLoading] = useState(false);

  // Operation states
  const [actionInProgressId, setActionInProgressId] = useState<string | null>(null);
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const isAuthorized =
    hasPermission('MANAGE_ORGANIZATION') ||
    currentUser?.role === 'SUPER_ADMIN' ||
    currentUser?.role === 'HOSPITAL_ADMIN';

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification(null);
    }, 5000);
  };

  // Fetch live staff from MongoDB via API
  const fetchStaff = useCallback(async () => {
    try {
      setLoading(true);
      const res = await AuthApi.getStaff({
        role: selectedRole !== 'ALL' ? selectedRole : undefined,
        status: selectedStatus !== 'ALL' ? selectedStatus : undefined,
        search: searchTerm.trim() || undefined
      });
      if (res.success && res.staff) {
        setStaffList(res.staff);
      }
    } catch (err: any) {
      showNotification('error', err.message || 'Failed to fetch staff directory from database.');
    } finally {
      setLoading(false);
    }
  }, [selectedRole, selectedStatus, searchTerm]);

  useEffect(() => {
    if (isAuthorized) {
      fetchStaff();
    }
  }, [isAuthorized, fetchStaff]);

  // Handle Staff Invitation
  const handleInviteSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inviteName.trim() || !inviteEmail.trim()) {
      showNotification('error', 'Name and hospital email are required.');
      return;
    }

    setInviteLoading(true);
    try {
      const selectedDept = CLINICAL_DEPARTMENTS.find((d) => d.id === inviteDepartmentId);
      const res = await AuthApi.inviteStaff({
        name: inviteName.trim(),
        email: inviteEmail.trim(),
        role: inviteRole,
        departmentId: inviteDepartmentId,
        departmentName: selectedDept?.name || 'Clinical Operations',
        title: inviteTitle.trim() || undefined
      });

      if (res.success) {
        setInviteSuccessInfo({
          name: inviteName.trim(),
          email: inviteEmail.trim(),
          inviteUrl: res.devInviteUrl
        });
        showNotification(
          'success',
          `Invitation dispatched to ${inviteEmail.trim()} via Mailjet service.`
        );
        fetchStaff();
      }
    } catch (err: any) {
      showNotification('error', err.message || 'Failed to provision staff member.');
    } finally {
      setInviteLoading(false);
    }
  };

  const closeInviteModal = () => {
    setIsInviteModalOpen(false);
    setInviteSuccessInfo(null);
    setInviteName('');
    setInviteEmail('');
    setInviteTitle('');
    setInviteRole('DEPARTMENT_MANAGER');
    setCopiedUrl(false);
  };

  // Handle Toggle Status (ACTIVE / SUSPENDED)
  const handleToggleStatus = async (user: User) => {
    const newStatus = user.status === 'SUSPENDED' ? 'ACTIVE' : 'SUSPENDED';
    const actionLabel = newStatus === 'SUSPENDED' ? 'Suspend' : 'Reactivate';

    if (
      newStatus === 'SUSPENDED' &&
      !window.confirm(
        `Are you sure you want to SUSPEND ${user.name}? This will immediately terminate all their active sessions and revoke portal access.`
      )
    ) {
      return;
    }

    setActionInProgressId(user.id);
    try {
      const res = await AuthApi.updateStaffStatus(user.id, newStatus);
      if (res.success) {
        showNotification(
          'success',
          `${user.name} has been ${newStatus.toLowerCase()}. Active sessions updated.`
        );
        setStaffList((prev) =>
          prev.map((u) => (u.id === user.id ? { ...u, status: newStatus } : u))
        );
      }
    } catch (err: any) {
      showNotification('error', err.message || `Failed to ${actionLabel.toLowerCase()} user.`);
    } finally {
      setActionInProgressId(null);
    }
  };

  // Handle Resend Invite
  const handleResendInvite = async (user: User) => {
    setActionInProgressId(user.id);
    try {
      const res = await AuthApi.resendStaffInvite(user.id);
      if (res.success) {
        showNotification(
          'success',
          `Fresh activation link dispatched to ${user.email} via Mailjet.`
        );
        if (res.devInviteUrl) {
          navigator.clipboard.writeText(res.devInviteUrl);
          showNotification(
            'success',
            `Activation invite resent! Link copied to clipboard.`
          );
        }
      }
    } catch (err: any) {
      showNotification('error', err.message || 'Failed to resend activation invite.');
    } finally {
      setActionInProgressId(null);
    }
  };

  // Handle Edit Role & Scope
  const openEditRoleModal = (user: User) => {
    setEditingStaff(user);
    setEditRole(user.role);
    setEditDepartmentId(user.departmentId || CLINICAL_DEPARTMENTS[0].id);
    setEditTitle(user.title || '');
  };

  const handleEditRoleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStaff) return;

    setEditLoading(true);
    try {
      const selectedDept = CLINICAL_DEPARTMENTS.find((d) => d.id === editDepartmentId);
      const res = await AuthApi.updateStaffRole(editingStaff.id, {
        role: editRole,
        departmentId: editDepartmentId,
        departmentName: selectedDept?.name,
        title: editTitle.trim() || undefined
      });

      if (res.success) {
        showNotification('success', `Updated credentials and RBAC scope for ${editingStaff.name}.`);
        setEditingStaff(null);
        fetchStaff();
      }
    } catch (err: any) {
      showNotification('error', err.message || 'Failed to update user RBAC scope.');
    } finally {
      setEditLoading(false);
    }
  };

  // Handle Revoke / Delete Staff
  const handleDeleteStaff = async (user: User) => {
    if (
      !window.confirm(
        `DANGER: Are you sure you want to permanently revoke all access for ${user.name}? This action cannot be undone.`
      )
    ) {
      return;
    }

    setActionInProgressId(user.id);
    try {
      const res = await AuthApi.deleteStaff(user.id);
      if (res.success) {
        showNotification('success', `${user.name} removed from organization directory.`);
        setStaffList((prev) => prev.filter((u) => u.id !== user.id));
      }
    } catch (err: any) {
      showNotification('error', err.message || 'Failed to revoke staff member.');
    } finally {
      setActionInProgressId(null);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 3000);
  };

  // Metrics calculation
  const totalStaff = staffList.length;
  const activeStaff = staffList.filter((u) => u.status === 'ACTIVE' || !u.status).length;
  const pendingStaff = staffList.filter((u) => u.lastLoginAt?.includes('Invited') || !u.emailVerified).length;
  const activeDepts = new Set(staffList.map((u) => u.departmentName).filter(Boolean)).size;

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
          Your current persona ({currentUser?.role}) does not possess the{' '}
          <code>MANAGE_ORGANIZATION</code> permission required to view or configure administrative
          staff members.
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
    <div className="space-y-6 animate-fade-in text-left">
      {/* Toast Notification */}
      {notification && (
        <div
          className={`fixed top-5 right-5 z-50 p-4 rounded-2xl border shadow-2xl backdrop-blur-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-200 max-w-md ${
            notification.type === 'success'
              ? 'bg-[#051816]/95 border-emerald-500/40 text-emerald-200'
              : 'bg-[#1e0a0a]/95 border-rose-500/40 text-rose-200'
          }`}
        >
          {notification.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
          )}
          <span className="text-xs font-sans font-medium leading-relaxed">
            {notification.message}
          </span>
        </div>
      )}

      {/* 1. Header & Organization Meta */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-2 border-b border-slate-800/80">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider font-bold bg-cyan-500/10 px-2 py-0.5 rounded-md border border-cyan-500/20">
              MongoDB Enterprise Directory
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5 text-slate-500" />
              {currentUser?.organizationName || 'IntelliCare Metropolitan Medical Center'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-white tracking-tight">
            Clinical Staff Provisioning & Governance
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-400 max-w-2xl">
            Invite clinicians, assign hospital department scopes, enforce zero-trust session revocation,
            and monitor cryptographic audit credentials.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="secondary"
            size="sm"
            icon={<RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-cyan-400' : ''}`} />}
            onClick={() => fetchStaff()}
            disabled={loading}
          >
            Sync DB
          </Button>

          <Button
            variant="primary"
            size="sm"
            icon={<UserPlus className="w-3.5 h-3.5" />}
            onClick={() => {
              setInviteSuccessInfo(null);
              setIsInviteModalOpen(true);
            }}
          >
            Provision Clinical Staff
          </Button>
        </div>
      </div>

      {/* 2. Telemetry Metric Badges */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-2xl bg-surface-100 dark:bg-[#07101f] border border-slate-800/80 relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-mono uppercase tracking-wider">Total Staff</span>
            <Users className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-mono font-bold text-white tracking-tight">{totalStaff}</div>
          <div className="text-[10px] text-slate-500 font-mono mt-1">Verified identities in MongoDB</div>
        </div>

        <div className="p-4 rounded-2xl bg-surface-100 dark:bg-[#07101f] border border-slate-800/80 relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-mono uppercase tracking-wider">Active Clinicians</span>
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </div>
          <div className="text-2xl font-mono font-bold text-emerald-400 tracking-tight">{activeStaff}</div>
          <div className="text-[10px] text-slate-500 font-mono mt-1">Operational & authorized</div>
        </div>

        <div className="p-4 rounded-2xl bg-surface-100 dark:bg-[#07101f] border border-slate-800/80 relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-mono uppercase tracking-wider">Pending Invites</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-mono font-bold text-amber-400 tracking-tight">{pendingStaff}</div>
          <div className="text-[10px] text-slate-500 font-mono mt-1">Awaiting staff activation</div>
        </div>

        <div className="p-4 rounded-2xl bg-surface-100 dark:bg-[#07101f] border border-slate-800/80 relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-mono uppercase tracking-wider">Active Units</span>
            <Building2 className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-mono font-bold text-purple-400 tracking-tight">{activeDepts}</div>
          <div className="text-[10px] text-slate-500 font-mono mt-1">Departments represented</div>
        </div>
      </div>

      {/* 3. Search & Filter Bar */}
      <div className="p-3.5 rounded-2xl bg-surface-100 dark:bg-[#07101f] border border-slate-800/80 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by physician/nurse name, email, or clinical specialty..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-surface-200/50 dark:bg-[#030814] border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/70"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Role Filter */}
          <div className="flex items-center gap-1.5 bg-surface-200/50 dark:bg-[#030814] border border-slate-800 rounded-xl px-3 py-1.5">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="bg-transparent text-xs text-slate-200 focus:outline-none font-mono cursor-pointer"
            >
              <option value="ALL" className="bg-[#0b1322]">All Roles</option>
              <option value="HOSPITAL_ADMIN" className="bg-[#0b1322]">Hospital Admin</option>
              <option value="DEPARTMENT_MANAGER" className="bg-[#0b1322]">Department Manager</option>
              <option value="OPERATIONS_COORDINATOR" className="bg-[#0b1322]">Operations Coordinator</option>
              <option value="AUTHORIZED_STAFF" className="bg-[#0b1322]">Authorized Staff</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1.5 bg-surface-200/50 dark:bg-[#030814] border border-slate-800 rounded-xl px-3 py-1.5">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-transparent text-xs text-slate-200 focus:outline-none font-mono cursor-pointer"
            >
              <option value="ALL" className="bg-[#0b1322]">All Status</option>
              <option value="ACTIVE" className="bg-[#0b1322]">Active Only</option>
              <option value="SUSPENDED" className="bg-[#0b1322]">Suspended Only</option>
            </select>
          </div>
        </div>
      </div>

      {/* 4. Staff Directory Table */}
      <div className="rounded-2xl bg-surface-100 dark:bg-[#07101f] border border-slate-800/80 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-surface-200/40 text-[11px] font-mono uppercase text-slate-400">
                <th className="py-3.5 px-4">Clinician / Staff Member</th>
                <th className="py-3.5 px-4">RBAC Role</th>
                <th className="py-3.5 px-4">Clinical Department</th>
                <th className="py-3.5 px-4">Portal Status</th>
                <th className="py-3.5 px-4">Activity</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs">
              {loading && staffList.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400 font-mono">
                    <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-cyan-400" />
                    Querying MongoDB clinical staff directory...
                  </td>
                </tr>
              ) : staffList.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <div className="text-sm font-semibold text-slate-300">No staff members found</div>
                    <div className="text-xs text-slate-500 mt-1">
                      No records match the current filters or search query.
                    </div>
                  </td>
                </tr>
              ) : (
                staffList.map((u) => {
                  const isSuspended = u.status === 'SUSPENDED';
                  const isPending = !u.emailVerified || u.lastLoginAt?.includes('Invited');
                  const isWorking = actionInProgressId === u.id;

                  return (
                    <tr
                      key={u.id}
                      className={`hover:bg-surface-200/40 transition-colors ${
                        isSuspended ? 'opacity-60 bg-rose-950/10' : ''
                      }`}
                    >
                      {/* Name and avatar */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={
                              u.avatarUrl ||
                              `https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=256`
                            }
                            alt={u.name}
                            className="w-9 h-9 rounded-xl object-cover border border-slate-700 shrink-0"
                          />
                          <div className="min-w-0">
                            <div className="font-bold text-white truncate flex items-center gap-2">
                              <span>{u.name}</span>
                              {u.id === currentUser?.id && (
                                <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                                  YOU
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-400 font-mono truncate">
                              {u.title || 'Staff Practitioner'} • <span className="text-slate-500">{u.email}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Role */}
                      <td className="py-3.5 px-4">
                        <Badge
                          variant={
                            u.role === 'HOSPITAL_ADMIN' || u.role === 'SUPER_ADMIN'
                              ? 'rose'
                              : u.role === 'DEPARTMENT_MANAGER'
                              ? 'cyan'
                              : u.role === 'OPERATIONS_COORDINATOR'
                              ? 'amber'
                              : 'slate'
                          }
                          size="sm"
                        >
                          {u.role.replace('_', ' ')}
                        </Badge>
                      </td>

                      {/* Department */}
                      <td className="py-3.5 px-4 font-mono text-slate-300">
                        {u.departmentName || 'General Operations'}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        {isSuspended ? (
                          <span className="inline-flex items-center gap-1.5 text-rose-400 font-mono font-bold text-[11px] bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/20">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                            SUSPENDED
                          </span>
                        ) : isPending ? (
                          <span className="inline-flex items-center gap-1.5 text-amber-400 font-mono font-bold text-[11px] bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                            PENDING INVITE
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-emerald-400 font-mono font-bold text-[11px] bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                            ACTIVE
                          </span>
                        )}
                      </td>

                      {/* Activity */}
                      <td className="py-3.5 px-4 font-mono text-slate-400 text-[11px]">
                        {u.lastLoginAt || 'Never'}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Resend Invite if pending */}
                          {isPending && (
                            <button
                              onClick={() => handleResendInvite(u)}
                              disabled={isWorking}
                              title="Resend Activation Invite via Mailjet"
                              className="p-1.5 rounded-lg bg-surface-200/50 hover:bg-amber-500/20 text-slate-400 hover:text-amber-300 transition-colors cursor-pointer border border-transparent hover:border-amber-500/30"
                            >
                              <Mail className="w-3.5 h-3.5" />
                            </button>
                          )}

                          {/* Edit Role */}
                          <button
                            onClick={() => openEditRoleModal(u)}
                            disabled={isWorking || u.id === currentUser?.id}
                            title="Edit Role & Scopes"
                            className="p-1.5 rounded-lg bg-surface-200/50 hover:bg-cyan-500/20 text-slate-400 hover:text-cyan-300 transition-colors cursor-pointer border border-transparent hover:border-cyan-500/30 disabled:opacity-40 disabled:cursor-not-allowed"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>

                          {/* Toggle Active / Suspend */}
                          <button
                            onClick={() => handleToggleStatus(u)}
                            disabled={isWorking || u.id === currentUser?.id}
                            title={isSuspended ? 'Reactivate Account' : 'Suspend Account (Revokes Sessions)'}
                            className={`p-1.5 rounded-lg border transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
                              isSuspended
                                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/20'
                                : 'bg-surface-200/50 border-transparent hover:border-rose-500/30 text-slate-400 hover:text-rose-300 hover:bg-rose-500/10'
                            }`}
                          >
                            {isSuspended ? (
                              <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                              <UserX className="w-3.5 h-3.5" />
                            )}
                          </button>

                          {/* Delete / Revoke Access */}
                          <button
                            onClick={() => handleDeleteStaff(u)}
                            disabled={isWorking || u.id === currentUser?.id}
                            title="Permanently Revoke Access"
                            className="p-1.5 rounded-lg bg-surface-200/50 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer border border-transparent hover:border-rose-500/30 disabled:opacity-40 disabled:cursor-not-allowed"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. Invite Modal with Mailjet integration & Direct Activation Link */}
      <Modal
        isOpen={isInviteModalOpen}
        onClose={closeInviteModal}
        title={inviteSuccessInfo ? 'Clinical Invite Dispatched' : 'Provision Clinical Staff Member'}
        subtitle={
          inviteSuccessInfo
            ? 'Account provisioned and invitation email sent via Mailjet.'
            : 'Grant authenticated credentials with granular department and RBAC permissions.'
        }
        footer={
          inviteSuccessInfo ? (
            <Button variant="primary" size="sm" onClick={closeInviteModal}>
              Done
            </Button>
          ) : (
            <>
              <Button variant="secondary" size="sm" onClick={closeInviteModal}>
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleInviteSubmit}
                disabled={inviteLoading || !inviteName.trim() || !inviteEmail.trim()}
                icon={<Mail className="w-3.5 h-3.5" />}
              >
                {inviteLoading ? 'Dispatching...' : 'Send Mailjet Invite'}
              </Button>
            </>
          )
        }
      >
        {inviteSuccessInfo ? (
          <div className="space-y-4 text-left">
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-white mb-0.5">Staff Account Provisioned</div>
                <div>
                  An official activation invite was dispatched to{' '}
                  <span className="font-mono text-emerald-200 font-bold">{inviteSuccessInfo.email}</span>.
                </div>
              </div>
            </div>

            {inviteSuccessInfo.inviteUrl && (
              <div className="space-y-2 p-3.5 rounded-xl bg-surface-200/60 border border-slate-700/80">
                <div className="flex items-center justify-between text-xs font-mono text-slate-300">
                  <span className="font-bold text-cyan-400">Direct Activation Link (Dev / Preview):</span>
                  <button
                    onClick={() => copyToClipboard(inviteSuccessInfo.inviteUrl!)}
                    className="flex items-center gap-1 text-[11px] text-cyan-400 hover:text-cyan-300 font-bold cursor-pointer"
                  >
                    {copiedUrl ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedUrl ? 'Copied!' : 'Copy Link'}
                  </button>
                </div>
                <div className="p-2 rounded-lg bg-[#030712] border border-slate-800 text-[11px] font-mono text-slate-400 break-all select-all">
                  {inviteSuccessInfo.inviteUrl}
                </div>
                <p className="text-[10px] text-slate-500 font-mono">
                  You can copy this link and paste it into an incognito window to simulate the doctor or nurse completing onboarding.
                </p>
              </div>
            )}
          </div>
        ) : (
          <form onSubmit={handleInviteSubmit} className="space-y-4 text-left">
            <Input
              label="Staff Full Name"
              value={inviteName}
              onChange={(e) => setInviteName(e.target.value)}
              placeholder="e.g. Dr. Arthur Pendelton"
              required
            />

            <Input
              label="Hospital Professional Email"
              type="email"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              placeholder="e.g. arthur.pendelton@metrohealth.org"
              required
            />

            <Input
              label="Clinical / Department Title (Optional)"
              value={inviteTitle}
              onChange={(e) => setInviteTitle(e.target.value)}
              placeholder="e.g. Attending Intensivist / ICU Lead"
            />

            <div className="space-y-1.5">
              <label className="text-xs font-mono font-medium text-slate-300 block">
                Clinical Department Scope:
              </label>
              <select
                value={inviteDepartmentId}
                onChange={(e) => setInviteDepartmentId(e.target.value)}
                className="w-full bg-surface-200/60 dark:bg-[#030814] border border-slate-700/80 rounded-xl p-2.5 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
              >
                {CLINICAL_DEPARTMENTS.map((dept) => (
                  <option key={dept.id} value={dept.id} className="bg-[#0a1424]">
                    {dept.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono font-medium text-slate-300 block">
                Assigned RBAC Role:
              </label>
              <select
                value={inviteRole}
                onChange={(e) => setInviteRole(e.target.value as UserRole)}
                className="w-full bg-surface-200/60 dark:bg-[#030814] border border-slate-700/80 rounded-xl p-2.5 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
              >
                <option value="HOSPITAL_ADMIN" className="bg-[#0a1424]">
                  Hospital Administrator (Full Governance)
                </option>
                <option value="DEPARTMENT_MANAGER" className="bg-[#0a1424]">
                  Department Clinical Manager (Unit Lead)
                </option>
                <option value="OPERATIONS_COORDINATOR" className="bg-[#0a1424]">
                  Operations Coordinator (Bed Management & Flow)
                </option>
                <option value="AUTHORIZED_STAFF" className="bg-[#0a1424]">
                  Authorized Staff (Physician, Nurse, Clinical Specialist)
                </option>
              </select>
            </div>

            <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-[11px] leading-relaxed flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <span>
                The invitee will receive an activation email via Mailjet with a single-use cryptographic token to set their password.
              </span>
            </div>
          </form>
        )}
      </Modal>

      {/* 6. Edit Role & Department Scope Modal */}
      <Modal
        isOpen={Boolean(editingStaff)}
        onClose={() => setEditingStaff(null)}
        title={`Modify Scope: ${editingStaff?.name}`}
        subtitle="Update role-based permissions and assigned hospital department."
        footer={
          <>
            <Button variant="secondary" size="sm" onClick={() => setEditingStaff(null)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleEditRoleSubmit}
              disabled={editLoading}
            >
              {editLoading ? 'Saving...' : 'Save Scopes'}
            </Button>
          </>
        }
      >
        <form onSubmit={handleEditRoleSubmit} className="space-y-4 text-left">
          <Input
            label="Clinical Title"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            placeholder="e.g. Chief Medical Officer"
          />

          <div className="space-y-1.5">
            <label className="text-xs font-mono font-medium text-slate-300 block">
              Department Scope:
            </label>
            <select
              value={editDepartmentId}
              onChange={(e) => setEditDepartmentId(e.target.value)}
              className="w-full bg-surface-200/60 dark:bg-[#030814] border border-slate-700/80 rounded-xl p-2.5 text-xs text-slate-100 focus:outline-none"
            >
              {CLINICAL_DEPARTMENTS.map((dept) => (
                <option key={dept.id} value={dept.id} className="bg-[#0a1424]">
                  {dept.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono font-medium text-slate-300 block">
              RBAC Role:
            </label>
            <select
              value={editRole}
              onChange={(e) => setEditRole(e.target.value as UserRole)}
              className="w-full bg-surface-200/60 dark:bg-[#030814] border border-slate-700/80 rounded-xl p-2.5 text-xs text-slate-100 focus:outline-none"
            >
              <option value="HOSPITAL_ADMIN" className="bg-[#0a1424]">Hospital Administrator</option>
              <option value="DEPARTMENT_MANAGER" className="bg-[#0a1424]">Department Clinical Manager</option>
              <option value="OPERATIONS_COORDINATOR" className="bg-[#0a1424]">Operations Coordinator</option>
              <option value="AUTHORIZED_STAFF" className="bg-[#0a1424]">Authorized Staff</option>
            </select>
          </div>
        </form>
      </Modal>
    </div>
  );
};
