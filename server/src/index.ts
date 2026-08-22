import express from 'express';
import http from 'http';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { WebSocketServer, WebSocket } from 'ws';

dotenv.config();

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 5000;

// Security & Middleware
app.use(helmet());
app.use(cors({ origin: '*' }));
app.use(express.json());

// Request logging & tracking
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`);
  });
  next();
});

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'IntelliCare Decision Support API Gateway',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// API Routes
app.get('/api/v1/status', (req, res) => {
  res.json({
    hospital: 'IntelliCare Metropolitan Medical Center',
    operationalHealth: 'HIGH_ACUITY',
    totalBeds: 240,
    occupiedBeds: 212,
    activeStaffRatio: '91.2%'
  });
});

// Realtime WebSocket Gateway
const wss = new WebSocketServer({ server, path: '/ws' });

wss.on('connection', (ws: WebSocket) => {
  console.log('[WebSocket] Client connected to telemetry stream');

  // Push periodic live telemetry heartbeat
  const timer = setInterval(() => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({
        type: 'HEARTBEAT',
        timestamp: new Date().toISOString(),
        activePatients: 212,
        icuPressure: 90.6
      }));
    }
  }, 10000);

  ws.on('close', () => {
    clearInterval(timer);
    console.log('[WebSocket] Client disconnected');
  });
});

if (process.env.NODE_ENV !== 'test') {
  server.listen(PORT, () => {
    console.log(`⚡ IntelliCare API Server running on port ${PORT}`);
    console.log(`⚡ WebSocket gateway listening at ws://localhost:${PORT}/ws`);
  });
}

export { app, server };
