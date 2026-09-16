import mongoose, { Schema, Document } from 'mongoose';
import { UserRole, UserStatus } from '../types';

export interface IUserDocument extends Document {
  id: string;
  organizationId: string;
  organizationName: string;
  departmentId?: string;
  departmentName?: string;
  email: string;
  name: string;
  title: string;
  role: UserRole;
  status: UserStatus;
  emailVerified: boolean;
  passwordHash: string;
  avatarUrl?: string;
  invitedBy?: string;
  inviteToken?: string;
  inviteExpiresAt?: Date;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUserDocument>(
  {
    id: { type: String, required: true, unique: true, index: true },
    organizationId: { type: String, required: true, index: true },
    organizationName: { type: String, required: true, default: 'IntelliCare Metropolitan Medical Center' },
    departmentId: { type: String, default: 'dept-all' },
    departmentName: { type: String, default: 'Hospital Operations' },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    name: { type: String, required: true, trim: true },
    title: { type: String, required: true, trim: true },
    role: {
      type: String,
      required: true,
      enum: ['SUPER_ADMIN', 'HOSPITAL_ADMIN', 'DEPARTMENT_MANAGER', 'OPERATIONS_COORDINATOR', 'AUTHORIZED_STAFF'],
      default: 'AUTHORIZED_STAFF',
      index: true
    },
    status: {
      type: String,
      required: true,
      enum: ['ACTIVE', 'INVITED', 'SUSPENDED', 'LOCKED'],
      default: 'ACTIVE',
      index: true
    },
    emailVerified: { type: Boolean, default: false, index: true },
    passwordHash: { type: String, required: true },
    avatarUrl: { type: String },
    invitedBy: { type: String },
    inviteToken: { type: String, index: true },
    inviteExpiresAt: { type: Date },
    lastLoginAt: { type: Date }
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (_doc, ret) => {
        delete (ret as any)._id;
        delete (ret as any).__v;
        delete (ret as any).passwordHash;
        delete (ret as any).inviteToken;
        return ret;
      }
    }
  }
);

export const UserModel = mongoose.model<IUserDocument>('User', UserSchema);
