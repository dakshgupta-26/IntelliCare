import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { db } from '../storage/db';
import { TokenService } from '../services/tokenService';
import { SessionService } from '../services/sessionService';
import { EmailService } from '../services/emailService';
import { AuditService } from '../services/auditService';
import { OAuthService } from '../services/oauthService';
import { config } from '../config/env';
import { UserRecord } from '../models/types';
import { setRefreshCookie, clearRefreshCookie, COOKIE_NAME } from '../utils/cookies';

const validatePasswordComplexity = (password: string): string | null => {
  if (password.length < 8) return 'Password must be at least 8 characters long.';
  if (!/[A-Z]/.test(password)) return 'Password must contain at least one uppercase letter.';
  if (!/[a-z]/.test(password)) return 'Password must contain at least one lowercase letter.';
  if (!/[0-9]/.test(password)) return 'Password must contain at least one number.';
  if (!/[^A-Za-z0-9]/.test(password)) return 'Password must contain at least one special character.';
  return null;
};

export class AuthController {
  /**
   * 1. Register new user
   */
  static async register(req: Request, res: Response) {
    try {
      const { name, email, password, confirmPassword, organizationName, role, title, departmentName } = req.body;

      if (!name || !email || !password || !confirmPassword) {
        return res.status(400).json({ success: false, error: 'All fields are required.' });
      }

      if (password !== confirmPassword) {
        return res.status(400).json({ success: false, error: 'Passwords do not match.' });
      }

      const complexityError = validatePasswordComplexity(password);
      if (complexityError) {
        return res.status(400).json({ success: false, error: complexityError });
      }

      const cleanEmail = email.trim().toLowerCase();
      const existing = db.findUserByEmail(cleanEmail);

      if (existing && existing.emailVerified) {
        // Protect against account enumeration while preventing duplicate registrations
        return res.status(409).json({
          success: false,
          error: 'An account with this email address already exists. Please sign in.'
        });
      }

      const passwordHash = await bcrypt.hash(password, 10);
      const now = new Date().toISOString();

      const userRole: UserRole = role === 'HOSPITAL_ADMIN' ? 'HOSPITAL_ADMIN' : 'AUTHORIZED_STAFF';
      const orgId = userRole === 'HOSPITAL_ADMIN' ? `org-${crypto.randomUUID().slice(0, 8)}` : 'org-metro-01';
      const orgName = organizationName?.trim() || 'IntelliCare Metropolitan Medical Center';
      const userTitle = title?.trim() || (userRole === 'HOSPITAL_ADMIN' ? 'Hospital Administrator & Operations Lead' : 'Healthcare Operations Specialist');
      const deptName = departmentName?.trim() || 'Hospital Operations';

      let user: UserRecord;
      if (existing && !existing.emailVerified) {
        // Update existing unverified account
        user = db.updateUser(existing.id, {
          name: name.trim(),
          passwordHash,
          role: userRole,
          organizationName: orgName,
          title: userTitle,
          departmentName: deptName,
          updatedAt: now
        })!;
      } else {
        // Create new account
        user = {
          id: `usr-${crypto.randomUUID().slice(0, 8)}`,
          organizationId: orgId,
          organizationName: orgName,
          departmentId: 'dept-all',
          departmentName: deptName,
          email: cleanEmail,
          name: name.trim(),
          title: userTitle,
          role: userRole,
          status: 'ACTIVE',
          emailVerified: false,
          passwordHash,
          createdAt: now,
          updatedAt: now
        };
        db.createUser(user);
      }

      // Generate secure 6-digit OTP
      const otp = TokenService.generateSecureOTP();
      const otpHash = TokenService.hashToken(otp);
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString(); // 10m

      db.createEmailVerification({
        id: `ev-${crypto.randomUUID().slice(0, 8)}`,
        userId: user.id,
        email: cleanEmail,
        otpHash,
        expiresAt,
        attemptCount: 0,
        lastSentAt: now
      });

      // Send verification email via Mailjet
      const emailResult = await EmailService.sendVerificationEmail(cleanEmail, user.name, otp, 10);

      AuditService.log('USER_REGISTERED', {
        userId: user.id,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
        metadata: { email: cleanEmail }
      });

      AuditService.log('EMAIL_VERIFICATION_SENT', {
        userId: user.id,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent']
      });

      return res.status(201).json({
        success: true,
        message: 'Account created. Verification code dispatched to your email.',
        email: cleanEmail,
        // In non-production environments, provide dev helper OTP for testing
        devOtp: config.nodeEnv !== 'production' ? emailResult.devOtp : undefined
      });
    } catch (err: any) {
      console.error('[Register Error]', err);
      return res.status(500).json({ success: false, error: 'Registration failed due to a server error.' });
    }
  }

  /**
   * 2. Verify Email OTP
   */
  static async verifyEmail(req: Request, res: Response) {
    try {
      const { email, otp } = req.body;

      if (!email || !otp) {
        return res.status(400).json({ success: false, error: 'Email and verification code are required.' });
      }

      const cleanEmail = email.trim().toLowerCase();
      const user = db.findUserByEmail(cleanEmail);

      if (!user) {
        return res.status(400).json({ success: false, error: 'Invalid verification request.' });
      }

      if (user.emailVerified) {
        return res.status(200).json({
          success: true,
          message: 'Email address is already verified. Please sign in.',
          alreadyVerified: true
        });
      }

      const record = db.findEmailVerificationByEmail(cleanEmail);
      if (!record) {
        return res.status(400).json({
          success: false,
          error: 'Verification code not found or expired. Please request a new code.'
        });
      }

      // Check max attempts (limit 5)
      if (record.attemptCount >= 5) {
        return res.status(429).json({
          success: false,
          error: 'Maximum verification attempts exceeded. Please request a new code.'
        });
      }

      // Check expiry
      if (new Date(record.expiresAt) <= new Date()) {
        return res.status(400).json({
          success: false,
          error: 'Verification code has expired. Please request a new code.'
        });
      }

      // Compare hash
      const incomingHash = TokenService.hashToken(otp.trim());
      if (incomingHash !== record.otpHash) {
        const attemptsLeft = 4 - record.attemptCount;
        db.updateEmailVerification(cleanEmail, { attemptCount: record.attemptCount + 1 });
        return res.status(400).json({
          success: false,
          error: attemptsLeft > 0
            ? `Invalid verification code. ${attemptsLeft} attempt(s) remaining.`
            : 'Invalid code. Maximum attempts reached. Please request a new code.'
        });
      }

      // Successful verification
      const updatedUser = db.updateUser(user.id, { emailVerified: true })!;
      db.deleteEmailVerification(cleanEmail);

      // Send Welcome email via Mailjet
      await EmailService.sendWelcomeEmail(cleanEmail, updatedUser.name);

      // Create authenticated session
      const { session, accessToken, rawRefreshToken } = SessionService.createSession(
        updatedUser,
        req.ip || '127.0.0.1',
        req.headers['user-agent'] || '',
        'password'
      );

      setRefreshCookie(res, rawRefreshToken);

      AuditService.log('EMAIL_VERIFIED', {
        userId: updatedUser.id,
        sessionId: session.id,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent']
      });

      AuditService.log('LOGIN_SUCCESS', {
        userId: updatedUser.id,
        sessionId: session.id,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
        metadata: { method: 'email_verification' }
      });

      return res.status(200).json({
        success: true,
        message: 'Email address verified successfully. Welcome to IntelliCare.',
        user: db.toSafeUser(updatedUser),
        accessToken
      });
    } catch (err: any) {
      console.error('[VerifyEmail Error]', err);
      return res.status(500).json({ success: false, error: 'Verification failed.' });
    }
  }

  /**
   * 3. Resend Email OTP
   */
  static async resendOtp(req: Request, res: Response) {
    try {
      const { email } = req.body;
      if (!email) {
        return res.status(400).json({ success: false, error: 'Email is required.' });
      }

      const cleanEmail = email.trim().toLowerCase();
      const user = db.findUserByEmail(cleanEmail);

      if (!user) {
        return res.status(200).json({
          success: true,
          message: 'If an account exists, a new verification code has been dispatched.'
        });
      }

      if (user.emailVerified) {
        return res.status(400).json({ success: false, error: 'Email address is already verified.' });
      }

      const existingRecord = db.findEmailVerificationByEmail(cleanEmail);
      if (existingRecord) {
        // Enforce 60s cooldown
        const timeSinceLast = Date.now() - new Date(existingRecord.lastSentAt).getTime();
        if (timeSinceLast < 60 * 1000) {
          const secondsWait = Math.ceil((60 * 1000 - timeSinceLast) / 1000);
          return res.status(429).json({
            success: false,
            error: `Please wait ${secondsWait} seconds before requesting another code.`
          });
        }
      }

      const otp = TokenService.generateSecureOTP();
      const otpHash = TokenService.hashToken(otp);
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();
      const now = new Date().toISOString();

      db.createEmailVerification({
        id: `ev-${crypto.randomUUID().slice(0, 8)}`,
        userId: user.id,
        email: cleanEmail,
        otpHash,
        expiresAt,
        attemptCount: 0,
        lastSentAt: now
      });

      const emailResult = await EmailService.sendVerificationEmail(cleanEmail, user.name, otp, 10);

      AuditService.log('EMAIL_VERIFICATION_SENT', {
        userId: user.id,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
        metadata: { resend: true }
      });

      return res.status(200).json({
        success: true,
        message: 'New verification code dispatched to your email.',
        devOtp: config.nodeEnv !== 'production' ? emailResult.devOtp : undefined
      });
    } catch (err: any) {
      console.error('[ResendOtp Error]', err);
      return res.status(500).json({ success: false, error: 'Failed to resend code.' });
    }
  }

  /**
   * 4. Login with email and password
   */
  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ success: false, error: 'Email and password are required.' });
      }

      const cleanEmail = email.trim().toLowerCase();
      const user = db.findUserByEmail(cleanEmail);

      // Generic authentication error to avoid email enumeration
      if (!user) {
        AuditService.log('LOGIN_FAILED', {
          ipAddress: req.ip,
          userAgent: req.headers['user-agent'],
          metadata: { attemptedEmail: cleanEmail, reason: 'unknown_account' }
        });
        return res.status(401).json({ success: false, error: 'Invalid email or password.' });
      }

      const passwordValid = await bcrypt.compare(password, user.passwordHash);
      if (!passwordValid) {
        AuditService.log('LOGIN_FAILED', {
          userId: user.id,
          ipAddress: req.ip,
          userAgent: req.headers['user-agent'],
          metadata: { reason: 'invalid_password' }
        });
        return res.status(401).json({ success: false, error: 'Invalid email or password.' });
      }

      // Mandatory email verification check
      if (!user.emailVerified) {
        return res.status(403).json({
          success: false,
          code: 'EMAIL_VERIFICATION_REQUIRED',
          error: 'Email verification required before accessing the operational workspace.',
          email: user.email
        });
      }

      if (user.status !== 'ACTIVE') {
        return res.status(403).json({
          success: false,
          error: 'Account access has been suspended. Contact systems administration.'
        });
      }

      // Create session
      const { session, accessToken, rawRefreshToken, isNewDevice } = SessionService.createSession(
        user,
        req.ip || '127.0.0.1',
        req.headers['user-agent'] || '',
        'password'
      );

      setRefreshCookie(res, rawRefreshToken);

      AuditService.log('LOGIN_SUCCESS', {
        userId: user.id,
        sessionId: session.id,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
        metadata: { isNewDevice }
      });

      // Send security email alert if login is from a new device/browser
      if (isNewDevice) {
        AuditService.log('NEW_DEVICE_DETECTED', {
          userId: user.id,
          sessionId: session.id,
          ipAddress: req.ip,
          userAgent: req.headers['user-agent']
        });

        EmailService.sendLoginAlert(user.email, user.name, {
          ip: session.ipAddress || req.ip || '127.0.0.1',
          device: session.device,
          browser: session.browser,
          os: session.os,
          location: session.approximateLocation,
          timestamp: new Date().toLocaleString(),
          method: 'Password Authentication'
        }).catch(e => console.error('[Login Alert Dispatch Error]', e));
      }

      return res.status(200).json({
        success: true,
        message: 'Authentication successful.',
        user: db.toSafeUser(user),
        accessToken
      });
    } catch (err: any) {
      console.error('[Login Error]', err);
      return res.status(500).json({ success: false, error: 'Sign-in failed.' });
    }
  }

  /**
   * 5. Refresh Access Token with Token Rotation & Reuse Protection
   */
  static async refresh(req: Request, res: Response) {
    try {
      const rawRefreshToken = req.cookies?.[COOKIE_NAME];

      if (!rawRefreshToken) {
        return res.status(401).json({
          success: false,
          error: 'No active session credential found. Please sign in.'
        });
      }

      const result = SessionService.rotateRefreshToken(rawRefreshToken);

      if (result.theftDetected) {
        // Token reuse detected! Invalidate cookie and log security alert
        clearRefreshCookie(res);
        AuditService.log('REFRESH_TOKEN_REUSE_DETECTED', {
          ipAddress: req.ip,
          userAgent: req.headers['user-agent']
        });
        return res.status(401).json({
          success: false,
          code: 'TOKEN_THEFT_DETECTED',
          error: 'Security anomaly: refresh token reuse detected. Session terminated.'
        });
      }

      if (!result.success || !result.accessToken || !result.newRefreshToken) {
        clearRefreshCookie(res);
        return res.status(401).json({
          success: false,
          code: 'SESSION_EXPIRED',
          error: 'Session has expired or been revoked. Please sign in again.'
        });
      }

      setRefreshCookie(res, result.newRefreshToken);

      AuditService.log('REFRESH_TOKEN_ROTATED', {
        userId: result.session?.userId,
        sessionId: result.session?.id,
        ipAddress: req.ip
      });

      return res.status(200).json({
        success: true,
        accessToken: result.accessToken
      });
    } catch (err: any) {
      console.error('[Refresh Error]', err);
      clearRefreshCookie(res);
      return res.status(500).json({ success: false, error: 'Session refresh failed.' });
    }
  }

  /**
   * 6. Logout
   */
  static async logout(req: Request, res: Response) {
    try {
      if (req.session) {
        SessionService.revokeSession(req.session.id);
        AuditService.log('LOGOUT', {
          userId: req.user?.id,
          sessionId: req.session.id,
          ipAddress: req.ip
        });
      }
      clearRefreshCookie(res);
      return res.status(200).json({ success: true, message: 'Logged out successfully.' });
    } catch (err: any) {
      console.error('[Logout Error]', err);
      clearRefreshCookie(res);
      return res.status(200).json({ success: true });
    }
  }

  /**
   * 7. Logout from all devices
   */
  static async logoutAll(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, error: 'Unauthorized.' });
      }

      const count = SessionService.revokeAllUserSessions(req.user.id);
      clearRefreshCookie(res);

      AuditService.log('LOGOUT_ALL', {
        userId: req.user.id,
        ipAddress: req.ip,
        metadata: { sessionsRevoked: count }
      });

      return res.status(200).json({
        success: true,
        message: `Successfully logged out from all devices (${count} sessions terminated).`
      });
    } catch (err: any) {
      console.error('[LogoutAll Error]', err);
      return res.status(500).json({ success: false, error: 'Failed to revoke sessions.' });
    }
  }

  /**
   * 8. Forgot Password Request
   */
  static async forgotPassword(req: Request, res: Response) {
    try {
      const { email } = req.body;
      if (!email) {
        return res.status(400).json({ success: false, error: 'Email address is required.' });
      }

      const cleanEmail = email.trim().toLowerCase();
      const user = db.findUserByEmail(cleanEmail);

      // Anti-enumeration generic response
      const genericResponse = {
        success: true,
        message: 'If an account exists with that email, password reset instructions have been dispatched.'
      };

      if (!user) {
        return res.status(200).json(genericResponse);
      }

      // Generate secure 32-byte reset token
      const rawToken = TokenService.generatePasswordResetToken();
      const tokenHash = TokenService.hashToken(rawToken);
      const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString(); // 15m

      db.createPasswordReset({
        id: `pr-${crypto.randomUUID().slice(0, 8)}`,
        userId: user.id,
        email: cleanEmail,
        tokenHash,
        expiresAt,
        createdAt: new Date().toISOString()
      });

      const resetUrl = `${config.frontendUrl}/reset-password?token=${rawToken}&email=${encodeURIComponent(cleanEmail)}`;
      const emailResult = await EmailService.sendPasswordResetEmail(cleanEmail, user.name, resetUrl, 15);

      AuditService.log('PASSWORD_RESET_REQUESTED', {
        userId: user.id,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent']
      });

      return res.status(200).json({
        ...genericResponse,
        devResetUrl: config.nodeEnv !== 'production' ? emailResult.devResetUrl : undefined
      });
    } catch (err: any) {
      console.error('[ForgotPassword Error]', err);
      return res.status(500).json({ success: false, error: 'Password reset request failed.' });
    }
  }

  /**
   * 9. Reset Password Submission
   */
  static async resetPassword(req: Request, res: Response) {
    try {
      const { token, newPassword, confirmPassword } = req.body;

      if (!token || !newPassword || !confirmPassword) {
        return res.status(400).json({ success: false, error: 'Token and new passwords are required.' });
      }

      if (newPassword !== confirmPassword) {
        return res.status(400).json({ success: false, error: 'Passwords do not match.' });
      }

      const complexityError = validatePasswordComplexity(newPassword);
      if (complexityError) {
        return res.status(400).json({ success: false, error: complexityError });
      }

      const tokenHash = TokenService.hashToken(token.trim());
      const resetRecord = db.findPasswordResetByTokenHash(tokenHash);

      if (!resetRecord || resetRecord.usedAt || new Date(resetRecord.expiresAt) <= new Date()) {
        return res.status(400).json({
          success: false,
          error: 'This password reset link is invalid or has expired. Please request a new one.'
        });
      }

      const user = db.findUserById(resetRecord.userId);
      if (!user) {
        return res.status(400).json({ success: false, error: 'Account not found.' });
      }

      // Update password
      const newHash = await bcrypt.hash(newPassword, 10);
      db.updateUser(user.id, { passwordHash: newHash });

      // Invalidate reset token
      db.updatePasswordReset(tokenHash, { usedAt: new Date().toISOString() });

      // Revoke all existing sessions (security best practice)
      SessionService.revokeAllUserSessions(user.id);
      clearRefreshCookie(res);

      // Send security confirmation email
      EmailService.sendPasswordChangedEmail(user.email, user.name, new Date().toLocaleString()).catch(e =>
        console.error('[Password Changed Email Error]', e)
      );

      AuditService.log('PASSWORD_RESET_COMPLETED', {
        userId: user.id,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent']
      });

      return res.status(200).json({
        success: true,
        message: 'Password reset successfully. Please sign in with your new credentials.'
      });
    } catch (err: any) {
      console.error('[ResetPassword Error]', err);
      return res.status(500).json({ success: false, error: 'Failed to reset password.' });
    }
  }

  /**
   * 10. Change Password (Authenticated inside Settings)
   */
  static async changePassword(req: Request, res: Response) {
    try {
      const { currentPassword, newPassword, confirmPassword } = req.body;
      const user = req.user!;

      if (!currentPassword || !newPassword || !confirmPassword) {
        return res.status(400).json({ success: false, error: 'All fields are required.' });
      }

      if (newPassword !== confirmPassword) {
        return res.status(400).json({ success: false, error: 'New passwords do not match.' });
      }

      const complexityError = validatePasswordComplexity(newPassword);
      if (complexityError) {
        return res.status(400).json({ success: false, error: complexityError });
      }

      const isCurrentValid = await bcrypt.compare(currentPassword, user.passwordHash);
      if (!isCurrentValid) {
        return res.status(401).json({ success: false, error: 'Current password is incorrect.' });
      }

      const newHash = await bcrypt.hash(newPassword, 10);
      db.updateUser(user.id, { passwordHash: newHash });

      // Revoke other active sessions
      SessionService.revokeAllUserSessions(user.id, req.session?.id);

      EmailService.sendPasswordChangedEmail(user.email, user.name, new Date().toLocaleString()).catch(e =>
        console.error('[Password Changed Email Error]', e)
      );

      AuditService.log('PASSWORD_CHANGED', {
        userId: user.id,
        sessionId: req.session?.id,
        ipAddress: req.ip
      });

      return res.status(200).json({
        success: true,
        message: 'Password changed successfully. All other active sessions have been signed out.'
      });
    } catch (err: any) {
      console.error('[ChangePassword Error]', err);
      return res.status(500).json({ success: false, error: 'Failed to change password.' });
    }
  }

  /**
   * 11. Get Current User Profile (/auth/me)
   */
  static async getMe(req: Request, res: Response) {
    if (!req.user) {
      return res.status(401).json({ success: false, error: 'Unauthorized.' });
    }
    return res.status(200).json({
      success: true,
      user: db.toSafeUser(req.user)
    });
  }

  /**
   * 12. List Active Sessions (/auth/sessions)
   */
  static async getSessions(req: Request, res: Response) {
    if (!req.user) {
      return res.status(401).json({ success: false, error: 'Unauthorized.' });
    }

    const sessions = db.findActiveSessionsByUserId(req.user.id).map(s => ({
      id: s.id,
      device: s.device,
      browser: s.browser,
      os: s.os,
      approximateLocation: s.approximateLocation,
      ipAddress: s.ipAddress?.replace(/\.\d+$/, '.xxx') || 'Hidden', // mask last octet
      lastUsedAt: s.lastUsedAt,
      createdAt: s.createdAt,
      isCurrent: s.id === req.session?.id
    }));

    return res.status(200).json({
      success: true,
      sessions
    });
  }

  /**
   * 13. Revoke Specific Session (/auth/sessions/:id)
   */
  static async revokeSession(req: Request, res: Response) {
    const { id } = req.params;
    if (!req.user) {
      return res.status(401).json({ success: false, error: 'Unauthorized.' });
    }

    const session = db.findSessionById(id);
    if (!session || session.userId !== req.user.id) {
      return res.status(404).json({ success: false, error: 'Session not found.' });
    }

    SessionService.revokeSession(id);

    AuditService.log('SESSION_REVOKED', {
      userId: req.user.id,
      sessionId: id,
      ipAddress: req.ip
    });

    return res.status(200).json({
      success: true,
      message: 'Session revoked successfully.'
    });
  }

  /**
   * 14. Revoke All Other Sessions (/auth/sessions)
   */
  static async revokeAllOtherSessions(req: Request, res: Response) {
    if (!req.user) {
      return res.status(401).json({ success: false, error: 'Unauthorized.' });
    }

    const currentId = req.session?.id;
    const count = SessionService.revokeAllUserSessions(req.user.id, currentId);

    return res.status(200).json({
      success: true,
      message: `Revoked ${count} other active session(s).`
    });
  }

  /**
   * 15. Get Security Audit History (/auth/audit-log)
   */
  static async getAuditLog(req: Request, res: Response) {
    if (!req.user) {
      return res.status(401).json({ success: false, error: 'Unauthorized.' });
    }

    const events = db.findAuditEventsByUserId(req.user.id, 20);
    return res.status(200).json({
      success: true,
      events
    });
  }

  /**
   * 16. Google OAuth Authorization URL
   */
  static async getGoogleAuthUrl(req: Request, res: Response) {
    try {
      const { authUrl } = OAuthService.generateGoogleAuthUrl();
      return res.status(200).json({ success: true, authUrl });
    } catch (err: any) {
      console.error('[Google OAuth URL Error]', err);
      return res.status(500).json({ success: false, error: 'Failed to generate OAuth URL.' });
    }
  }

  /**
   * 17. Google OAuth Callback
   */
  static async googleOAuthCallback(req: Request, res: Response) {
    try {
      const { code, state } = req.query;

      if (!code || !state) {
        return res.redirect(`${config.frontendUrl}/login?error=oauth_missing_params`);
      }

      const user = await OAuthService.handleGoogleCallback(String(code), String(state));

      const { session, rawRefreshToken } = SessionService.createSession(
        user,
        req.ip || '127.0.0.1',
        req.headers['user-agent'] || '',
        'google_oauth'
      );

      setRefreshCookie(res, rawRefreshToken);

      AuditService.log('OAUTH_LOGIN', {
        userId: user.id,
        sessionId: session.id,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
        metadata: { provider: 'google' }
      });

      return res.redirect(`${config.frontendUrl}/app/dashboard?auth=oauth_success`);
    } catch (err: any) {
      console.error('[OAuth Callback Error]', err);
      return res.redirect(`${config.frontendUrl}/login?error=oauth_failed`);
    }
  }
}
