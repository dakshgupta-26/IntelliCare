import { Router } from 'express';
import { AuthController } from '../controllers/authController';
import { StaffController } from '../controllers/staffController';
import { authenticate } from '../middleware/authenticate';
import { requireRole } from '../middleware/authorization';
import { RateLimitService } from '../services/rateLimitService';

const router = Router();

// Public Auth Endpoints (protected by rate limiters)
router.get('/health', (req, res) => res.json({ status: 'ok', service: 'IntelliCare Auth Service' }));
router.post('/register', RateLimitService.generalAuth, AuthController.register);
router.post('/verify-email', RateLimitService.generalAuth, AuthController.verifyEmail);
router.post('/resend-otp', RateLimitService.otpResend, AuthController.resendOtp);
router.post('/login', RateLimitService.login, AuthController.login);
router.post('/refresh', RateLimitService.generalAuth, AuthController.refresh);
router.post('/logout', AuthController.logout);
router.post('/forgot-password', RateLimitService.passwordReset, AuthController.forgotPassword);
router.post('/reset-password', RateLimitService.generalAuth, AuthController.resetPassword);

// Staff Activation (Public, single-use invite token)
router.post('/staff/activate', RateLimitService.generalAuth, StaffController.activateStaff);

// OAuth Endpoints
router.get('/oauth/google', AuthController.getGoogleAuthUrl);
router.get('/oauth/google/callback', AuthController.googleOAuthCallback);

// Authenticated Endpoints
router.get('/me', authenticate, AuthController.getMe);
router.post('/logout-all', authenticate, AuthController.logoutAll);
router.post('/change-password', authenticate, AuthController.changePassword);
router.get('/sessions', authenticate, AuthController.getSessions);
router.delete('/sessions/:id', authenticate, AuthController.revokeSession);
router.delete('/sessions', authenticate, AuthController.revokeAllOtherSessions);
router.get('/audit-log', authenticate, AuthController.getAuditLog);

// Staff Provisioning & Governance Endpoints (RBAC protected)
router.get('/staff', authenticate, requireRole('HOSPITAL_ADMIN', 'SUPER_ADMIN', 'DEPARTMENT_MANAGER'), StaffController.listStaff);
router.post('/staff/invite', authenticate, requireRole('HOSPITAL_ADMIN', 'SUPER_ADMIN'), RateLimitService.staffInvite, StaffController.inviteStaff);
router.patch('/staff/:id/status', authenticate, requireRole('HOSPITAL_ADMIN', 'SUPER_ADMIN'), StaffController.updateStaffStatus);
router.patch('/staff/:id/role', authenticate, requireRole('HOSPITAL_ADMIN', 'SUPER_ADMIN'), StaffController.updateStaffRole);
router.post('/staff/:id/resend-invite', authenticate, requireRole('HOSPITAL_ADMIN', 'SUPER_ADMIN'), RateLimitService.staffInvite, StaffController.resendInvite);
router.delete('/staff/:id', authenticate, requireRole('HOSPITAL_ADMIN', 'SUPER_ADMIN'), StaffController.deleteStaff);

export const authRoutes = router;
