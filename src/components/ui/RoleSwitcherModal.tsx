import React from 'react';
import { Shield, Check } from 'lucide-react';
import { Modal } from './Modal';
import { useAuthStore } from '../../store/useAuthStore';
import { UserRole } from '../../types/auth';
import { Badge } from './Badge';

export const RoleSwitcherModal: React.FC = () => {
  const isRoleSwitchingOpen = useAuthStore((state) => state.isRoleSwitchingOpen);
  const setRoleSwitchingOpen = useAuthStore((state) => state.setRoleSwitchingOpen);
  const availableUsers = useAuthStore((state) => state.availableUsers);
  const currentUser = useAuthStore((state) => state.currentUser);
  const switchUser = useAuthStore((state) => state.switchUser);

  const getRoleBadgeVariant = (role: UserRole) => {
    switch (role) {
      case 'SUPER_ADMIN':
        return 'rose';
      case 'HOSPITAL_ADMIN':
        return 'cyan';
      case 'DEPARTMENT_MANAGER':
        return 'indigo';
      case 'OPERATIONS_COORDINATOR':
        return 'teal';
      case 'AUTHORIZED_STAFF':
      default:
        return 'slate';
    }
  };

  return (
    <Modal
      isOpen={isRoleSwitchingOpen}
      onClose={() => setRoleSwitchingOpen(false)}
      title={
        <div className="flex items-center gap-2.5">
          <Shield className="w-5 h-5 text-cyan-400" />
          <span>Interactive RBAC Persona Switcher</span>
        </div>
      }
      subtitle="Switch between authenticated personas to inspect granular role-based permissions, access restrictions, and administrative scopes across the platform."
      maxWidth="xl"
    >
      <div className="space-y-3">
        {availableUsers.map((u) => {
          const isSelected = currentUser?.id === u.id;
          return (
            <div
              key={u.id}
              onClick={() => {
                switchUser(u.id);
                setRoleSwitchingOpen(false);
              }}
              className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                isSelected
                  ? 'bg-cyan-500/10 border-cyan-500/40 shadow-sm'
                  : 'bg-surface-200/50 hover:bg-surface-200 border-slate-700/60 dark:border-slate-800'
              }`}
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <img
                  src={u.avatarUrl}
                  alt={u.name}
                  className="w-11 h-11 rounded-xl object-cover border border-slate-700 shrink-0"
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-display font-bold text-white truncate">
                      {u.name}
                    </span>
                    <Badge variant={getRoleBadgeVariant(u.role) as any} size="sm">
                      {u.role.replace('_', ' ')}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-400 truncate mt-0.5">
                    {u.title} • {u.departmentName}
                  </p>
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {u.permissions.slice(0, 4).map((p) => (
                      <span key={p} className="text-[9px] font-mono text-slate-400 bg-surface-300/60 px-1.5 py-0.2 rounded">
                        {p}
                      </span>
                    ))}
                    {u.permissions.length > 4 && (
                      <span className="text-[9px] font-mono text-cyan-400 px-1 py-0.2">
                        +{u.permissions.length - 4} more
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {isSelected && (
                <div className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0 ml-3">
                  <Check className="w-4 h-4" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </Modal>
  );
};
