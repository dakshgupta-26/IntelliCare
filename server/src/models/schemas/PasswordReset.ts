import mongoose, { Schema, Document } from 'mongoose';

export interface IPasswordResetDocument extends Document {
  id: string;
  userId: string;
  email: string;
  tokenHash: string;
  expiresAt: Date;
  usedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const PasswordResetSchema = new Schema<IPasswordResetDocument>(
  {
    id: { type: String, required: true, unique: true, index: true },
    userId: { type: String, required: true, index: true },
    email: { type: String, required: true, lowercase: true, trim: true, index: true },
    tokenHash: { type: String, required: true, unique: true, index: true },
    expiresAt: { type: Date, required: true },
    usedAt: { type: Date }
  },
  {
    timestamps: true
  }
);

// Auto-delete expired password reset records after 2 hours
PasswordResetSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 7200 });

export const PasswordResetModel = mongoose.model<IPasswordResetDocument>(
  'PasswordReset',
  PasswordResetSchema
);
