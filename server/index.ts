import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { createServer } from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';

dotenv.config();

import { initDb, closeDb } from './db/index.js';
import projectsRouter from './routes/projects.js';
import slidesRouter from './routes/slides.js';
import templatesRouter from './routes/templates.js';
import dealsRouter from './routes/deals.js';
import importRouter from './routes/import.js';
import exportRouter from './routes/export.js';
import chatRouter from './routes/chat.js';
import variablesRouter from './routes/variables.js';
import authRouter from './routes/auth.js';
import uploadsRouter from './routes/uploads.js';
import commentsRouter from './routes/comments.js';
import { errorHandler, requestLogger } from './middleware/errorHandler.js';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  },
});

const PORT = process.env.PORT || 3001;

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "blob:"],
      connectSrc: ["'self'", "ws:", "wss:"],
    },
  },
}));

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Trop de requetes, veuillez reessayer plus tard.',
});
app.use('/api/', limiter);

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(morgan('dev'));
app.use(requestLogger);
app.use('/uploads', express.static('uploads'));

app.use('/api/projects', projectsRouter);
app.use('/api/slides', slidesRouter);
app.use('/api/templates', templatesRouter);
app.use('/api/deals', dealsRouter);
app.use('/api/import', importRouter);
app.use('/api/export', exportRouter);
app.use('/api/chat', chatRouter);
app.use('/api/variables', variablesRouter);
app.use('/api/auth', authRouter);
app.use('/api/uploads', uploadsRouter);
app.use('/api/comments', commentsRouter);

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('join-project', (projectId: string) => {
    socket.join(`project-${projectId}`);
    socket.to(`project-${projectId}`).emit('user-joined', {
      socketId: socket.id,
      timestamp: new Date().toISOString(),
    });
  });

  socket.on('slide-update', (data: { projectId: string }) => {
    socket.to(`project-${data.projectId}`).emit('slide-updated', data);
  });

  socket.on('cursor-position', (data: { projectId: string }) => {
    socket.to(`project-${data.projectId}`).emit('cursor-moved', {
      socketId: socket.id,
      ...data,
    });
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

app.use(errorHandler);

app.use((_req, res) => {
  res.status(404).json({ error: 'Route non trouvee' });
});

async function startServer() {
  try {
    await initDb();
    console.log('Base de donnees initialisee');

    httpServer.listen(PORT, () => {
      console.log(`Serveur Alecia demarre sur le port ${PORT}`);
      console.log(`Health check: http://localhost:${PORT}/health`);
    });
  } catch (error) {
    console.error('Erreur lors du demarrage:', error);
    process.exit(1);
  }
}

process.on('SIGTERM', () => {
  console.log('SIGTERM recu, arret en cours...');
  httpServer.close(() => {
    closeDb();
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT recu, arret en cours...');
  httpServer.close(() => {
    closeDb();
    process.exit(0);
  });
});

startServer();

export { io };
