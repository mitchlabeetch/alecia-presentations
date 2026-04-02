import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { getDb, saveDb, execQuery } from '../db/index.js';
import { createError } from '../middleware/errorHandler.js';

const router = Router();

router.get('/', async (_req, res, next) => {
  try {
    const templates = execQuery(`
      SELECT 
        id, name, description, category, is_custom as isCustom,
        thumbnail_path as thumbnailPath, created_at as createdAt
      FROM templates
      ORDER BY created_at DESC
    `);
    res.json(templates);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const templates = execQuery('SELECT * FROM templates WHERE id = ?', [req.params.id]);
    const template = templates[0];

    if (!template) {
      throw createError('Modèle non trouvé', 404);
    }

    res.json({
      ...template,
      slides: JSON.parse(template.slides as string || '[]'),
    });
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const { name, description, category, slides } = req.body;
    const id = uuidv4();
    const now = Date.now();

    const db = await getDb();
    db.run(`
      INSERT INTO templates (id, name, description, category, slides, is_custom, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [
      id,
      name,
      description || null,
      category || 'custom',
      JSON.stringify(slides || []),
      1,
      now
    ]);
    saveDb();

    res.status(201).json({ id, message: 'Modèle créé avec succès' });
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const db = await getDb();
    db.run('DELETE FROM templates WHERE id = ? AND is_custom = 1', [req.params.id]);
    saveDb();

    res.json({ message: 'Modèle supprimé avec succès' });
  } catch (error) {
    next(error);
  }
});

export default router;
