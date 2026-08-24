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

// Copilot Chat API endpoint
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

// Copilot Autocomplete Suggestions endpoint
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

  // Push periodic live telemetry heartbeat
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

  // Broadcast occasional live operational events (e.g. Optimization Solved, Forecast Spike)
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

if (process.env.NODE_ENV !== 'test') {
  server.listen(PORT, () => {
    console.log(`⚡ IntelliCare API Server running on port ${PORT}`);
    console.log(`⚡ WebSocket gateway listening at ws://localhost:${PORT}/ws`);
  });
}

export { app, server };

