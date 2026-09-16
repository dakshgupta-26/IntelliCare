export type UserRole =
  | 'SUPER_ADMIN'
  | 'HOSPITAL_ADMIN'
  | 'DEPARTMENT_MANAGER'
  | 'OPERATIONS_COORDINATOR'
  | 'AUTHORIZED_STAFF';

export type Permission =
  | 'VIEW_RESOURCES'
  | 'MANAGE_RESOURCES'
  | 'VIEW_FORECAST'
  | 'RUN_OPTIMIZATION'
  | 'RUN_SCENARIO'
  | 'VIEW_KNOWLEDGE'
  | 'MANAGE_KNOWLEDGE'
  | 'REVIEW_RECOMMENDATION'
  | 'APPROVE_RECOMMENDATION'
  | 'MANAGE_USERS'
  | 'VIEW_AUDIT'
  | 'MANAGE_ORGANIZATION'
  | 'ACKNOWLEDGE_ALERTS';

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  SUPER_ADMIN: [
    'VIEW_RESOURCES',
    'MANAGE_RESOURCES',
    'VIEW_FORECAST',
    'RUN_OPTIMIZATION',
    'RUN_SCENARIO',
    'VIEW_KNOWLEDGE',
    'MANAGE_KNOWLEDGE',
    'REVIEW_RECOMMENDATION',
    'APPROVE_RECOMMENDATION',
    'MANAGE_USERS',
    'VIEW_AUDIT',
    'MANAGE_ORGANIZATION',
    'ACKNOWLEDGE_ALERTS'
  ],
  HOSPITAL_ADMIN: [
    'VIEW_RESOURCES',
    'MANAGE_RESOURCES',
    'VIEW_FORECAST',
    'RUN_OPTIMIZATION',
    'RUN_SCENARIO',
    'VIEW_KNOWLEDGE',
    'MANAGE_KNOWLEDGE',
    'REVIEW_RECOMMENDATION',
    'APPROVE_RECOMMENDATION',
    'MANAGE_USERS',
    'VIEW_AUDIT',
    'MANAGE_ORGANIZATION',
    'ACKNOWLEDGE_ALERTS'
  ],
  DEPARTMENT_MANAGER: [
    'VIEW_RESOURCES',
    'MANAGE_RESOURCES',
    'VIEW_FORECAST',
    'RUN_OPTIMIZATION',
    'RUN_SCENARIO',
    'VIEW_KNOWLEDGE',
    'REVIEW_RECOMMENDATION',
    'APPROVE_RECOMMENDATION',
    'VIEW_AUDIT',
    'ACKNOWLEDGE_ALERTS'
  ],
  OPERATIONS_COORDINATOR: [
    'VIEW_RESOURCES',
    'VIEW_FORECAST',
    'RUN_OPTIMIZATION',
    'RUN_SCENARIO',
    'VIEW_KNOWLEDGE',
    'REVIEW_RECOMMENDATION',
    'ACKNOWLEDGE_ALERTS'
  ],
  AUTHORIZED_STAFF: [
    'VIEW_RESOURCES',
    'VIEW_FORECAST',
    'VIEW_KNOWLEDGE',
    'ACKNOWLEDGE_ALERTS'
  ]
};

export type UserStatus = 'ACTIVE' | 'SUSPENDED' | 'LOCKED';

export interface UserRecord {
  id: string;
  organizationId: string;
  departmentId?: string;
  email: string;
  name: string;
  title: string;
  role: UserRole;
  status: UserStatus;
  emailVerified: boolean;
  passwordHash: string;
  avatarUrl?: string;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SessionRecord {
  id: string; // sessionId (UUID)
  userId: string;
  refreshTokenHash: string;
  createdAt: string;
  lastUsedAt: string;
  expiresAt: string;
  revokedAt?: string;
  ipAddress?: string;
  userAgent?: string;
  device: string;
  browser: string;
  os: string;
  approximateLocation: string;
  loginMethod: 'password' | 'google_oauth' | 'demo_switch';
}

export interface EmailVerificationRecord {
  id: string;
  userId: string;
  email: string;
  otpHash: string;
  expiresAt: string;
  attemptCount: number;
  lastSentAt: string;
}

export interface PasswordResetRecord {
  id: string;
  userId: string;
  email: string;
  tokenHash: string;
  expiresAt: string;
  usedAt?: string;
  createdAt: string;
}

export type AuditEventType =
  | 'USER_REGISTERED'
  | 'EMAIL_VERIFICATION_SENT'
  | 'EMAIL_VERIFIED'
  | 'LOGIN_SUCCESS'
  | 'LOGIN_FAILED'
  | 'LOGOUT'
  | 'LOGOUT_ALL'
  | 'PASSWORD_RESET_REQUESTED'
  | 'PASSWORD_RESET_COMPLETED'
  | 'PASSWORD_CHANGED'
  | 'REFRESH_TOKEN_ROTATED'
  | 'REFRESH_TOKEN_REUSE_DETECTED'
  | 'NEW_DEVICE_DETECTED'
  | 'SUSPICIOUS_LOGIN'
  | 'OAUTH_LOGIN'
  | 'SESSION_REVOKED';

export interface AuditEventRecord {
  id: string;
  userId?: string;
  sessionId?: string;
  eventType: AuditEventType;
  ipAddress?: string;
  userAgent?: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

// Safe User object returned in API responses (never reveals passwordHash, secrets)
export interface SafeUser {
  id: string;
  organizationId: string;
  organizationName: string;
  departmentId?: string;
  departmentName?: string;
  email: string;
  name: string;
  title: string;
  role: UserRole;
  status: UserStatus;
  emailVerified: boolean;
  permissions: Permission[];
  avatarUrl?: string;
  lastLoginAt?: string;
  createdAt: string;
}
