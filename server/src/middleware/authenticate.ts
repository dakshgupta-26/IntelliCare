import { Request, Response, NextFunction } from 'express';
import { TokenService } from '../services/tokenService';
import { db } from '../storage/db';
import { UserRecord, SessionRecord } from '../models/types';

// Extend Express Request interface to include authenticated user and session
declare global {
  namespace Express {
    interface Request {
      user?: UserRecord;
      session?: SessionRecord;
    }
  }
}

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      error: 'Authentication credentials missing. Please sign in.'
    });
  }

  const token = authHeader.split(' ')[1];
  const payload = TokenService.verifyAccessToken(token);

  if (!payload) {
    return res.status(401).json({
      success: false,
      code: 'TOKEN_EXPIRED',
      error: 'Session token has expired. Please refresh credentials.'
    });
  }

  // Verify server-side session validity
  const session = db.findSessionById(payload.sessionId);
  if (!session || session.revokedAt || new Date(session.expiresAt) <= new Date()) {
    return res.status(401).json({
      success: false,
      code: 'SESSION_REVOKED',
      error: 'Session has been revoked or invalidated. Please sign in again.'
    });
  }

  // Load user
  const user = db.findUserById(payload.sub);
  if (!user || user.status !== 'ACTIVE') {
    return res.status(401).json({
      success: false,
      error: 'User account is inactive or suspended.'
    });
  }

  req.user = user;
  req.session = session;
  next();
};
