import { User } from '../types/auth';

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

    let response = await fetch(endpoint, config);

    // If 401 Unauthorized and not already refreshing, attempt silent refresh
    if (response.status === 401 && endpoint !== '/auth/login' && endpoint !== '/auth/refresh') {
      if (isRefreshing) {
        // Wait for active refresh to finish
        return new Promise<T>((resolve, reject) => {
          failedQueue.push({
            resolve: (newToken: string) => {
              headers['Authorization'] = `Bearer ${newToken}`;
              fetch(endpoint, { ...config, headers })
                .then(r => r.json())
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
          const refreshData = await refreshRes.json();
          inMemoryAccessToken = refreshData.accessToken;
          processQueue(null, refreshData.accessToken);
          isRefreshing = false;

          // Retry original request with new access token
          headers['Authorization'] = `Bearer ${inMemoryAccessToken}`;
          const retryRes = await fetch(endpoint, { ...config, headers });
          return await retryRes.json();
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

    const data = await response.json();
    if (!response.ok) {
      const error: any = new Error(data.error || 'Request failed');
      error.status = response.status;
      error.code = data.code;
      error.email = data.email;
      error.devOtp = data.devOtp;
      error.devResetUrl = data.devResetUrl;
      throw error;
    }

    return data;
  }

  // --- Auth Operations ---

  static async register(name: string, email: string, password: string, confirmPassword: string) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, confirmPassword })
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
        const json = await data.json();
        this.setAccessToken(json.accessToken);
        return true;
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
}
