import mongoose, { Schema, Document } from 'mongoose';
import { AuditEventType } from '../types';

export interface IAuditEventDocument extends Document {
  id: string;
  userId?: string;
  organizationId?: string;
  sessionId?: string;
  eventType: AuditEventType;
  ipAddress?: string;
  userAgent?: string;
  metadata?: Record<string, any>;
  timestamp: Date;
}

const AuditEventSchema = new Schema<IAuditEventDocument>(
  {
    id: { type: String, required: true, unique: true, index: true },
    userId: { type: String, index: true },
    organizationId: { type: String, index: true },
    sessionId: { type: String, index: true },
    eventType: { type: String, required: true, index: true },
    ipAddress: { type: String },
    userAgent: { type: String },
    metadata: { type: Schema.Types.Mixed },
    timestamp: { type: Date, default: Date.now, index: true }
  },
  {
    timestamps: true
  }
);

export const AuditEventModel = mongoose.model<IAuditEventDocument>('AuditEvent', AuditEventSchema);
