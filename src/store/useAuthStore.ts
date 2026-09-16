import { create } from 'zustand';
import { User, UserRole, Permission } from '../types/auth';
import { AuthApi, SessionInfo, AuditEventInfo } from '../services/authApi';
import { SAMPLE_USERS } from '../data/mockDatabase';

interface AuthState {
  currentUser: User | null;
  isAuthenticated: boolean;
  isInitialized: boolean;
  isLoading: boolean;
  error: string | null;
  activeRole: UserRole;
  unverifiedEmail: string | null;
  isRoleSwitchingOpen: boolean;
  availableUsers: User[];

  // Session & Audit Data
  activeSessions: SessionInfo[];
  auditLogs: AuditEventInfo[];

  // Lifecycle
  initAuth: () => Promise<void>;

  // Authentication Operations
  login: (email: string, password?: string) => Promise<boolean>;
  register: (
    name: string,
    email: string,
    password: string,
    confirmPassword: string,
    organizationName?: string,
    role?: UserRole,
    title?: string,
    departmentName?: string
  ) => Promise<{ devOtp?: string }>;
  verifyEmail: (email: string, otp: string) => Promise<boolean>;
  resendOtp: (email: string) => Promise<{ devOtp?: string }>;
  logout: () => Promise<void>;
  logoutAll: () => Promise<void>;
  forgotPassword: (email: string) => Promise<{ devResetUrl?: string }>;
  resetPassword: (token: string, newPassword: string, confirmPassword: string) => Promise<void>;
  activateStaff: (token: string, password: string, confirmPassword: string) => Promise<any>;
  changePassword: (currentPassword: string, newPassword: string, confirmPassword: string) => Promise<void>;

  // Session & Audit Management
  loadSessions: () => Promise<void>;
  revokeSession: (sessionId: string) => Promise<void>;
  revokeAllOtherSessions: () => Promise<void>;
  loadAuditLogs: () => Promise<void>;

  // Persona & Role Switching
  switchRole: (role: UserRole) => Promise<void>;
  switchUser: (userId: string) => Promise<void>;
  setUnverifiedEmail: (email: string | null) => void;
  setRoleSwitchingOpen: (open: boolean) => void;
  hasPermission: (permission: Permission) => boolean;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  currentUser: SAMPLE_USERS[0], // Seed default for immediate initial render
  isAuthenticated: true,
  isInitialized: false,
  isLoading: false,
  error: null,
  activeRole: SAMPLE_USERS[0].role,
  unverifiedEmail: null,
  isRoleSwitchingOpen: false,
  availableUsers: SAMPLE_USERS,
  activeSessions: [],
  auditLogs: [],

  initAuth: async () => {
    try {
      set({ isLoading: true });
      const meRes = await AuthApi.getMe();
      if (meRes?.success && meRes.user) {
        set({
          currentUser: meRes.user,
          isAuthenticated: true,
          activeRole: meRes.user.role,
          isInitialized: true,
          isLoading: false
        });
        return;
      }
    } catch {
      // Attempt silent refresh via HttpOnly cookie
      try {
        const refreshed = await AuthApi.refresh();
        if (refreshed) {
          const meRes = await AuthApi.getMe();
          if (meRes?.success && meRes.user) {
            set({
              currentUser: meRes.user,
              isAuthenticated: true,
              activeRole: meRes.user.role,
              isInitialized: true,
              isLoading: false
            });
            return;
          }
        }
      } catch {
        // Not authenticated
      }
    }

    set({
      currentUser: null,
      isAuthenticated: false,
      isInitialized: true,
      isLoading: false
    });
  },

  login: async (email: string, password = 'IntelliCare@2026!') => {
    set({ isLoading: true, error: null });
    try {
      const data = await AuthApi.login(email, password);
      set({
        currentUser: data.user,
        isAuthenticated: true,
        activeRole: data.user.role,
        unverifiedEmail: null,
        isLoading: false
      });
      return true;
    } catch (err: any) {
      if (err.code === 'EMAIL_VERIFICATION_REQUIRED') {
        set({
          unverifiedEmail: err.email || email,
          isLoading: false,
          error: 'Email verification required.'
        });
        throw err;
      }
      set({ isLoading: false, error: err.message || 'Login failed.' });
      throw err;
    }
  },

  register: async (name, email, password, confirmPassword, organizationName, role, title, departmentName) => {
    set({ isLoading: true, error: null });
    try {
      const data = await AuthApi.register(name, email, password, confirmPassword, organizationName, role, title, departmentName);
      set({ unverifiedEmail: email, isLoading: false });
      return { devOtp: data.devOtp };
    } catch (err: any) {
      set({ isLoading: false, error: err.message || 'Registration failed.' });
      throw err;
    }
  },

  verifyEmail: async (email, otp) => {
    set({ isLoading: true, error: null });
    try {
      const data = await AuthApi.verifyEmail(email, otp);
      set({
        currentUser: data.user,
        isAuthenticated: true,
        activeRole: data.user.role,
        unverifiedEmail: null,
        isLoading: false
      });
      return true;
    } catch (err: any) {
      set({ isLoading: false, error: err.message || 'Verification failed.' });
      throw err;
    }
  },

  resendOtp: async (email) => {
    return AuthApi.resendOtp(email);
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      await AuthApi.logout();
    } finally {
      set({
        currentUser: null,
        isAuthenticated: false,
        isLoading: false,
        activeSessions: []
      });
    }
  },

  logoutAll: async () => {
    set({ isLoading: true });
    try {
      await AuthApi.logoutAll();
    } finally {
      set({
        currentUser: null,
        isAuthenticated: false,
        isLoading: false,
        activeSessions: []
      });
    }
  },

  forgotPassword: async (email) => {
    set({ isLoading: true, error: null });
    try {
      const res = await AuthApi.forgotPassword(email);
      set({ isLoading: false });
      return { devResetUrl: res.devResetUrl };
    } catch (err: any) {
      set({ isLoading: false, error: err.message });
      throw err;
    }
  },

  resetPassword: async (token, newPassword, confirmPassword) => {
    set({ isLoading: true, error: null });
    try {
      await AuthApi.resetPassword(token, newPassword, confirmPassword);
      set({ isLoading: false });
    } catch (err: any) {
      set({ isLoading: false, error: err.message });
      throw err;
    }
  },

  activateStaff: async (token, password, confirmPassword) => {
    set({ isLoading: true, error: null });
    try {
      const res = await AuthApi.activateStaff(token, password, confirmPassword);
      if (res?.success && res.user) {
        set({
          currentUser: res.user,
          isAuthenticated: true,
          activeRole: res.user.role,
          isLoading: false
        });
        return res;
      }
      throw new Error(res?.message || 'Staff activation failed');
    } catch (err: any) {
      set({ isLoading: false, error: err.message });
      throw err;
    }
  },

  changePassword: async (currentPassword, newPassword, confirmPassword) => {
    set({ isLoading: true, error: null });
    try {
      await AuthApi.changePassword(currentPassword, newPassword, confirmPassword);
      set({ isLoading: false });
      await get().loadSessions();
    } catch (err: any) {
      set({ isLoading: false, error: err.message });
      throw err;
    }
  },

  loadSessions: async () => {
    try {
      const res = await AuthApi.getSessions();
      if (res?.success) {
        set({ activeSessions: res.sessions });
      }
    } catch (err) {
      console.error('[LoadSessions Error]', err);
    }
  },

  revokeSession: async (sessionId: string) => {
    try {
      await AuthApi.revokeSession(sessionId);
      set((state) => ({
        activeSessions: state.activeSessions.filter((s) => s.id !== sessionId)
      }));
    } catch (err: any) {
      console.error('[RevokeSession Error]', err);
      throw err;
    }
  },

  revokeAllOtherSessions: async () => {
    try {
      await AuthApi.revokeAllOtherSessions();
      set((state) => ({
        activeSessions: state.activeSessions.filter((s) => s.isCurrent)
      }));
    } catch (err: any) {
      console.error('[RevokeAllOtherSessions Error]', err);
      throw err;
    }
  },

  loadAuditLogs: async () => {
    try {
      const res = await AuthApi.getAuditLog();
      if (res?.success) {
        set({ auditLogs: res.events });
      }
    } catch (err) {
      console.error('[LoadAuditLogs Error]', err);
    }
  },

  switchRole: async (role: UserRole) => {
    const matching = SAMPLE_USERS.find((u) => u.role === role);
    if (matching) {
      await get().login(matching.email, 'IntelliCare@2026!');
    }
  },

  switchUser: async (userId: string) => {
    const matching = SAMPLE_USERS.find((u) => u.id === userId);
    if (matching) {
      await get().login(matching.email, 'IntelliCare@2026!');
    }
  },

  setUnverifiedEmail: (email) => set({ unverifiedEmail: email }),
  setRoleSwitchingOpen: (open) => set({ isRoleSwitchingOpen: open }),

  hasPermission: (permission: Permission) => {
    const user = get().currentUser;
    if (!user) return false;
    if (user.role === 'SUPER_ADMIN') return true;
    return user.permissions?.includes(permission) || false;
  }
}));
