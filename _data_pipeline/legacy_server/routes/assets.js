/**
 * Assets routes (images, logos)
 */

import express from 'express';
import multer from 'multer';
import { fileURLToPath } from 'url';
import { dirname, join, extname } from 'path';
import fs from 'fs';
import { getDb, generateId } from '../db/database.js';
import { authenticateToken } from './auth.js';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = join(__dirname, '../../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/svg+xml', 'image/webp'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Type de fichier non supporté. Utilisez JPG, PNG, GIF, SVG ou WebP.'), false);
  }
};

const upload = multer({ 
  storage, 
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB max
});

router.use(authenticateToken);

/**
 * GET /api/assets
 * Get all assets
 */
router.get('/', (req, res) => {
  try {
    const db = getDb();
    const { type } = req.query;
    
    let query = 'SELECT * FROM assets';
    const params = [];
    
    if (type) {
      query += ' WHERE type = ?';
      params.push(type);
    }
    
    query += ' ORDER BY created_at DESC';
    
    const assets = db.prepare(query).all(...params);
    
    res.json(assets.map(a => ({
      ...a,
      tags: a.tags_json ? JSON.parse(a.tags_json) : []
    })));
  } catch (error) {
    console.error('Get assets error:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des assets' });
  }
});

/**
 * POST /api/assets/upload
 * Upload asset
 */
router.post('/upload', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Aucun fichier uploadé' });
    }
    
    const db = getDb();
    const { name, type = 'image', tags } = req.body;
    
    const assetId = generateId();
    const url = `/uploads/${req.file.filename}`;
    
    db.prepare(`
      INSERT INTO assets (id, name, type, mime_type, size, url, tags_json, uploaded_by)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      assetId,
      name || req.file.originalname,
      type,
      req.file.mimetype,
      req.file.size,
      url,
      tags ? JSON.stringify(JSON.parse(tags)) : '[]',
      req.userId
    );
    
    const asset = db.prepare('SELECT * FROM assets WHERE id = ?').get(assetId);
    
    res.status(201).json({
      ...asset,
      tags: asset.tags_json ? JSON.parse(asset.tags_json) : []
    });
  } catch (error) {
    console.error('Upload asset error:', error);
    res.status(500).json({ error: 'Erreur lors de l\'upload' });
  }
});

/**
 * DELETE /api/assets/:id
 * Delete asset
 */
router.delete('/:id', (req, res) => {
  try {
    const db = getDb();
    
    const asset = db.prepare('SELECT * FROM assets WHERE id = ?').get(req.params.id);
    if (!asset) {
      return res.status(404).json({ error: 'Asset non trouvé' });
    }
    
    // Delete file
    const filePath = join(__dirname, '../..', asset.url);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    
    // Delete from database
    db.prepare('DELETE FROM assets WHERE id = ?').run(req.params.id);
    
    res.json({ message: 'Asset supprimé' });
  } catch (error) {
    console.error('Delete asset error:', error);
    res.status(500).json({ error: 'Erreur lors de la suppression' });
  }
});

export default router;
