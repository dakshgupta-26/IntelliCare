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

export interface User {
  id: string;
  email: string;
  name: string;
  title: string;
  avatarUrl?: string;
  role: UserRole;
  departmentId?: string;
  departmentName?: string;
  organizationId: string;
  organizationName: string;
  permissions: Permission[];
  lastLoginAt: string;
  createdAt: string;
}

export interface AuthSession {
  token: string;
  refreshToken: string;
  expiresAt: string;
  user: User;
}

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
    'ACKNOWLEDGE_ALERTS',
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
    'ACKNOWLEDGE_ALERTS',
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
    'ACKNOWLEDGE_ALERTS',
  ],
  OPERATIONS_COORDINATOR: [
    'VIEW_RESOURCES',
    'VIEW_FORECAST',
    'RUN_OPTIMIZATION',
    'RUN_SCENARIO',
    'VIEW_KNOWLEDGE',
    'REVIEW_RECOMMENDATION',
    'ACKNOWLEDGE_ALERTS',
  ],
  AUTHORIZED_STAFF: [
    'VIEW_RESOURCES',
    'VIEW_FORECAST',
    'VIEW_KNOWLEDGE',
    'ACKNOWLEDGE_ALERTS',
  ],
};
