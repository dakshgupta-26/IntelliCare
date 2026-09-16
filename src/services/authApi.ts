import { User, UserRole } from '../types/auth';

let inMemoryAccessToken: string | null = null;
let isRefreshing = false;
let failedQueue: Array<{ resolve: (token: string) => void; reject: (err: any) => void }> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token!);
    }
  });
  failedQueue = [];
};

export interface SessionInfo {
  id: string;
  device: string;
  browser: string;
  os: string;
  approximateLocation: string;
  ipAddress: string;
  lastUsedAt: string;
  createdAt: string;
  isCurrent: boolean;
}

export interface AuditEventInfo {
  id: string;
  eventType: string;
  ipAddress?: string;
  userAgent?: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

async function parseResponseBody<T = any>(response: Response): Promise<T> {
  let text = '';
  try {
    text = await response.text();
  } catch {
    return {} as T;
  }

  if (!text || !text.trim()) {
    return {} as T;
  }

  try {
    return JSON.parse(text) as T;
  } catch {
    // If body is HTML or raw text from reverse proxy or server error
    return { error: text.slice(0, 300) } as T;
  }
}

export class AuthApi {
  static getAccessToken(): string | null {
    return inMemoryAccessToken;
  }

  static setAccessToken(token: string | null) {
    inMemoryAccessToken = token;
  }

  /**
   * Universal fetch wrapper with automatic Authorization header and silent 401 refresh retry.
   */
  static async request<T = any>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...((options.headers as Record<string, string>) || {})
    };

    if (inMemoryAccessToken) {
      headers['Authorization'] = `Bearer ${inMemoryAccessToken}`;
    }

    const config: RequestInit = {
      ...options,
      headers,
      credentials: 'include' // Send and receive HttpOnly cookies
    };

    let response: Response;
    try {
      response = await fetch(endpoint, config);
    } catch (networkErr: any) {
      const error: any = new Error(
        'Unable to connect to the IntelliCare service. Please check your network connection or verify that the API server is running.'
      );
      error.status = 0;
      throw error;
    }

    // If 401 Unauthorized and not already refreshing, attempt silent refresh
    if (response.status === 401 && endpoint !== '/auth/login' && endpoint !== '/auth/refresh') {
      if (isRefreshing) {
        // Wait for active refresh to finish
        return new Promise<T>((resolve, reject) => {
          failedQueue.push({
            resolve: (newToken: string) => {
              headers['Authorization'] = `Bearer ${newToken}`;
              fetch(endpoint, { ...config, headers })
                .then(r => parseResponseBody<T>(r))
                .then(resolve)
                .catch(reject);
            },
            reject
          });
        });
      }

      isRefreshing = true;

      try {
        const refreshRes = await fetch('/auth/refresh', {
          method: 'POST',
          credentials: 'include'
        });

        if (refreshRes.ok) {
          const refreshData = await parseResponseBody<any>(refreshRes);
          inMemoryAccessToken = refreshData?.accessToken || null;
          processQueue(null, inMemoryAccessToken);
          isRefreshing = false;

          // Retry original request with new access token
          headers['Authorization'] = `Bearer ${inMemoryAccessToken}`;
          const retryRes = await fetch(endpoint, { ...config, headers });
          const retryData = await parseResponseBody<T>(retryRes);
          if (!retryRes.ok) {
            throw new Error((retryData as any)?.error || 'Retry failed');
          }
          return retryData;
        } else {
          // Refresh failed, session expired
          inMemoryAccessToken = null;
          processQueue(new Error('Session expired.'));
          isRefreshing = false;
          throw new Error('SESSION_EXPIRED');
        }
      } catch (err) {
        inMemoryAccessToken = null;
        processQueue(err);
        isRefreshing = false;
        throw err;
      }
    }

    const data = await parseResponseBody<any>(response);
    if (!response.ok) {
      const fallbackMessage =
        response.status === 502 || response.status === 503 || response.status === 504
          ? 'IntelliCare Authentication Service is temporarily unavailable. Please verify the backend server is running on port 5000.'
          : response.status === 404
          ? `Authentication endpoint not found (${endpoint}).`
          : `Request failed with status ${response.status} (${response.statusText || 'Error'}).`;

      const error: any = new Error(data?.error || data?.message || fallbackMessage);
      error.status = response.status;
      error.code = data?.code;
      error.email = data?.email;
      error.devOtp = data?.devOtp;
      error.devResetUrl = data?.devResetUrl;
      throw error;
    }

    return data;
  }

  // --- Auth Operations ---

  static async register(
    name: string,
    email: string,
    password: string,
    confirmPassword: string,
    organizationName?: string,
    role?: UserRole,
    title?: string,
    departmentName?: string
  ) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, confirmPassword, organizationName, role, title, departmentName })
    });
  }

  static async verifyEmail(email: string, otp: string): Promise<{ success: boolean; user: User; accessToken: string }> {
    const data = await this.request('/auth/verify-email', {
      method: 'POST',
      body: JSON.stringify({ email, otp })
    });
    if (data.accessToken) {
      this.setAccessToken(data.accessToken);
    }
    return data;
  }

  static async resendOtp(email: string) {
    return this.request('/auth/resend-otp', {
      method: 'POST',
      body: JSON.stringify({ email })
    });
  }

  static async login(email: string, password: string): Promise<{ success: boolean; user: User; accessToken: string }> {
    const data = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    if (data.accessToken) {
      this.setAccessToken(data.accessToken);
    }
    return data;
  }

  static async refresh(): Promise<boolean> {
    try {
      const data = await fetch('/auth/refresh', {
        method: 'POST',
        credentials: 'include'
      });
      if (data.ok) {
        const json = await parseResponseBody<any>(data);
        if (json?.accessToken) {
          this.setAccessToken(json.accessToken);
          return true;
        }
      }
      this.setAccessToken(null);
      return false;
    } catch {
      this.setAccessToken(null);
      return false;
    }
  }

  static async logout(): Promise<void> {
    try {
      await this.request('/auth/logout', { method: 'POST' });
    } finally {
      this.setAccessToken(null);
    }
  }

  static async logoutAll(): Promise<{ success: boolean; message: string }> {
    try {
      return await this.request('/auth/logout-all', { method: 'POST' });
    } finally {
      this.setAccessToken(null);
    }
  }

  static async forgotPassword(email: string) {
    return this.request('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email })
    });
  }

  static async resetPassword(token: string, newPassword: string, confirmPassword: string) {
    return this.request('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, newPassword, confirmPassword })
    });
  }

  static async changePassword(currentPassword: string, newPassword: string, confirmPassword: string) {
    return this.request('/auth/change-password', {
      method: 'POST',
      body: JSON.stringify({ currentPassword, newPassword, confirmPassword })
    });
  }

  static async getMe(): Promise<{ success: boolean; user: User }> {
    return this.request('/auth/me', { method: 'GET' });
  }

  static async getSessions(): Promise<{ success: boolean; sessions: SessionInfo[] }> {
    return this.request('/auth/sessions', { method: 'GET' });
  }

  static async revokeSession(sessionId: string): Promise<{ success: boolean; message: string }> {
    return this.request(`/auth/sessions/${sessionId}`, { method: 'DELETE' });
  }

  static async revokeAllOtherSessions(): Promise<{ success: boolean; message: string }> {
    return this.request('/auth/sessions', { method: 'DELETE' });
  }

  static async getAuditLog(): Promise<{ success: boolean; events: AuditEventInfo[] }> {
    return this.request('/auth/audit-log', { method: 'GET' });
  }

  static async getGoogleAuthUrl(): Promise<{ success: boolean; authUrl: string }> {
    return this.request('/auth/oauth/google', { method: 'GET' });
  }

  // --- Clinical Staff Provisioning & Governance ---

  static async getStaff(filters?: { role?: string; departmentId?: string; status?: string; search?: string }): Promise<{
    success: boolean;
    staff: User[];
    total: number;
    organizationName?: string;
  }> {
    const params = new URLSearchParams();
    if (filters?.role && filters.role !== 'ALL') params.append('role', filters.role);
    if (filters?.departmentId && filters.departmentId !== 'ALL') params.append('departmentId', filters.departmentId);
    if (filters?.status && filters.status !== 'ALL') params.append('status', filters.status);
    if (filters?.search) params.append('search', filters.search);

    const queryStr = params.toString() ? `?${params.toString()}` : '';
    return this.request(`/auth/staff${queryStr}`, { method: 'GET' });
  }

  static async inviteStaff(payload: {
    name: string;
    email: string;
    role: UserRole;
    departmentId?: string;
    departmentName?: string;
    title?: string;
  }): Promise<{ success: boolean; message: string; staff: User; devInviteUrl?: string }> {
    return this.request('/auth/staff/invite', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  }

  static async activateStaff(token: string, password: string, confirmPassword: string): Promise<{
    success: boolean;
    message: string;
    user: User;
    accessToken: string;
  }> {
    const data = await this.request('/auth/staff/activate', {
      method: 'POST',
      body: JSON.stringify({ token, password, confirmPassword })
    });
    if (data.accessToken) {
      this.setAccessToken(data.accessToken);
    }
    return data;
  }

  static async updateStaffStatus(id: string, status: 'ACTIVE' | 'SUSPENDED'): Promise<{ success: boolean; message: string; user: User }> {
    return this.request(`/auth/staff/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status })
    });
  }

  static async updateStaffRole(id: string, payload: {
    role?: UserRole;
    departmentId?: string;
    departmentName?: string;
    title?: string;
  }): Promise<{ success: boolean; message: string; user: User }> {
    return this.request(`/auth/staff/${id}/role`, {
      method: 'PATCH',
      body: JSON.stringify(payload)
    });
  }

  static async resendStaffInvite(id: string): Promise<{ success: boolean; message: string; devInviteUrl?: string }> {
    return this.request(`/auth/staff/${id}/resend-invite`, { method: 'POST' });
  }

  static async deleteStaff(id: string): Promise<{ success: boolean; message: string }> {
    return this.request(`/auth/staff/${id}`, { method: 'DELETE' });
  }
}
