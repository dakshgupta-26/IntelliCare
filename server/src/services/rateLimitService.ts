import rateLimit from 'express-rate-limit';

export class RateLimitService {
  /**
   * General authentication rate limiter.
   */
  static generalAuth = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 50,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      success: false,
      error: 'Too many authentication requests from this IP. Please try again in 15 minutes.'
    }
  });

  /**
   * Stricter brute-force protection for login attempts.
   */
  static login = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 15,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      success: false,
      error: 'Too many failed sign-in attempts. Please try again in 15 minutes.'
    }
  });

  /**
   * Rate limiter for OTP resends to prevent SMS/email flooding.
   */
  static otpResend = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 6,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      success: false,
      error: 'Too many verification code requests. Please wait before requesting another code.'
    }
  });

  /**
   * Rate limiter for forgot-password endpoint to prevent email spam.
   */
  static passwordReset = rateLimit({
    windowMs: 30 * 60 * 1000, // 30 minutes
    max: 6,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      success: false,
      error: 'Too many password reset requests. Please wait before trying again.'
    }
  });

  /**
   * Rate limiter for staff invitations to prevent email flooding.
   */
  static staffInvite = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 25,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      success: false,
      error: 'Too many staff invitations sent in a short period. Please wait 15 minutes before sending more invites.'
    }
  });
}
