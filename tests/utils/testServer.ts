import express, { Express } from 'express';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { initDb, closeDb } from '../../server/db';

let app: Express | null = null;
let server: http.Server | null = null;
let io: SocketIOServer | null = null;

export function createTestServer(): { app: Express; server: http.Server; io: SocketIOServer } {
  // Initialize database
  initDb();

  // Create Express app
  app = express();

  // Middleware
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true }));

  // CORS for tests
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method === 'OPTIONS') {
      return res.sendStatus(200);
    }
    next();
  });

  // Health check
  app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Import routes
  const authRoutes = require('../../server/routes/auth').default;
  const projectsRoutes = require('../../server/routes/projects').default;
  const slidesRoutes = require('../../server/routes/slides').default;
  const templatesRoutes = require('../../server/routes/templates').default;
  const chatRoutes = require('../../server/routes/chat').default;
  const exportRoutes = require('../../server/routes/export').default;
  const commentsRoutes = require('../../server/routes/comments').default;
  const variablesRoutes = require('../../server/routes/variables').default;

  // Mount routes
  app.use('/api/auth', authRoutes);
  app.use('/api/projects', projectsRoutes);
  app.use('/api/slides', slidesRoutes);
  app.use('/api/templates', templatesRoutes);
  app.use('/api/chat', chatRoutes);
  app.use('/api/export', exportRoutes);
  app.use('/api/comments', commentsRoutes);
  app.use('/api/variables', variablesRoutes);

  // Error handler
  app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('Test server error:', err);
    res.status(err.status || 500).json({
      error: err.message || 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    });
  });

  // Create HTTP server
  server = http.createServer(app);

  // Create Socket.IO server
  io = new SocketIOServer(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  // Socket.IO connection handler
  io.on('connection', (socket) => {
    console.log('Test client connected:', socket.id);

    socket.on('join-project', (projectId: string) => {
      socket.join(`project:${projectId}`);
      socket.emit('joined-project', projectId);
    });

    socket.on('leave-project', (projectId: string) => {
      socket.leave(`project:${projectId}`);
    });

    socket.on('cursor-move', (data: { projectId: string; x: number; y: number }) => {
      socket.to(`project:${data.projectId}`).emit('cursor-update', {
        socketId: socket.id,
        x: data.x,
        y: data.y,
      });
    });

    socket.on('disconnect', () => {
      console.log('Test client disconnected:', socket.id);
    });
  });

  return { app, server, io };
}

export function getTestApp(): Express {
  if (!app) {
    throw new Error('Test server not initialized. Call createTestServer() first.');
  }
  return app;
}

export function getTestServer(): http.Server {
  if (!server) {
    throw new Error('Test server not initialized. Call createTestServer() first.');
  }
  return server;
}

export function getTestIO(): SocketIOServer {
  if (!io) {
    throw new Error('Test Socket.IO server not initialized. Call createTestServer() first.');
  }
  return io;
}

export async function startTestServer(port: number = 3001): Promise<{ app: Express; server: http.Server; port: number }> {
  const { server: testServer, app: testApp } = createTestServer();

  return new Promise((resolve) => {
    testServer.listen(port, () => {
      console.log(`Test server running on port ${port}`);
      resolve({ app: testApp, server: testServer, port });
    });
  });
}

export function stopTestServer(): Promise<void> {
  return new Promise((resolve) => {
    if (io) {
      io.close();
      io = null;
    }
    if (server) {
      server.close(() => {
        server = null;
        app = null;
        closeDb();
        resolve();
      });
    } else {
      resolve();
    }
  });
}
