import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import {
  UserRecord,
  SessionRecord,
  EmailVerificationRecord,
  PasswordResetRecord,
  AuditEventRecord,
  SafeUser,
  ROLE_PERMISSIONS
} from '../models/types';
import { UserModel } from '../models/schemas/User';
import { SessionModel } from '../models/schemas/Session';
import { EmailVerificationModel } from '../models/schemas/EmailVerification';
import { PasswordResetModel } from '../models/schemas/PasswordReset';
import { AuditEventModel } from '../models/schemas/AuditEvent';

interface DatabaseSchema {
  users: UserRecord[];
  sessions: SessionRecord[];
  emailVerifications: EmailVerificationRecord[];
  passwordResets: PasswordResetRecord[];
  auditEvents: AuditEventRecord[];
}

const DATA_DIR = path.resolve(__dirname, '../../data');
const DB_FILE = path.join(DATA_DIR, 'intellicare.db.json');

class StorageDatabase {
  private users: Map<string, UserRecord> = new Map(); // id -> user
  private userEmailIndex: Map<string, string> = new Map(); // lowercase email -> id
  private userInviteTokenIndex: Map<string, string> = new Map(); // inviteToken -> id
  private sessions: Map<string, SessionRecord> = new Map(); // sessionId -> session
  private sessionTokenIndex: Map<string, string> = new Map(); // refreshTokenHash -> sessionId
  private emailVerifications: Map<string, EmailVerificationRecord> = new Map(); // email -> record
  private passwordResets: Map<string, PasswordResetRecord> = new Map(); // tokenHash -> record
  private auditEvents: AuditEventRecord[] = [];

  constructor() {
    this.init();
  }

  public async syncWithMongoDB() {
    try {
      if (mongoose.connection.readyState === 1) {
        // Load users from MongoDB
        const mongoUsers = await UserModel.find().lean();
        if (mongoUsers.length > 0) {
          for (const u of mongoUsers as any[]) {
            const userRecord: UserRecord = {
              id: u.id,
              organizationId: u.organizationId,
              organizationName: u.organizationName || 'IntelliCare Metropolitan Medical Center',
              departmentId: u.departmentId,
              departmentName: u.departmentName,
              email: u.email,
              name: u.name,
              title: u.title,
              role: u.role,
              status: u.status,
              emailVerified: Boolean(u.emailVerified),
              passwordHash: u.passwordHash,
              avatarUrl: u.avatarUrl,
              invitedBy: u.invitedBy,
              inviteToken: u.inviteToken,
              inviteExpiresAt: u.inviteExpiresAt ? new Date(u.inviteExpiresAt).toISOString() : undefined,
              lastLoginAt: u.lastLoginAt ? new Date(u.lastLoginAt).toISOString() : undefined,
              createdAt: u.createdAt ? new Date(u.createdAt).toISOString() : new Date().toISOString(),
              updatedAt: u.updatedAt ? new Date(u.updatedAt).toISOString() : new Date().toISOString()
            };
            this.users.set(userRecord.id, userRecord);
            this.userEmailIndex.set(userRecord.email.toLowerCase(), userRecord.id);
            if (userRecord.inviteToken) {
              this.userInviteTokenIndex.set(userRecord.inviteToken, userRecord.id);
            }
          }
          console.log(`🌿 Synced ${mongoUsers.length} user records from MongoDB.`);
        }
      }
    } catch (err: any) {
      console.warn('[StorageDatabase] MongoDB sync warning:', err.message);
    }
  }

  private init() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }

      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf8');
        const data: DatabaseSchema = JSON.parse(raw);
        this.loadFromData(data);
      } else {
        this.seedInitialUsers();
        this.persist();
      }
    } catch (err) {
      console.warn('[Database] Initial load warning, initializing fresh memory store:', err);
      this.seedInitialUsers();
    }
  }

  private loadFromData(data: DatabaseSchema) {
    this.users.clear();
    this.userEmailIndex.clear();
    for (const u of data.users || []) {
      this.users.set(u.id, u);
      this.userEmailIndex.set(u.email.toLowerCase(), u.id);
    }

    this.sessions.clear();
    this.sessionTokenIndex.clear();
    for (const s of data.sessions || []) {
      this.sessions.set(s.id, s);
      if (!s.revokedAt) {
        this.sessionTokenIndex.set(s.refreshTokenHash, s.id);
      }
    }

    this.emailVerifications.clear();
    for (const ev of data.emailVerifications || []) {
      this.emailVerifications.set(ev.email.toLowerCase(), ev);
    }

    this.passwordResets.clear();
    for (const pr of data.passwordResets || []) {
      this.passwordResets.set(pr.tokenHash, pr);
    }

    this.auditEvents = data.auditEvents || [];
  }

  private persist() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      const data: DatabaseSchema = {
        users: Array.from(this.users.values()),
        sessions: Array.from(this.sessions.values()),
        emailVerifications: Array.from(this.emailVerifications.values()),
        passwordResets: Array.from(this.passwordResets.values()),
        auditEvents: this.auditEvents
      };
      // Atomic write using temporary file
      const tempFile = `${DB_FILE}.tmp.${Date.now()}`;
      fs.writeFileSync(tempFile, JSON.stringify(data, null, 2), 'utf8');
      fs.renameSync(tempFile, DB_FILE);
    } catch (err) {
      console.error('[Database] Failed to persist data to disk:', err);
    }
  }

  private seedInitialUsers() {
    // Default enterprise password for seeded personas: IntelliCare@2026!
    const defaultPasswordHash = bcrypt.hashSync('IntelliCare@2026!', 10);
    const now = new Date().toISOString();

    const initialUsers: UserRecord[] = [
      {
        id: 'usr-admin-01',
        organizationId: 'org-metro-01',
        departmentId: 'dept-all',
        email: 'sarah.chen@intellicare.health',
        name: 'Dr. Sarah Chen',
        title: 'Chief Medical Operations Officer',
        role: 'HOSPITAL_ADMIN',
        status: 'ACTIVE',
        emailVerified: true,
        passwordHash: defaultPasswordHash,
        avatarUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=200',
        createdAt: now,
        updatedAt: now
      },
      {
        id: 'usr-super-01',
        organizationId: 'org-metro-01',
        email: 'alex.ross@intellicare.health',
        name: 'Alex Ross',
        title: 'Principal Systems Architect',
        role: 'SUPER_ADMIN',
        status: 'ACTIVE',
        emailVerified: true,
        passwordHash: defaultPasswordHash,
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
        createdAt: now,
        updatedAt: now
      },
      {
        id: 'usr-dept-01',
        organizationId: 'org-metro-01',
        departmentId: 'dept-icu',
        email: 'marcus.vance@intellicare.health',
        name: 'Dr. Marcus Vance',
        title: 'Clinical Director of Intensive Care',
        role: 'DEPARTMENT_MANAGER',
        status: 'ACTIVE',
        emailVerified: true,
        passwordHash: defaultPasswordHash,
        avatarUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=200',
        createdAt: now,
        updatedAt: now
      },
      {
        id: 'usr-coord-01',
        organizationId: 'org-metro-01',
        departmentId: 'dept-all',
        email: 'elena.rostova@intellicare.health',
        name: 'Elena Rostova',
        title: 'Emergency Flow & Capacity Specialist',
        role: 'OPERATIONS_COORDINATOR',
        status: 'ACTIVE',
        emailVerified: true,
        passwordHash: defaultPasswordHash,
        createdAt: now,
        updatedAt: now
      },
      {
        id: 'usr-staff-01',
        organizationId: 'org-metro-01',
        departmentId: 'dept-icu',
        email: 'david.kim@intellicare.health',
        name: 'David Kim',
        title: 'ICU Charge Nurse & Triage Lead',
        role: 'AUTHORIZED_STAFF',
        status: 'ACTIVE',
        emailVerified: true,
        passwordHash: defaultPasswordHash,
        createdAt: now,
        updatedAt: now
      }
    ];

    for (const u of initialUsers) {
      this.users.set(u.id, u);
      this.userEmailIndex.set(u.email.toLowerCase(), u.id);
    }
  }

  // --- User Repository ---
  findUserById(id: string): UserRecord | undefined {
    return this.users.get(id);
  }

  findUserByEmail(email: string): UserRecord | undefined {
    const id = this.userEmailIndex.get(email.trim().toLowerCase());
    if (!id) return undefined;
    return this.users.get(id);
  }

  findUserByInviteToken(token: string): UserRecord | undefined {
    const id = this.userInviteTokenIndex.get(token);
    if (!id) return undefined;
    return this.users.get(id);
  }

  findStaffByOrganizationId(
    organizationId: string,
    filters?: { role?: string; departmentId?: string; status?: string; search?: string }
  ): SafeUser[] {
    let list: UserRecord[] = [];
    for (const u of this.users.values()) {
      if (u.organizationId === organizationId) {
        list.push(u);
      }
    }

    if (filters?.role && filters.role !== 'ALL') {
      list = list.filter(u => u.role === filters.role);
    }
    if (filters?.departmentId && filters.departmentId !== 'ALL') {
      list = list.filter(u => u.departmentId === filters.departmentId);
    }
    if (filters?.status && filters.status !== 'ALL') {
      list = list.filter(u => u.status === filters.status);
    }
    if (filters?.search && filters.search.trim()) {
      const q = filters.search.trim().toLowerCase();
      list = list.filter(
        u =>
          u.name.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q) ||
          u.title.toLowerCase().includes(q)
      );
    }

    return list.map(u => this.toSafeUser(u));
  }

  createUser(user: UserRecord): UserRecord {
    this.users.set(user.id, user);
    this.userEmailIndex.set(user.email.trim().toLowerCase(), user.id);
    if (user.inviteToken) {
      this.userInviteTokenIndex.set(user.inviteToken, user.id);
    }
    this.persist();

    // Async write to MongoDB if connected
    if (mongoose.connection.readyState === 1) {
      UserModel.findOneAndUpdate(
        { id: user.id },
        {
          id: user.id,
          organizationId: user.organizationId,
          organizationName: user.organizationName || 'IntelliCare Metropolitan Medical Center',
          departmentId: user.departmentId || 'dept-all',
          departmentName: user.departmentName || 'Hospital Operations',
          email: user.email.toLowerCase().trim(),
          name: user.name,
          title: user.title,
          role: user.role,
          status: user.status,
          emailVerified: user.emailVerified,
          passwordHash: user.passwordHash,
          avatarUrl: user.avatarUrl,
          invitedBy: user.invitedBy,
          inviteToken: user.inviteToken,
          inviteExpiresAt: user.inviteExpiresAt ? new Date(user.inviteExpiresAt) : undefined,
          lastLoginAt: user.lastLoginAt ? new Date(user.lastLoginAt) : undefined
        },
        { upsert: true, returnDocument: 'after' }
      ).catch(err => console.error('[MongoDB createUser Error]', err.message));
    }

    return user;
  }

  updateUser(id: string, updates: Partial<UserRecord>): UserRecord | undefined {
    const existing = this.users.get(id);
    if (!existing) return undefined;
    const updated: UserRecord = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString()
    };
    this.users.set(id, updated);
    if (updates.email && updates.email !== existing.email) {
      this.userEmailIndex.delete(existing.email.toLowerCase());
      this.userEmailIndex.set(updates.email.toLowerCase(), id);
    }
    if (updates.inviteToken !== undefined) {
      if (existing.inviteToken) this.userInviteTokenIndex.delete(existing.inviteToken);
      if (updates.inviteToken) this.userInviteTokenIndex.set(updates.inviteToken, id);
    }
    this.persist();

    // Async update to MongoDB if connected
    if (mongoose.connection.readyState === 1) {
      const mongoUpdates: any = { ...updates, updatedAt: new Date() };
      if (updates.inviteExpiresAt) mongoUpdates.inviteExpiresAt = new Date(updates.inviteExpiresAt);
      if (updates.lastLoginAt) mongoUpdates.lastLoginAt = new Date(updates.lastLoginAt);

      UserModel.findOneAndUpdate({ id }, { $set: mongoUpdates }).catch(err =>
        console.error('[MongoDB updateUser Error]', err.message)
      );
    }

    return updated;
  }

  deleteUser(id: string): boolean {
    const existing = this.users.get(id);
    if (!existing) return false;
    this.users.delete(id);
    this.userEmailIndex.delete(existing.email.toLowerCase());
    if (existing.inviteToken) this.userInviteTokenIndex.delete(existing.inviteToken);
    this.persist();

    // Async delete from MongoDB if connected
    if (mongoose.connection.readyState === 1) {
      UserModel.deleteOne({ id }).catch(err => console.error('[MongoDB deleteUser Error]', err.message));
    }
    return true;
  }

  toSafeUser(user: UserRecord): SafeUser {
    return {
      id: user.id,
      organizationId: user.organizationId,
      organizationName: user.organizationName || 'IntelliCare Metropolitan Medical Center',
      departmentId: user.departmentId,
      departmentName: user.departmentName || (user.departmentId === 'dept-icu' ? 'Intensive Care Unit (ICU)' : 'Hospital Operations'),
      email: user.email,
      name: user.name,
      title: user.title,
      role: user.role,
      status: user.status,
      emailVerified: user.emailVerified,
      permissions: ROLE_PERMISSIONS[user.role] || [],
      avatarUrl: user.avatarUrl,
      lastLoginAt: user.lastLoginAt,
      createdAt: user.createdAt
    };
  }

  // --- Session Repository ---
  createSession(session: SessionRecord): SessionRecord {
    this.sessions.set(session.id, session);
    this.sessionTokenIndex.set(session.refreshTokenHash, session.id);
    this.persist();

    if (mongoose.connection.readyState === 1) {
      SessionModel.create({
        id: session.id,
        userId: session.userId,
        refreshTokenHash: session.refreshTokenHash,
        ipAddress: session.ipAddress,
        userAgent: session.userAgent,
        device: session.device,
        browser: session.browser,
        os: session.os,
        approximateLocation: session.approximateLocation,
        loginMethod: session.loginMethod,
        lastUsedAt: new Date(session.lastUsedAt),
        expiresAt: new Date(session.expiresAt)
      }).catch(err => console.error('[MongoDB createSession Error]', err.message));
    }

    return session;
  }

  findSessionById(id: string): SessionRecord | undefined {
    return this.sessions.get(id);
  }

  findSessionByRefreshTokenHash(hash: string): SessionRecord | undefined {
    const id = this.sessionTokenIndex.get(hash);
    if (!id) return undefined;
    return this.sessions.get(id);
  }

  updateSession(id: string, updates: Partial<SessionRecord>): SessionRecord | undefined {
    const existing = this.sessions.get(id);
    if (!existing) return undefined;
    if (updates.refreshTokenHash && updates.refreshTokenHash !== existing.refreshTokenHash) {
      this.sessionTokenIndex.delete(existing.refreshTokenHash);
      this.sessionTokenIndex.set(updates.refreshTokenHash, id);
    }
    const updated = { ...existing, ...updates };
    this.sessions.set(id, updated);
    this.persist();

    if (mongoose.connection.readyState === 1) {
      const mongoUpdates: any = { ...updates };
      if (updates.lastUsedAt) mongoUpdates.lastUsedAt = new Date(updates.lastUsedAt);
      if (updates.expiresAt) mongoUpdates.expiresAt = new Date(updates.expiresAt);
      if (updates.revokedAt) mongoUpdates.revokedAt = new Date(updates.revokedAt);

      SessionModel.updateOne({ id }, { $set: mongoUpdates }).catch(err =>
        console.error('[MongoDB updateSession Error]', err.message)
      );
    }

    return updated;
  }

  revokeSession(id: string): boolean {
    const session = this.sessions.get(id);
    if (!session) return false;
    const now = new Date();
    session.revokedAt = now.toISOString();
    this.sessionTokenIndex.delete(session.refreshTokenHash);
    this.persist();

    if (mongoose.connection.readyState === 1) {
      SessionModel.updateOne({ id }, { $set: { revokedAt: now } }).catch(err =>
        console.error('[MongoDB revokeSession Error]', err.message)
      );
    }
    return true;
  }

  revokeAllUserSessions(userId: string): number {
    let count = 0;
    const now = new Date();
    const nowIso = now.toISOString();
    for (const session of this.sessions.values()) {
      if (session.userId === userId && !session.revokedAt) {
        session.revokedAt = nowIso;
        this.sessionTokenIndex.delete(session.refreshTokenHash);
        count++;
      }
    }
    if (count > 0) {
      this.persist();
      if (mongoose.connection.readyState === 1) {
        SessionModel.updateMany({ userId, revokedAt: { $exists: false } }, { $set: { revokedAt: now } }).catch(
          err => console.error('[MongoDB revokeAllUserSessions Error]', err.message)
        );
      }
    }
    return count;
  }

  findActiveSessionsByUserId(userId: string): SessionRecord[] {
    const now = new Date();
    const active: SessionRecord[] = [];
    for (const s of this.sessions.values()) {
      if (s.userId === userId && !s.revokedAt && new Date(s.expiresAt) > now) {
        active.push(s);
      }
    }
    // Sort by lastUsedAt descending
    return active.sort((a, b) => new Date(b.lastUsedAt).getTime() - new Date(a.lastUsedAt).getTime());
  }

  // --- Email Verification Repository ---
  createEmailVerification(record: EmailVerificationRecord): EmailVerificationRecord {
    this.emailVerifications.set(record.email.toLowerCase(), record);
    this.persist();
    return record;
  }

  findEmailVerificationByEmail(email: string): EmailVerificationRecord | undefined {
    return this.emailVerifications.get(email.toLowerCase());
  }

  updateEmailVerification(email: string, updates: Partial<EmailVerificationRecord>): EmailVerificationRecord | undefined {
    const existing = this.emailVerifications.get(email.toLowerCase());
    if (!existing) return undefined;
    const updated = { ...existing, ...updates };
    this.emailVerifications.set(email.toLowerCase(), updated);
    this.persist();
    return updated;
  }

  deleteEmailVerification(email: string): boolean {
    const res = this.emailVerifications.delete(email.toLowerCase());
    if (res) this.persist();
    return res;
  }

  // --- Password Reset Repository ---
  createPasswordReset(record: PasswordResetRecord): PasswordResetRecord {
    this.passwordResets.set(record.tokenHash, record);
    this.persist();
    return record;
  }

  findPasswordResetByTokenHash(tokenHash: string): PasswordResetRecord | undefined {
    return this.passwordResets.get(tokenHash);
  }

  updatePasswordReset(tokenHash: string, updates: Partial<PasswordResetRecord>): PasswordResetRecord | undefined {
    const existing = this.passwordResets.get(tokenHash);
    if (!existing) return undefined;
    const updated = { ...existing, ...updates };
    this.passwordResets.set(tokenHash, updated);
    this.persist();
    return updated;
  }

  // --- Audit Event Repository ---
  createAuditEvent(event: AuditEventRecord): AuditEventRecord {
    this.auditEvents.push(event);
    // Keep last 1,000 events in memory cache to prevent unbounded growth
    if (this.auditEvents.length > 1000) {
      this.auditEvents = this.auditEvents.slice(-1000);
    }
    this.persist();

    if (mongoose.connection.readyState === 1) {
      AuditEventModel.create({
        id: event.id,
        userId: event.userId,
        sessionId: event.sessionId,
        eventType: event.eventType,
        ipAddress: event.ipAddress,
        userAgent: event.userAgent,
        metadata: event.metadata,
        timestamp: new Date(event.timestamp)
      }).catch(err => console.error('[MongoDB createAuditEvent Error]', err.message));
    }

    return event;
  }

  findAuditEventsByUserId(userId: string, limit = 25): AuditEventRecord[] {
    return this.auditEvents
      .filter(e => e.userId === userId)
      .slice(-limit)
      .reverse();
  }
}

export const db = new StorageDatabase();
