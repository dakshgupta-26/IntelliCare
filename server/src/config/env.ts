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
}

const nodeEnv = (process.env.NODE_ENV as any) || 'development';
const isProd = nodeEnv === 'production';

export const config: ServerConfig = {
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv,
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
  backendUrl: process.env.BACKEND_URL || 'http://localhost:5000',
  mongodbUri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/intellicare',
  jwtAccessSecret: process.env.JWT_ACCESS_SECRET || 'intellicare_dev_access_secret_f829d10e54b68c92a1047db381e0569a',
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || 'intellicare_dev_refresh_secret_a941e72b380f5c12d69e481b7a2095f3',
  mailjet: {
    apiKey: process.env.MAILJET_API_KEY || '',
    secretKey: process.env.MAILJET_SECRET_KEY || '',
    senderEmail: process.env.MAILJET_SENDER_EMAIL || 'security@intellicare.health',
    senderName: process.env.MAILJET_SENDER_NAME || 'IntelliCare AI Security',
    isConfigured: Boolean(process.env.MAILJET_API_KEY && process.env.MAILJET_SECRET_KEY)
  },
  googleOAuth: {
    clientId: process.env.GOOGLE_CLIENT_ID || '',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    redirectUri: process.env.GOOGLE_REDIRECT_URI || 'http://localhost:5000/auth/oauth/google/callback',
    isConfigured: Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET)
  },
  cookieDomain: process.env.COOKIE_DOMAIN || undefined,
  cookieSecure: isProd
};
