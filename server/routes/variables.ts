import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { getDb, saveDb, execQuery } from '../db/index.js';
import { createError } from '../middleware/errorHandler.js';

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    const { projectId } = req.query;

    const presets = execQuery(`
      SELECT 
        id, project_id as projectId, name, variables,
        is_default as isDefault, created_at as createdAt
      FROM variable_presets
      WHERE project_id = ? OR project_id IS NULL
      ORDER BY is_default DESC, created_at DESC
    `, [projectId as string]);

    res.json(presets.map(p => ({
      ...p,
      variables: JSON.parse(p.variables as string || '[]'),
    })));
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const presets = execQuery('SELECT * FROM variable_presets WHERE id = ?', [req.params.id]);
    const preset = presets[0];

    if (!preset) {
      throw createError('Preset non trouvé', 404);
    }

    res.json({
      ...preset,
      variables: JSON.parse(preset.variables as string || '[]'),
    });
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const { projectId, name, variables, isDefault } = req.body;
    const id = uuidv4();
    const now = Date.now();

    const db = await getDb();

    if (isDefault && projectId) {
      db.run('UPDATE variable_presets SET is_default = 0 WHERE project_id = ?', [projectId]);
    }

    db.run(`
      INSERT INTO variable_presets (id, project_id, name, variables, is_default, created_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [
      id,
      projectId || null,
      name,
      JSON.stringify(variables || []),
      isDefault ? 1 : 0,
      now
    ]);
    saveDb();

    res.status(201).json({ id, message: 'Preset créé avec succès' });
  } catch (error) {
    next(error);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const { name, variables, isDefault } = req.body;
    const db = await getDb();

    const presets = execQuery('SELECT project_id FROM variable_presets WHERE id = ?', [req.params.id]);
    const preset = presets[0];

    if (!preset) {
      throw createError('Preset non trouvé', 404);
    }

    if (isDefault && preset.project_id) {
      db.run('UPDATE variable_presets SET is_default = 0 WHERE project_id = ?', [preset.project_id as string]);
    }

    db.run(`
      UPDATE variable_presets SET
        name = COALESCE(?, name),
        variables = COALESCE(?, variables),
        is_default = COALESCE(?, is_default)
      WHERE id = ?
    `, [
      name,
      variables ? JSON.stringify(variables) : null,
      isDefault !== undefined ? (isDefault ? 1 : 0) : null,
      req.params.id
    ]);
    saveDb();

    res.json({ message: 'Preset mis à jour avec succès' });
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const db = await getDb();
    db.run('DELETE FROM variable_presets WHERE id = ?', [req.params.id]);
    saveDb();

    res.json({ message: 'Preset supprimé avec succès' });
  } catch (error) {
    next(error);
  }
});

export default router;
