import dotenv from 'dotenv';
dotenv.config();

export interface ServerConfig {
  port: number;
  nodeEnv: 'development' | 'production' | 'test';
  frontendUrl: string;
  backendUrl: string;
  mongodbUri: string;
  jwtAccessSecret: string;
  jwtRefreshSecret: string;
  sessionSecret: string;
  cookieSecret: string;
  dataEncryptionKey: string;
  mailjet: {
    apiKey: string;
    secretKey: string;
    senderEmail: string;
    senderName: string;
    isConfigured: boolean;
  };
  googleOAuth: {
    clientId: string;
    clientSecret: string;
    redirectUri: string;
    isConfigured: boolean;
  };
  cookieDomain?: string;
  cookieSecure: boolean;
  cookieSameSite: 'lax' | 'none' | 'strict';
}

const nodeEnv = (process.env.NODE_ENV as any) || 'development';
const isProd = nodeEnv === 'production';

/**
 * Local DEV mode (APP_ENV=dev, loaded from .env.dev via `npm run dev:local`):
 * local MongoDB, placeholder secrets, emails printed to the console, no OAuth.
 * Lets the app run without any team credentials. Never allowed in production.
 */
export const isDevMode = process.env.APP_ENV === 'dev';
if (isDevMode && isProd) {
  throw new Error('APP_ENV=dev must not be combined with NODE_ENV=production');
}
const devSecret = (name: string) => `intellicare-local-dev-only-${name}-do-not-use-in-production`;
const secret = (envName: string, devName: string) => process.env[envName] || (isDevMode ? devSecret(devName) : '');
const rawSameSite = (process.env.COOKIE_SAME_SITE?.toLowerCase() || (isProd ? 'none' : 'lax')) as 'lax' | 'none' | 'strict';
const cookieSameSite = ['lax', 'none', 'strict'].includes(rawSameSite) ? rawSameSite : (isProd ? 'none' : 'lax');

export const config: ServerConfig = {
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv,
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
  backendUrl: process.env.BACKEND_URL || 'http://localhost:5000',
  mongodbUri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/intellicare',
  jwtAccessSecret: secret('JWT_ACCESS_SECRET', 'jwt-access'),
  jwtRefreshSecret: secret('JWT_REFRESH_SECRET', 'jwt-refresh'),
  sessionSecret: secret('SESSION_SECRET', 'session'),
  cookieSecret: secret('COOKIE_SECRET', 'cookie'),
  dataEncryptionKey: secret('DATA_ENCRYPTION_KEY', 'data-encryption'),
  mailjet: {
    apiKey: process.env.MAILJET_API_KEY || '',
    secretKey: process.env.MAILJET_SECRET_KEY || '',
    senderEmail: process.env.MAILJET_SENDER_EMAIL || 'security@intellicare.health',
    senderName: process.env.MAILJET_SENDER_NAME || 'IntelliCare AI Security',
    // DEV mode always uses the console simulator so local testing never sends real email.
    isConfigured: !isDevMode && Boolean(process.env.MAILJET_API_KEY && process.env.MAILJET_SECRET_KEY)
  },
  googleOAuth: {
    clientId: process.env.GOOGLE_CLIENT_ID || '',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    redirectUri: process.env.GOOGLE_REDIRECT_URI || 'http://localhost:5000/auth/oauth/google/callback',
    isConfigured: !isDevMode && Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET)
  },
  cookieDomain: process.env.COOKIE_DOMAIN || undefined,
  cookieSecure: isProd,
  cookieSameSite
};
