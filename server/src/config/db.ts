import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dns from 'dns';
import { config } from './env';
import { UserModel } from '../models/schemas/User';

export async function connectMongoDB(): Promise<void> {
  try {
    // Ensure DNS resolvers can query MongoDB Atlas SRV records
    try {
      dns.setServers(['8.8.8.8', '8.8.4.4']);
    } catch {
      // Ignore if not permitted
    }

    mongoose.set('strictQuery', true);

    await mongoose.connect(config.mongodbUri, {
      serverSelectionTimeoutMS: 10000,
      autoIndex: true
    });

    // Sanitize URI for console output to avoid exposing credentials in logs
    const sanitizedUri = config.mongodbUri.replace(/\/\/([^:]+):([^@]+)@/, '//$1:****@');
    console.log(`🌿 MongoDB Connected: ${sanitizedUri}`);

    // Verify and seed initial clinical personas if empty
    await seedInitialClinicalPersonas();
  } catch (err: any) {
    console.error('❌ MongoDB Connection Error:', err.message);
    const sanitizedUri = config.mongodbUri.replace(/\/\/([^:]+):([^@]+)@/, '//$1:****@');
    console.warn('⚠️ Please verify MongoDB connection string:', sanitizedUri);
  }

  mongoose.connection.on('disconnected', () => {
    console.warn('⚠️ MongoDB Disconnected. Retrying...');
  });

  mongoose.connection.on('reconnected', () => {
    console.log('🌿 MongoDB Reconnected successfully.');
  });
}

async function seedInitialClinicalPersonas() {
  try {
    const userCount = await UserModel.countDocuments();
    if (userCount > 0) {
      return;
    }

    console.log('🌱 Seeding initial IntelliCare Hospital Admin & Clinical Personas into MongoDB...');

    const defaultPasswordHash = bcrypt.hashSync('IntelliCare@2026!', 10);
    const now = new Date();

    const initialUsers = [
      {
        id: 'usr-admin-01',
        organizationId: 'org-metro-01',
        organizationName: 'IntelliCare Metropolitan Medical Center',
        departmentId: 'dept-all',
        departmentName: 'Hospital Operations',
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
        organizationName: 'IntelliCare Metropolitan Medical Center',
        departmentId: 'dept-all',
        departmentName: 'Executive Systems & AI',
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
        organizationName: 'IntelliCare Metropolitan Medical Center',
        departmentId: 'dept-icu',
        departmentName: 'Intensive Care Unit',
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
        organizationName: 'IntelliCare Metropolitan Medical Center',
        departmentId: 'dept-all',
        departmentName: 'Emergency Operations & Triage',
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
        organizationName: 'IntelliCare Metropolitan Medical Center',
        departmentId: 'dept-icu',
        departmentName: 'Intensive Care Unit',
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

    await UserModel.insertMany(initialUsers);
    console.log(`✅ Seeded ${initialUsers.length} initial clinical accounts in MongoDB.`);
  } catch (err: any) {
    console.error('[Seed Error]', err.message);
  }
}
