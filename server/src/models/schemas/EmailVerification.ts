import mongoose, { Schema, Document } from 'mongoose';

export interface IEmailVerificationDocument extends Document {
  id: string;
  userId: string;
  email: string;
  otpHash: string;
  attempts: number;
  expiresAt: Date;
  lastSentAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const EmailVerificationSchema = new Schema<IEmailVerificationDocument>(
  {
    id: { type: String, required: true, unique: true, index: true },
    userId: { type: String, required: true, index: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    otpHash: { type: String, required: true },
    attempts: { type: Number, default: 0 },
    expiresAt: { type: Date, required: true },
    lastSentAt: { type: Date, default: Date.now }
  },
  {
    timestamps: true
  }
);

// Auto-delete expired verification records after 1 hour
EmailVerificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 3600 });

export const EmailVerificationModel = mongoose.model<IEmailVerificationDocument>(
  'EmailVerification',
  EmailVerificationSchema
);
