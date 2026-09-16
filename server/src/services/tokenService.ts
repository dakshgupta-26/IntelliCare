import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { config } from '../config/env';
import { UserRole } from '../models/types';

export interface AccessTokenPayload {
  sub: string; // userId
  sessionId: string;
  role: UserRole;
  iat?: number;
  exp?: number;
}

export class TokenService {
  /**
   * Generates a short-lived JWT access token (15 minutes).
   * Minimal claims only: sub, sessionId, role.
   */
  static generateAccessToken(userId: string, sessionId: string, role: UserRole): string {
    const payload: AccessTokenPayload = {
      sub: userId,
      sessionId,
      role
    };

    return jwt.sign(payload, config.jwtAccessSecret, {
      expiresIn: '15m',
      algorithm: 'HS256'
    });
  }

  /**
   * Generates a high-entropy, cryptographically secure random refresh token (64 bytes / 128 hex chars).
   */
  static generateRefreshToken(): string {
    return crypto.randomBytes(64).toString('hex');
  }

  /**
   * Hashes a sensitive token (refresh token, reset token, OTP) using SHA-256 before database storage.
   */
  static hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  /**
   * Verifies and decodes an access token.
   * Returns null if invalid or expired.
   */
  static verifyAccessToken(token: string): AccessTokenPayload | null {
    try {
      const decoded = jwt.verify(token, config.jwtAccessSecret, {
        algorithms: ['HS256']
      }) as AccessTokenPayload;
      return decoded;
    } catch {
      return null;
    }
  }

  /**
   * Generates a cryptographically secure 6-digit OTP string (e.g. "482913").
   * Never uses Math.random().
   */
  static generateSecureOTP(): string {
    const num = crypto.randomInt(100000, 999999);
    return num.toString();
  }

  /**
   * Generates a cryptographically secure 32-byte password reset token.
   */
  static generatePasswordResetToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }
}
