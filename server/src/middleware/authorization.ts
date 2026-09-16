import { Request, Response, NextFunction } from 'express';
import { UserRole, Permission, ROLE_PERMISSIONS } from '../models/types';

/**
 * Ensures user has verified their email before accessing protected endpoints.
 */
export const requireVerifiedEmail = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ success: false, error: 'Unauthorized.' });
  }

  if (!req.user.emailVerified) {
    return res.status(403).json({
      success: false,
      code: 'EMAIL_VERIFICATION_REQUIRED',
      error: 'Access denied. You must verify your email address to access this workspace resource.'
    });
  }

  next();
};

/**
 * Enforces Role-Based Access Control (RBAC) server-side.
 */
export const requireRole = (...roles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ success: false, error: 'Unauthorized.' });
    }

    if (req.user.role === 'SUPER_ADMIN' || roles.includes(req.user.role)) {
      return next();
    }

    return res.status(403).json({
      success: false,
      error: 'Access forbidden. Your account role does not have permission for this operation.'
    });
  };
};

/**
 * Enforces granular permission checks server-side.
 */
export const requirePermission = (...permissions: Permission[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ success: false, error: 'Unauthorized.' });
    }

    if (req.user.role === 'SUPER_ADMIN') {
      return next();
    }

    const userPerms = ROLE_PERMISSIONS[req.user.role] || [];
    const hasAll = permissions.every(p => userPerms.includes(p));

    if (!hasAll) {
      return res.status(403).json({
        success: false,
        error: 'Access forbidden. Required permission missing.'
      });
    }

    next();
  };
};
