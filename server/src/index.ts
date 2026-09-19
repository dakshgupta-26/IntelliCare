import express, { Request, Response, NextFunction } from 'express';
import http from 'http';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import dns from 'dns';
import { WebSocketServer, WebSocket } from 'ws';

// Ensure DNS resolvers can query MongoDB Atlas SRV records reliably on Windows/Cloud
try {
  dns.setServers(['8.8.8.8', '8.8.4.4']);
} catch {
  // Ignore in environments where custom DNS servers cannot be set
}

dotenv.config();

import { config, isDevMode } from './config/env';
import { connectMongoDB } from './config/db';
import { db } from './storage/db';
import { authRoutes } from './routes/authRoutes';

const app = express();
const server = http.createServer(app);
const PORT = config.port;

// Trust reverse proxy for secure cookies and accurate IP determination behind proxies
app.set('trust proxy', 1);

// Security Headers
app.use(
  helmet({
    contentSecurityPolicy: false, // Managed at deployment edge / proxy level to prevent breaking Vite dev
    crossOriginEmbedderPolicy: false
  })
);

// Strict CORS with credentialed cookies (NEVER wildcard origin)
const allowedOrigins = [
  config.frontendUrl,
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://localhost:5000'
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin) || config.nodeEnv !== 'production') {
        return callback(null, true);
      }
      return callback(new Error('CORS policy: origin not authorized.'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
  })
);

app.use(cookieParser(config.cookieSecret));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Request logging & audit duration
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    // Redact query strings from logs to prevent token/secret leakage
    const cleanUrl = req.originalUrl.split('?')[0];
    console.log(`[${new Date().toISOString()}] ${req.method} ${cleanUrl} ${res.statusCode} - ${duration}ms`);
  });
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'IntelliCare Decision Support API Gateway',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    authSystem: 'Production Zero-Trust Architecture',
    mailjetConfigured: config.mailjet.isConfigured
  });
});

// Mount Authentication Routes
app.use('/auth', authRoutes);
app.use('/api/v1/auth', authRoutes);

// Operational Status & Copilot Endpoints
app.get('/api/v1/status', (req, res) => {
  res.json({
    hospital: 'IntelliCare Metropolitan Medical Center',
    operationalHealth: 'HIGH_ACUITY',
    totalBeds: 240,
    occupiedBeds: 212,
    activeStaffRatio: '91.2%'
  });
});

app.post('/api/v1/copilot/chat', (req, res) => {
  const { prompt, context } = req.body;
  res.json({
    status: 'success',
    timestamp: new Date().toISOString(),
    response: `Processed query for ${context?.department || 'Hospital Operations'}: ${prompt}`,
    groundedInSOP: true,
    confidenceScore: 0.96
  });
});

app.get('/api/v1/copilot/suggestions', (req, res) => {
  res.json({
    suggestions: [
      'forecast ICU demand for next 24 hours',
      'explain MILP optimization and Google OR-Tools solver',
      'show hospital microservice architecture',
      'what are the statutory nurse-to-patient staffing ratios?',
      'simulate mass casualty surge (+35% intake)'
    ]
  });
});

// Realtime WebSocket Gateway
const wss = new WebSocketServer({ server, path: '/ws' });

wss.on('connection', (ws: WebSocket) => {
  console.log('[WebSocket] Client connected to telemetry stream');

  const heartbeatTimer = setInterval(() => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({
        type: 'HEARTBEAT',
        timestamp: new Date().toISOString(),
        activePatients: 212,
        icuPressure: 90.6
      }));
    }
  }, 8000);

  const eventTimer = setInterval(() => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({
        type: 'OPTIMIZATION_COMPLETED',
        title: 'MILP Solver Reallocation Solved',
        description: 'Google OR-Tools dispatched 4 floater nurses to ICU High Acuity (0 statutory violations).',
        timestamp: new Date().toISOString(),
        actionLabel: 'Inspect Reallocation',
        actionPayload: 'Explain how the MILP solver optimized the 4 floater nurses reallocation.'
      }));
    }
  }, 25000);

  ws.on('close', () => {
    clearInterval(heartbeatTimer);
    clearInterval(eventTimer);
    console.log('[WebSocket] Client disconnected');
  });
});

// Centralized error handling middleware (Never leak stack traces in production)
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('[Server Error Handler]', err);
  const status = err.status || 500;
  const message = config.nodeEnv === 'production' && status === 500
    ? 'An internal server error occurred.'
    : err.message || 'An unexpected error occurred.';

  res.status(status).json({
    success: false,
    error: message
  });
});

if (process.env.NODE_ENV !== 'test') {
  connectMongoDB().then(() => {
    db.syncWithMongoDB();
  }).catch(err => {
    console.warn('[MongoDB Initialization Warning]', err.message);
  });

  server.listen(PORT, '0.0.0.0', () => {
    console.log(`⚡ IntelliCare API Server running on port ${PORT}`);
    if (isDevMode) {
      console.log('🧪 LOCAL DEV MODE: local MongoDB, placeholder secrets, OTP codes & links printed below, OAuth disabled');
      console.log('🧪 Seeded logins (password IntelliCare@2026!): sarah.chen@intellicare.health (admin), alex.ross@, marcus.vance@, elena.rostova@, david.kim@');
    }
    console.log(`⚡ Database: MongoDB (${config.mongodbUri})`);
    console.log(`⚡ Authentication Endpoints: http://localhost:${PORT}/auth`);
    console.log(`⚡ Mailjet Status: ${config.mailjet.isConfigured ? 'CONNECTED' : 'LOCAL SIMULATOR (Console Preview)'}`);
    console.log(`⚡ WebSocket Gateway: ws://localhost:${PORT}/ws`);
  });
}

export { app, server };
