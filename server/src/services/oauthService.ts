import crypto from 'crypto';
import { config } from '../config/env';
import { db } from '../storage/db';
import { UserRecord } from '../models/types';
import bcrypt from 'bcryptjs';

// Cache for OAuth state & PKCE code verifiers
const oauthStateCache = new Map<string, { codeVerifier: string; createdAt: number }>();

export class OAuthService {
  /**
   * Generates Google OAuth 2.0 authorization URL with state and PKCE challenge.
   */
  static generateGoogleAuthUrl(): { authUrl: string; state: string } {
    const state = crypto.randomBytes(24).toString('hex');
    const codeVerifier = crypto.randomBytes(32).toString('base64url');
    const codeChallenge = crypto.createHash('sha256').update(codeVerifier).digest('base64url');

    oauthStateCache.set(state, { codeVerifier, createdAt: Date.now() });

    // Clean old states (>15m)
    for (const [k, v] of oauthStateCache.entries()) {
      if (Date.now() - v.createdAt > 15 * 60 * 1000) {
        oauthStateCache.delete(k);
      }
    }

    if (!config.googleOAuth.isConfigured) {
      // Return simulated auth link for development mode
      return {
        authUrl: `${config.backendUrl}/auth/oauth/google/callback?state=${state}&code=dev_simulated_code`,
        state
      };
    }

    const params = new URLSearchParams({
      client_id: config.googleOAuth.clientId,
      redirect_uri: config.googleOAuth.redirectUri,
      response_type: 'code',
      scope: 'openid email profile',
      state,
      code_challenge: codeChallenge,
      code_challenge_method: 'S256',
      access_type: 'online',
      prompt: 'select_account'
    });

    return {
      authUrl: `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`,
      state
    };
  }

  /**
   * Validates authorization code from Google, verifies OIDC identity, and finds/creates user.
   */
  static async handleGoogleCallback(code: string, state: string): Promise<UserRecord> {
    const stateEntry = oauthStateCache.get(state);
    if (!stateEntry) {
      throw new Error('Invalid or expired OAuth state parameter (possible CSRF attack).');
    }
    oauthStateCache.delete(state);

    let email = '';
    let name = '';
    let avatarUrl: string | undefined = undefined;

    if (!config.googleOAuth.isConfigured || code === 'dev_simulated_code') {
      // Development mode simulation with test profile
      email = 'google.physician@intellicare.health';
      name = 'Dr. Julian Sterling';
      avatarUrl = 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=200';
    } else {
      // Real Google token exchange
      const tokenParams = new URLSearchParams({
        client_id: config.googleOAuth.clientId,
        client_secret: config.googleOAuth.clientSecret,
        code,
        code_verifier: stateEntry.codeVerifier,
        grant_type: 'authorization_code',
        redirect_uri: config.googleOAuth.redirectUri
      });

      const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: tokenParams.toString()
      });

      if (!tokenRes.ok) {
        throw new Error('Failed to exchange authorization code with Google OAuth.');
      }

      const tokens: any = await tokenRes.json();

      // Fetch user profile info
      const userInfoRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${tokens.access_token}` }
      });

      if (!userInfoRes.ok) {
        throw new Error('Failed to retrieve user profile from Google OIDC endpoint.');
      }

      const profile: any = await userInfoRes.json();
      if (!profile.email_verified) {
        throw new Error('Google account email is not verified.');
      }

      email = profile.email;
      name = profile.name || email.split('@')[0];
      avatarUrl = profile.picture;
    }

    // Find or safely create user
    let user = db.findUserByEmail(email);
    if (!user) {
      const now = new Date().toISOString();
      const randomPassword = crypto.randomBytes(32).toString('hex');
      const passwordHash = bcrypt.hashSync(randomPassword, 10);

      user = {
        id: `usr-${crypto.randomUUID().slice(0, 8)}`,
        organizationId: 'org-metro-01',
        departmentId: 'dept-all',
        email: email.toLowerCase().trim(),
        name,
        title: 'Clinical Operations Specialist',
        role: 'AUTHORIZED_STAFF',
        status: 'ACTIVE',
        emailVerified: true, // Google OIDC verified
        passwordHash,
        avatarUrl,
        createdAt: now,
        updatedAt: now
      };
      db.createUser(user);
    } else if (!user.emailVerified) {
      // Mark verified since Google validated it
      user = db.updateUser(user.id, { emailVerified: true })!;
    }

    return user;
  }
}
