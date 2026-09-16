import { Router } from 'express';
import { AuthController } from '../controllers/authController';
import { authenticate } from '../middleware/authenticate';
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

export const authRoutes = router;
