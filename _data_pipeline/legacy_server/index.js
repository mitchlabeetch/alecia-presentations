/**
 * Main server entry point
 * Express + SQLite + Socket.io
 */

import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

import { initDatabase } from './db/database.js';
import { seedDatabase } from './db/seed.js';

// Import routes
import authRoutes from './routes/auth.js';
import presentationRoutes from './routes/presentations.js';
import templateRoutes from './routes/templates.js';
import assetRoutes from './routes/assets.js';
import variableRoutes from './routes/variables.js';
import exportRoutes from './routes/export.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
    methods: ['GET', 'POST'],
    credentials: true
  }
});

const PORT = process.env.PORT || 3001;

// Ensure directories exist
const uploadsDir = join(__dirname, '../uploads');
const dataDir = join(__dirname, '../data');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Static files for uploads
app.use('/uploads', express.static(uploadsDir));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/presentations', presentationRoutes);
app.use('/api/templates', templateRoutes);
app.use('/api/assets', assetRoutes);
app.use('/api/variables', variableRoutes);
app.use('/api/export', exportRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    version: '2.1.0'
  });
});

// Socket.io for real-time collaboration
const collaborationRooms = new Map();

io.on('connection', (socket) => {
  console.log('🔌 Client connected:', socket.id);

  // Join presentation room
  socket.on('join-presentation', ({ presentationId, user }) => {
    socket.join(presentationId);
    
    if (!collaborationRooms.has(presentationId)) {
      collaborationRooms.set(presentationId, new Map());
    }
    
    const room = collaborationRooms.get(presentationId);
    room.set(socket.id, { ...user, socketId: socket.id, joinedAt: new Date() });
    
    // Notify others
    socket.to(presentationId).emit('user-joined', { 
      user, 
      socketId: socket.id,
      users: Array.from(room.values()) 
    });
    
    // Send current users to new user
    socket.emit('users-list', Array.from(room.values()));
    
    console.log(`👤 ${user.name} joined presentation ${presentationId}`);
  });

  // Cursor position update
  socket.on('cursor-move', ({ presentationId, position, user }) => {
    socket.to(presentationId).emit('cursor-update', {
      socketId: socket.id,
      position,
      user
    });
  });

  // Slide update
  socket.on('slide-update', ({ presentationId, slideId, updates, user }) => {
    socket.to(presentationId).emit('slide-updated', { slideId, updates, user });
  });

  // Slide added
  socket.on('slide-add', ({ presentationId, slide, user }) => {
    socket.to(presentationId).emit('slide-added', { slide, user });
  });

  // Slide deleted
  socket.on('slide-delete', ({ presentationId, slideId, user }) => {
    socket.to(presentationId).emit('slide-deleted', { slideId, user });
  });

  // Variable update
  socket.on('variable-update', ({ presentationId, variables, user }) => {
    socket.to(presentationId).emit('variables-updated', { variables, user });
  });

  // Activity broadcast
  socket.on('activity', ({ presentationId, activity, user }) => {
    socket.to(presentationId).emit('new-activity', { activity, user });
  });

  // Leave presentation
  socket.on('leave-presentation', ({ presentationId }) => {
    socket.leave(presentationId);
    
    const room = collaborationRooms.get(presentationId);
    if (room) {
      const user = room.get(socket.id);
      room.delete(socket.id);
      
      socket.to(presentationId).emit('user-left', { 
        socketId: socket.id, 
        users: Array.from(room.values()) 
      });
      
      if (user) {
        console.log(`👤 ${user.name} left presentation ${presentationId}`);
      }
    }
  });

  // Disconnect
  socket.on('disconnect', () => {
    console.log('🔌 Client disconnected:', socket.id);
    
    // Clean up from all rooms
    for (const [presentationId, room] of collaborationRooms) {
      if (room.has(socket.id)) {
        const user = room.get(socket.id);
        room.delete(socket.id);
        
        io.to(presentationId).emit('user-left', { 
          socketId: socket.id, 
          users: Array.from(room.values()) 
        });
        
        if (user) {
          console.log(`👤 ${user.name} disconnected from ${presentationId}`);
        }
      }
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Initialize database
initDatabase();

// Seed database (run once)
seedDatabase();

server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📁 Database: ./data/alecia.db`);
  console.log(`📂 Uploads: ./uploads`);
});

export { io };
