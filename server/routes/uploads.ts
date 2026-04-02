import { Router } from 'express';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { existsSync, mkdirSync, unlinkSync } from 'fs';
import { getDb, saveDb, execQuery, getOne } from '../db/index.js';
import { createError } from '../middleware/errorHandler.js';
import multer from 'multer';

const router = Router();

const uploadsDir = path.join(process.cwd(), 'uploads');
if (!existsSync(uploadsDir)) {
  mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDir),
  filename: (_req, file, cb) => {
    const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 },
});

router.post('/', upload.single('file'), async (req, res, next) => {
  try {
    if (!req.file) {
      throw createError('Aucun fichier fourni', 400);
    }

    const { projectId } = req.body;

    if (!projectId) {
      throw createError('Projet requis', 400);
    }

    const project = getOne('SELECT id FROM projects WHERE id = ?', [projectId]);
    if (!project) {
      throw createError('Projet non trouvé', 404);
    }

    const id = uuidv4();
    const db = await getDb();
    db.run(`
      INSERT INTO uploads (id, project_id, file_path, file_name, file_type, file_size, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [
      id,
      projectId,
      req.file.path,
      req.file.originalname,
      req.file.mimetype,
      req.file.size,
      Date.now(),
    ]);
    saveDb();

    res.status(201).json({
      id,
      url: `/uploads/${path.basename(req.file.path)}`,
      originalName: req.file.originalname,
      fileType: req.file.mimetype,
      fileSize: req.file.size,
    });
  } catch (error) {
    next(error);
  }
});

router.get('/:projectId', async (req, res, next) => {
  try {
    const project = getOne('SELECT id FROM projects WHERE id = ?', [req.params.projectId]);
    if (!project) {
      throw createError('Projet non trouvé', 404);
    }

    const uploads = execQuery(`
      SELECT 
        id, project_id as projectId, file_path as filePath,
        file_name as fileName, file_type as fileType, file_size as fileSize,
        created_at as createdAt
      FROM uploads
      WHERE project_id = ?
      ORDER BY created_at DESC
    `, [req.params.projectId]);

    res.json(uploads.map((u: Record<string, unknown>) => ({
      ...u,
      url: `/uploads/${path.basename(u.filePath as string)}`,
    })));
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const uploads = execQuery('SELECT * FROM uploads WHERE id = ?', [req.params.id]);
    const uploadRecord = uploads[0];

    if (!uploadRecord) {
      throw createError('Fichier non trouvé', 404);
    }

    try {
      if (existsSync(uploadRecord.file_path as string)) {
        unlinkSync(uploadRecord.file_path as string);
      }
    } catch {
      console.error('Erreur lors de la suppression du fichier');
    }

    const db = await getDb();
    db.run('DELETE FROM uploads WHERE id = ?', [req.params.id]);
    saveDb();

    res.json({ message: 'Fichier supprimé avec succès' });
  } catch (error) {
    next(error);
  }
});

export default router;
