import { Request, Response } from 'express';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { db } from '../storage/db';
import { EmailService } from '../services/emailService';
import { AuditService } from '../services/auditService';
import { SessionService } from '../services/sessionService';
import { setRefreshCookie } from '../utils/cookies';
import { config } from '../config/env';
import { UserRole } from '../models/types';

export class StaffController {
  /**
   * 1. List all staff members in the authenticated admin's organization
   */
  static async listStaff(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, error: 'Unauthorized.' });
      }

      const { role, departmentId, status, search } = req.query as Record<string, string>;

      const staff = db.findStaffByOrganizationId(req.user.organizationId, {
        role: role || 'ALL',
        departmentId: departmentId || 'ALL',
        status: status || 'ALL',
        search: search || ''
      });

      return res.status(200).json({
        success: true,
        staff,
        total: staff.length,
        organizationName: req.user.organizationName
      });
    } catch (err: any) {
      console.error('[StaffController.listStaff Error]', err);
      return res.status(500).json({ success: false, error: 'Failed to retrieve clinical staff directory.' });
    }
  }

  /**
   * 2. Provision & invite a new clinical staff member (Doctor, Nurse, ICU Lead, Coordinator)
   */
  static async inviteStaff(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, error: 'Unauthorized.' });
      }

      const { name, email, role, departmentId, departmentName, title } = req.body;

      if (!name || !email || !role) {
        return res.status(400).json({
          success: false,
          error: 'Staff full name, official email, and clinical role are required.'
        });
      }

      const cleanEmail = email.trim().toLowerCase();
      const existing = db.findUserByEmail(cleanEmail);

      if (existing && existing.status === 'ACTIVE') {
        return res.status(409).json({
          success: false,
          error: 'A clinical user with this email address already exists and is active.'
        });
      }

      // Generate cryptographically secure invite token (64 hex characters)
      const inviteToken = crypto.randomBytes(32).toString('hex');
      const inviteExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(); // 7 days
      const tempPasswordHash = await bcrypt.hash(crypto.randomBytes(16).toString('hex'), 10);
      const now = new Date().toISOString();

      let staffUser;

      if (existing && existing.status === 'INVITED') {
        // Refresh existing invitation
        staffUser = db.updateUser(existing.id, {
          name: name.trim(),
          role: role as UserRole,
          departmentId: departmentId || existing.departmentId || 'dept-all',
          departmentName: departmentName || existing.departmentName || 'General Operations',
          title: title?.trim() || existing.title,
          inviteToken,
          inviteExpiresAt,
          invitedBy: req.user.id
        })!;
      } else {
        // Create new invited staff user
        const newUserId = `usr-${crypto.randomBytes(4).toString('hex')}`;
        staffUser = db.createUser({
          id: newUserId,
          organizationId: req.user.organizationId,
          organizationName: req.user.organizationName,
          departmentId: departmentId || 'dept-all',
          departmentName: departmentName || 'Hospital Operations',
          email: cleanEmail,
          name: name.trim(),
          title: title?.trim() || 'Clinical Operations Specialist',
          role: role as UserRole,
          status: 'INVITED',
          emailVerified: false,
          passwordHash: tempPasswordHash,
          invitedBy: req.user.id,
          inviteToken,
          inviteExpiresAt,
          createdAt: now,
          updatedAt: now
        });
      }

      const inviteUrl = `${config.frontendUrl}/activate-staff?token=${inviteToken}&email=${encodeURIComponent(cleanEmail)}`;
      const orgName = req.user.organizationName || staffUser.organizationName || 'IntelliCare Metropolitan Medical Center';

      // Dispatch invitation email via Mailjet
      const emailResult = await EmailService.sendStaffInviteEmail(
        cleanEmail,
        staffUser.name,
        staffUser.title || staffUser.role,
        staffUser.departmentName || 'Hospital Operations',
        orgName,
        req.user.name,
        inviteUrl,
        7
      );

      AuditService.log('STAFF_INVITED', {
        userId: staffUser.id,
        organizationId: req.user.organizationId,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
        metadata: {
          invitedBy: req.user.id,
          inviterName: req.user.name,
          role: staffUser.role,
          departmentId: staffUser.departmentId
        }
      });

      return res.status(201).json({
        success: true,
        message: `Clinical access invitation dispatched to ${cleanEmail}.`,
        staff: db.toSafeUser(staffUser),
        devInviteUrl: emailResult.devInviteUrl || inviteUrl
      });
    } catch (err: any) {
      console.error('[StaffController.inviteStaff Error]', err);
      return res.status(500).json({ success: false, error: 'Failed to provision staff invitation.' });
    }
  }

  /**
   * 3. Activate staff account via invite token (Public)
   */
  static async activateStaff(req: Request, res: Response) {
    try {
      const { token, password, confirmPassword } = req.body;

      if (!token || !password || !confirmPassword) {
        return res.status(400).json({
          success: false,
          error: 'Invitation token, new password, and password confirmation are required.'
        });
      }

      if (password !== confirmPassword) {
        return res.status(400).json({ success: false, error: 'Passwords do not match.' });
      }

      if (password.length < 8) {
        return res.status(400).json({
          success: false,
          error: 'Password must be at least 8 characters long.'
        });
      }

      const user = db.findUserByInviteToken(token);
      if (!user) {
        return res.status(400).json({
          success: false,
          error: 'Invalid or expired invitation token. Please request a new invitation from your hospital admin.'
        });
      }

      if (user.inviteExpiresAt && new Date(user.inviteExpiresAt) < new Date()) {
        return res.status(400).json({
          success: false,
          error: 'This invitation token has expired. Please contact your hospital administrator for a new invite.'
        });
      }

      const newPasswordHash = await bcrypt.hash(password, 12);

      const activatedUser = db.updateUser(user.id, {
        passwordHash: newPasswordHash,
        status: 'ACTIVE',
        emailVerified: true,
        inviteToken: undefined,
        inviteExpiresAt: undefined,
        lastLoginAt: new Date().toISOString()
      })!;

      // Create active session for immediate seamless onboarding
      const { session, accessToken, rawRefreshToken } = SessionService.createSession(
        activatedUser,
        req.ip || '127.0.0.1',
        req.headers['user-agent'] || '',
        'password'
      );

      setRefreshCookie(res, rawRefreshToken);

      AuditService.log('STAFF_ACTIVATED', {
        userId: activatedUser.id,
        organizationId: activatedUser.organizationId,
        sessionId: session.id,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent']
      });

      return res.status(200).json({
        success: true,
        message: 'Clinical account successfully activated. Welcome to IntelliCare Decision Support OS.',
        user: db.toSafeUser(activatedUser),
        accessToken
      });
    } catch (err: any) {
      console.error('[StaffController.activateStaff Error]', err);
      return res.status(500).json({ success: false, error: 'Account activation failed.' });
    }
  }

  /**
   * 4. Update staff status (ACTIVE / SUSPENDED)
   */
  static async updateStaffStatus(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, error: 'Unauthorized.' });
      }

      const { id } = req.params;
      const { status } = req.body;

      if (status !== 'ACTIVE' && status !== 'SUSPENDED') {
        return res.status(400).json({ success: false, error: "Status must be either 'ACTIVE' or 'SUSPENDED'." });
      }

      const target = db.findUserById(id);
      if (!target || target.organizationId !== req.user.organizationId) {
        return res.status(404).json({ success: false, error: 'Staff member not found in your organization.' });
      }

      if (target.id === req.user.id) {
        return res.status(400).json({ success: false, error: 'You cannot suspend your own administrator account.' });
      }

      const updated = db.updateUser(target.id, { status })!;

      // If suspending, immediately invalidate all active sessions
      if (status === 'SUSPENDED') {
        const revokedCount = SessionService.revokeAllUserSessions(target.id);
        AuditService.log('STAFF_STATUS_UPDATED', {
          userId: target.id,
          organizationId: req.user.organizationId,
          ipAddress: req.ip,
          metadata: { status: 'SUSPENDED', sessionsRevoked: revokedCount, updatedBy: req.user.id }
        });
      } else {
        AuditService.log('STAFF_STATUS_UPDATED', {
          userId: target.id,
          organizationId: req.user.organizationId,
          ipAddress: req.ip,
          metadata: { status: 'ACTIVE', updatedBy: req.user.id }
        });
      }

      return res.status(200).json({
        success: true,
        message: `Staff member ${status === 'ACTIVE' ? 'reactivated' : 'suspended'} successfully.`,
        user: db.toSafeUser(updated)
      });
    } catch (err: any) {
      console.error('[StaffController.updateStaffStatus Error]', err);
      return res.status(500).json({ success: false, error: 'Failed to update staff status.' });
    }
  }

  /**
   * 5. Update staff clinical role & department scope
   */
  static async updateStaffRole(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, error: 'Unauthorized.' });
      }

      const { id } = req.params;
      const { role, departmentId, departmentName, title } = req.body;

      const target = db.findUserById(id);
      if (!target || target.organizationId !== req.user.organizationId) {
        return res.status(404).json({ success: false, error: 'Staff member not found in your organization.' });
      }

      const validRoles: UserRole[] = [
        'HOSPITAL_ADMIN',
        'DEPARTMENT_MANAGER',
        'OPERATIONS_COORDINATOR',
        'AUTHORIZED_STAFF'
      ];

      if (role && !validRoles.includes(role)) {
        return res.status(400).json({ success: false, error: 'Invalid clinical role specified.' });
      }

      const updated = db.updateUser(target.id, {
        role: (role as UserRole) || target.role,
        departmentId: departmentId !== undefined ? departmentId : target.departmentId,
        departmentName: departmentName !== undefined ? departmentName : target.departmentName,
        title: title !== undefined ? title.trim() : target.title
      })!;

      AuditService.log('STAFF_ROLE_UPDATED', {
        userId: target.id,
        organizationId: req.user.organizationId,
        ipAddress: req.ip,
        metadata: {
          previousRole: target.role,
          newRole: updated.role,
          updatedBy: req.user.id
        }
      });

      return res.status(200).json({
        success: true,
        message: 'Staff clinical role and scope updated.',
        user: db.toSafeUser(updated)
      });
    } catch (err: any) {
      console.error('[StaffController.updateStaffRole Error]', err);
      return res.status(500).json({ success: false, error: 'Failed to update staff role.' });
    }
  }

  /**
   * 6. Resend Invitation Email via Mailjet
   */
  static async resendInvite(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, error: 'Unauthorized.' });
      }

      const { id } = req.params;
      const target = db.findUserById(id);

      if (!target || target.organizationId !== req.user.organizationId) {
        return res.status(404).json({ success: false, error: 'Staff member not found.' });
      }

      if (target.status !== 'INVITED') {
        return res.status(400).json({ success: false, error: 'This staff member is already active.' });
      }

      const newInviteToken = crypto.randomBytes(32).toString('hex');
      const newExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

      const updated = db.updateUser(target.id, {
        inviteToken: newInviteToken,
        inviteExpiresAt: newExpiry
      })!;

      const inviteUrl = `${config.frontendUrl}/activate-staff?token=${newInviteToken}&email=${encodeURIComponent(updated.email)}`;

      const orgName = req.user.organizationName || updated.organizationName || 'IntelliCare Metropolitan Medical Center';

      const emailResult = await EmailService.sendStaffInviteEmail(
        updated.email,
        updated.name,
        updated.title || updated.role,
        updated.departmentName || 'Hospital Operations',
        orgName,
        req.user.name,
        inviteUrl,
        7
      );

      return res.status(200).json({
        success: true,
        message: `Invitation re-dispatched to ${updated.email}.`,
        devInviteUrl: emailResult.devInviteUrl || inviteUrl
      });
    } catch (err: any) {
      console.error('[StaffController.resendInvite Error]', err);
      return res.status(500).json({ success: false, error: 'Failed to re-dispatch invitation.' });
    }
  }

  /**
   * 7. Revoke & Remove Staff Member
   */
  static async deleteStaff(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, error: 'Unauthorized.' });
      }

      const { id } = req.params;
      const target = db.findUserById(id);

      if (!target || target.organizationId !== req.user.organizationId) {
        return res.status(404).json({ success: false, error: 'Staff member not found.' });
      }

      if (target.id === req.user.id) {
        return res.status(400).json({ success: false, error: 'You cannot remove your own administrator account.' });
      }

      // Revoke all active sessions
      SessionService.revokeAllUserSessions(target.id);
      db.deleteUser(target.id);

      AuditService.log('STAFF_REMOVED', {
        userId: target.id,
        organizationId: req.user.organizationId,
        ipAddress: req.ip,
        metadata: { removedBy: req.user.id, removedEmail: target.email }
      });

      return res.status(200).json({
        success: true,
        message: `Staff member ${target.name} removed successfully.`
      });
    } catch (err: any) {
      console.error('[StaffController.deleteStaff Error]', err);
      return res.status(500).json({ success: false, error: 'Failed to remove staff member.' });
    }
  }
}
