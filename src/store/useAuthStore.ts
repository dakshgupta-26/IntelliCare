import { create } from 'zustand';
import { User, UserRole, Permission, ROLE_PERMISSIONS } from '../types/auth';
import { SAMPLE_USERS } from '../data/mockDatabase';

interface AuthState {
  currentUser: User | null;
  isAuthenticated: boolean;
  activeRole: UserRole;
  isRoleSwitchingOpen: boolean;
  availableUsers: User[];
  
  // Actions
  login: (email: string, role?: UserRole) => Promise<boolean>;
  logout: () => void;
  switchRole: (role: UserRole) => void;
  switchUser: (userId: string) => void;
  hasPermission: (permission: Permission) => boolean;
  setRoleSwitchingOpen: (open: boolean) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  currentUser: SAMPLE_USERS[0], // Default logged in as Hospital Admin
  isAuthenticated: true,
  activeRole: SAMPLE_USERS[0].role,
  isRoleSwitchingOpen: false,
  availableUsers: SAMPLE_USERS,

  login: async (email: string, role?: UserRole) => {
    const targetRole = role || 'HOSPITAL_ADMIN';
    const foundUser = SAMPLE_USERS.find(u => u.email.toLowerCase() === email.toLowerCase()) || {
      id: `usr-${Date.now()}`,
      email,
      name: email.split('@')[0].replace('.', ' ').toUpperCase(),
      title: 'Healthcare Operations Specialist',
      role: targetRole,
      departmentId: 'dept-all',
      departmentName: 'General Operations',
      organizationId: 'org-metro-01',
      organizationName: 'IntelliCare Metropolitan Medical Center',
      permissions: ROLE_PERMISSIONS[targetRole],
      lastLoginAt: 'Just now',
      createdAt: new Date().toISOString().split('T')[0]
    };

    set({
      currentUser: foundUser,
      isAuthenticated: true,
      activeRole: foundUser.role
    });
    return true;
  },

  logout: () => {
    set({
      currentUser: null,
      isAuthenticated: false
    });
  },

  switchRole: (role: UserRole) => {
    const matchingUser = SAMPLE_USERS.find(u => u.role === role);
    if (matchingUser) {
      set({
        currentUser: matchingUser,
        activeRole: role
      });
    } else {
      const current = get().currentUser;
      if (current) {
        const updatedUser: User = {
          ...current,
          role,
          permissions: ROLE_PERMISSIONS[role]
        };
        set({
          currentUser: updatedUser,
          activeRole: role
        });
      }
    }
  },

  switchUser: (userId: string) => {
    const user = SAMPLE_USERS.find(u => u.id === userId);
    if (user) {
      set({
        currentUser: user,
        activeRole: user.role
      });
    }
  },

  hasPermission: (permission: Permission) => {
    const user = get().currentUser;
    if (!user) return false;
    if (user.role === 'SUPER_ADMIN') return true;
    return user.permissions.includes(permission);
  },

  setRoleSwitchingOpen: (open: boolean) => {
    set({ isRoleSwitchingOpen: open });
  }
}));
