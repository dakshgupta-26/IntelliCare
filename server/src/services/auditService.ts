import crypto from 'crypto';
import { db } from '../storage/db';
import { AuditEventRecord, AuditEventType } from '../models/types';

export class AuditService {
  /**
   * Records an immutable security audit event with automatic secret redaction.
   */
  static log(
    eventType: AuditEventType,
    options: {
      userId?: string;
      sessionId?: string;
      ipAddress?: string;
      userAgent?: string;
      metadata?: Record<string, any>;
    }
  ): AuditEventRecord {
    // Redact any accidental sensitive fields in metadata
    const cleanMeta = options.metadata ? { ...options.metadata } : {};
    delete cleanMeta.password;
    delete cleanMeta.passwordHash;
    delete cleanMeta.token;
    delete cleanMeta.refreshToken;
    delete cleanMeta.otp;
    delete cleanMeta.secret;

    const event: AuditEventRecord = {
      id: `audit-${crypto.randomUUID()}`,
      userId: options.userId,
      sessionId: options.sessionId,
      eventType,
      ipAddress: options.ipAddress,
      userAgent: options.userAgent,
      timestamp: new Date().toISOString(),
      metadata: Object.keys(cleanMeta).length > 0 ? cleanMeta : undefined
    };

    db.createAuditEvent(event);

    // Structured server log
    console.log(`[AUDIT] [${event.timestamp}] ${event.eventType} - User: ${event.userId || 'anonymous'} - IP: ${event.ipAddress || 'unknown'}`);

    return event;
  }
}
