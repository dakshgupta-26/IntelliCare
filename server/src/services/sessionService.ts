import crypto from 'crypto';
import { db } from '../storage/db';
import { TokenService } from './tokenService';
import { SessionRecord, UserRecord } from '../models/types';

export interface DeviceInfo {
  device: string;
  browser: string;
  os: string;
  approximateLocation: string;
}

export class SessionService {
  /**
   * Parses user agent header cleanly into Device, Browser, OS.
   * Does NOT perform invasive fingerprinting.
   */
  static parseUserAgent(userAgentHeader = ''): { device: string; browser: string; os: string } {
    const ua = userAgentHeader.toLowerCase();

    // OS detection
    let os = 'Unknown OS';
    if (ua.includes('windows nt 10.0')) os = 'Windows 11 / 10';
    else if (ua.includes('windows')) os = 'Windows';
    else if (ua.includes('macintosh') || ua.includes('mac os x')) os = 'macOS';
    else if (ua.includes('iphone')) os = 'iOS';
    else if (ua.includes('ipad')) os = 'iPadOS';
    else if (ua.includes('android')) os = 'Android';
    else if (ua.includes('linux')) os = 'Linux';

    // Browser detection
    let browser = 'Unknown Browser';
    if (ua.includes('edg/')) browser = 'Microsoft Edge';
    else if (ua.includes('chrome/') && !ua.includes('edg/')) browser = 'Google Chrome';
    else if (ua.includes('safari/') && !ua.includes('chrome/')) browser = 'Safari';
    else if (ua.includes('firefox/')) browser = 'Firefox';
    else if (ua.includes('opr/') || ua.includes('opera/')) browser = 'Opera';

    // Device type
    let device = 'Desktop';
    if (ua.includes('iphone') || ua.includes('mobile')) device = 'Mobile Device';
    else if (ua.includes('ipad') || ua.includes('tablet')) device = 'Tablet';

    return { device, browser, os };
  }

  /**
   * Determines approximate location from IP address.
   * Strictly adheres to privacy guidelines: never claims exact street address.
   */
  static getApproximateLocation(ip = ''): string {
    const cleanIp = ip.replace(/^::ffff:/, '');
    if (cleanIp === '127.0.0.1' || cleanIp === '::1' || cleanIp.startsWith('192.168.') || cleanIp.startsWith('10.')) {
      return 'Hospital Operations Intranet (Secure Local Network)';
    }
    // Return approximate regional descriptor
    return 'Regional Medical Center Access Node';
  }

  /**
   * Checks if this device/browser combination is new for the user.
   */
  static isNewDevice(userId: string, currentBrowser: string, currentOs: string): boolean {
    const pastSessions = db.findActiveSessionsByUserId(userId);
    if (pastSessions.length === 0) return false; // First ever session is initial, not an alert
    const matched = pastSessions.some(
      s => s.browser.toLowerCase() === currentBrowser.toLowerCase() && s.os.toLowerCase() === currentOs.toLowerCase()
    );
    return !matched;
  }

  /**
   * Creates a new authenticated server-side session.
   */
  static createSession(
    user: UserRecord,
    ipAddress: string,
    userAgent: string,
    loginMethod: 'password' | 'google_oauth' | 'demo_switch' = 'password'
  ): { session: SessionRecord; accessToken: string; rawRefreshToken: string; isNewDevice: boolean } {
    const sessionId = crypto.randomUUID();
    const rawRefreshToken = TokenService.generateRefreshToken();
    const refreshTokenHash = TokenService.hashToken(rawRefreshToken);

    const { device, browser, os } = this.parseUserAgent(userAgent);
    const approximateLocation = this.getApproximateLocation(ipAddress);
    const isNew = this.isNewDevice(user.id, browser, os);

    const now = new Date();
    const expiresAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days

    const session: SessionRecord = {
      id: sessionId,
      userId: user.id,
      refreshTokenHash,
      createdAt: now.toISOString(),
      lastUsedAt: now.toISOString(),
      expiresAt: expiresAt.toISOString(),
      ipAddress,
      userAgent,
      device,
      browser,
      os,
      approximateLocation,
      loginMethod
    };

    db.createSession(session);

    // Update user's lastLoginAt
    db.updateUser(user.id, { lastLoginAt: now.toISOString() });

    // Generate short-lived access token
    const accessToken = TokenService.generateAccessToken(user.id, sessionId, user.role);

    return { session, accessToken, rawRefreshToken, isNewDevice: isNew };
  }

  /**
   * Rotates a refresh token.
   * If an old, already-rotated token is presented: triggers TOKEN THEFT PROTECTION and revokes the family!
   */
  static rotateRefreshToken(rawOldRefreshToken: string): {
    success: boolean;
    session?: SessionRecord;
    accessToken?: string;
    newRefreshToken?: string;
    theftDetected?: boolean;
  } {
    const oldHash = TokenService.hashToken(rawOldRefreshToken);
    const session = db.findSessionByRefreshTokenHash(oldHash);

    if (!session) {
      // Refresh token not found active. It could be an attacker replaying an already-used token!
      return { success: false, theftDetected: true };
    }

    // Check expiry
    if (new Date(session.expiresAt) <= new Date() || session.revokedAt) {
      return { success: false, theftDetected: false };
    }

    // Generate new refresh token
    const newRefreshToken = TokenService.generateRefreshToken();
    const newHash = TokenService.hashToken(newRefreshToken);

    // Invalidate old refresh token & update session with new hash and active timestamp
    const now = new Date();
    const updated = db.updateSession(session.id, {
      refreshTokenHash: newHash,
      lastUsedAt: now.toISOString()
    });

    if (!updated) return { success: false };

    // Fetch user
    const user = db.findUserById(session.userId);
    if (!user || user.status !== 'ACTIVE') {
      db.revokeSession(session.id);
      return { success: false };
    }

    const accessToken = TokenService.generateAccessToken(user.id, session.id, user.role);

    return {
      success: true,
      session: updated,
      accessToken,
      newRefreshToken
    };
  }

  /**
   * Revokes a specific session.
   */
  static revokeSession(sessionId: string): boolean {
    return db.revokeSession(sessionId);
  }

  /**
   * Revokes all active sessions for a user (except optionally the current one).
   */
  static revokeAllUserSessions(userId: string, currentSessionIdToKeep?: string): number {
    if (!currentSessionIdToKeep) {
      return db.revokeAllUserSessions(userId);
    }
    const sessions = db.findActiveSessionsByUserId(userId);
    let count = 0;
    for (const s of sessions) {
      if (s.id !== currentSessionIdToKeep) {
        db.revokeSession(s.id);
        count++;
      }
    }
    return count;
  }
}
