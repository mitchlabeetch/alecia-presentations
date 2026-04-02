import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { getDb, saveDb, execQuery, getOne } from '../db/index.js';
import { createError } from '../middleware/errorHandler.js';

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    const projectId = req.query.projectId as string;

    if (!projectId) {
      throw createError('ID du projet requis', 400);
    }

    const slides = execQuery(`
      SELECT
        id, project_id as projectId, order_index as orderIndex,
        type, title, content, notes, image_path as imagePath,
        data, docling_json as doclingJson, created_at as createdAt, updated_at as updatedAt
      FROM slides
      WHERE project_id = ?
      ORDER BY order_index ASC
    `, [projectId]);

    res.json(slides.map(s => ({
      ...s,
      content: JSON.parse(s.content || '{}'),
      data: s.data ? JSON.parse(s.data as string) : null,
      doclingJson: s.doclingJson ? JSON.parse(s.doclingJson as string) : null,
    })));
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const slide = getOne('SELECT * FROM slides WHERE id = ?', [req.params.id]);

    if (!slide) {
      throw createError('Diapositive non trouvée', 404);
    }

    res.json({
      ...slide,
      content: JSON.parse(slide.content as string || '{}'),
      data: slide.data ? JSON.parse(slide.data as string) : null,
      doclingJson: slide.docling_json ? JSON.parse(slide.docling_json as string) : null,
    });
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const { projectId, type, title, content, data } = req.body;

    if (!projectId) {
      throw createError('ID du projet requis', 400);
    }

    const db = await getDb();

    const maxOrderResult = getOne<{ maxOrder: number | null }>(
      'SELECT MAX(order_index) as maxOrder FROM slides WHERE project_id = ?',
      [projectId]
    );

    const orderIndex = (maxOrderResult?.maxOrder ?? -1) + 1;
    const id = uuidv4();
    const now = Date.now();

    db.run(`
      INSERT INTO slides (id, project_id, order_index, type, title, content, data, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      id,
      projectId,
      orderIndex,
      type || 'Paragraphe',
      title || '',
      JSON.stringify(content || {}),
      data ? JSON.stringify(data) : null,
      now,
      now
    ]);
    saveDb();

    res.status(201).json({ id, orderIndex, message: 'Diapositive créée avec succès' });
  } catch (error) {
    next(error);
  }
});

router.patch('/:id', async (req, res, next) => {
  try {
    const { title, content, notes, data, type, orderIndex } = req.body;
    const now = Date.now();

    const slide = getOne('SELECT id FROM slides WHERE id = ?', [req.params.id]);

    if (!slide) {
      throw createError('Diapositive non trouvée', 404);
    }

    const updates: string[] = [];
    const values: (string | number | null)[] = [];

    if (title !== undefined) { updates.push('title = ?'); values.push(title); }
    if (content !== undefined) { updates.push('content = ?'); values.push(JSON.stringify(content)); }
    if (notes !== undefined) { updates.push('notes = ?'); values.push(notes); }
    if (data !== undefined) { updates.push('data = ?'); values.push(data ? JSON.stringify(data) : null); }
    if (type !== undefined) { updates.push('type = ?'); values.push(type); }
    if (orderIndex !== undefined) { updates.push('order_index = ?'); values.push(orderIndex); }

    updates.push('updated_at = ?');
    values.push(now);
    values.push(req.params.id);

    const db = await getDb();
    db.run(`UPDATE slides SET ${updates.join(', ')} WHERE id = ?`, values);
    saveDb();

    res.json({ message: 'Diapositive mise à jour avec succès' });
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const db = await getDb();
    db.run('DELETE FROM slides WHERE id = ?', [req.params.id]);
    saveDb();

    res.json({ message: 'Diapositive supprimée avec succès' });
  } catch (error) {
    next(error);
  }
});

router.post('/reorder', async (req, res, next) => {
  try {
    const { projectId, slideIds } = req.body;

    if (!projectId || !slideIds || !Array.isArray(slideIds)) {
      throw createError('projectId et slideIds requis', 400);
    }

    const db = await getDb();

    for (let i = 0; i < slideIds.length; i++) {
      db.run('UPDATE slides SET order_index = ?, updated_at = ? WHERE id = ?', [i, Date.now(), slideIds[i]]);
    }
    saveDb();

    res.json({ message: 'Ordre mis à jour avec succès' });
  } catch (error) {
    next(error);
  }
});

export default router;
