import mongoose, { Schema, Document } from 'mongoose';

export interface ISessionDocument extends Document {
  id: string; // UUID
  userId: string;
  refreshTokenHash: string;
  ipAddress?: string;
  userAgent?: string;
  device: string;
  browser: string;
  os: string;
  approximateLocation: string;
  loginMethod: 'password' | 'google_oauth' | 'demo_switch';
  lastUsedAt: Date;
  expiresAt: Date;
  revokedAt?: Date;
  revokedReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

const SessionSchema = new Schema<ISessionDocument>(
  {
    id: { type: String, required: true, unique: true, index: true },
    userId: { type: String, required: true, index: true },
    refreshTokenHash: { type: String, required: true, index: true },
    ipAddress: { type: String },
    userAgent: { type: String },
    device: { type: String, default: 'Desktop' },
    browser: { type: String, default: 'Browser' },
    os: { type: String, default: 'Operating System' },
    approximateLocation: { type: String, default: 'Local Network' },
    loginMethod: {
      type: String,
      enum: ['password', 'google_oauth', 'demo_switch'],
      default: 'password'
    },
    lastUsedAt: { type: Date, default: Date.now },
    expiresAt: { type: Date, required: true },
    revokedAt: { type: Date, index: true },
    revokedReason: { type: String }
  },
  {
    timestamps: true
  }
);

// Auto-expire sessions after expiration time
SessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const SessionModel = mongoose.model<ISessionDocument>('Session', SessionSchema);
