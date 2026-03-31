/**
 * Variable presets routes
 */

import express from 'express';
import { getDb, generateId } from '../db/database.js';
import { authenticateToken } from './auth.js';

const router = express.Router();

router.use(authenticateToken);

/**
 * GET /api/variables/presets
 * Get all variable presets
 */
router.get('/presets', (req, res) => {
  try {
    const db = getDb();
    
    const presets = db.prepare(`
      SELECT vp.*, 
             u.first_name as creator_first_name,
             u.last_name as creator_last_name
      FROM variable_presets vp
      LEFT JOIN users u ON vp.created_by = u.id
      WHERE vp.created_by = ? OR vp.is_default = 1
      ORDER BY vp.is_default DESC, vp.name ASC
    `).all(req.userId);
    
    res.json(presets.map(p => ({
      ...p,
      variables: JSON.parse(p.variables_json)
    })));
  } catch (error) {
    console.error('Get presets error:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des préréglages' });
  }
});

/**
 * GET /api/variables/presets/:id
 * Get single preset
 */
router.get('/presets/:id', (req, res) => {
  try {
    const db = getDb();
    
    const preset = db.prepare('SELECT * FROM variable_presets WHERE id = ?').get(req.params.id);
    
    if (!preset) {
      return res.status(404).json({ error: 'Préréglage non trouvé' });
    }
    
    res.json({
      ...preset,
      variables: JSON.parse(preset.variables_json)
    });
  } catch (error) {
    console.error('Get preset error:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération du préréglage' });
  }
});

/**
 * POST /api/variables/presets
 * Create new preset
 */
router.post('/presets', (req, res) => {
  try {
    const { name, description, variables, isDefault = false } = req.body;
    
    if (!name || !variables) {
      return res.status(400).json({ error: 'Nom et variables requis' });
    }
    
    const db = getDb();
    const now = new Date().toISOString();
    
    // If setting as default, unset other defaults
    if (isDefault) {
      db.prepare('UPDATE variable_presets SET is_default = 0 WHERE created_by = ?').run(req.userId);
    }
    
    const presetId = generateId();
    db.prepare(`
      INSERT INTO variable_presets (id, name, description, variables_json, is_default, created_by, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
      presetId,
      name,
      description || '',
      JSON.stringify(variables),
      isDefault ? 1 : 0,
      req.userId,
      now
    );
    
    const preset = db.prepare('SELECT * FROM variable_presets WHERE id = ?').get(presetId);
    
    res.status(201).json({
      ...preset,
      variables: JSON.parse(preset.variables_json)
    });
  } catch (error) {
    console.error('Create preset error:', error);
    res.status(500).json({ error: 'Erreur lors de la création du préréglage' });
  }
});

/**
 * PUT /api/variables/presets/:id
 * Update preset
 */
router.put('/presets/:id', (req, res) => {
  try {
    const { name, description, variables, isDefault } = req.body;
    
    const db = getDb();
    
    // If setting as default, unset other defaults
    if (isDefault) {
      db.prepare('UPDATE variable_presets SET is_default = 0 WHERE created_by = ?').run(req.userId);
    }
    
    const updates = [];
    const params = [];
    
    if (name !== undefined) {
      updates.push('name = ?');
      params.push(name);
    }
    if (description !== undefined) {
      updates.push('description = ?');
      params.push(description);
    }
    if (variables !== undefined) {
      updates.push('variables_json = ?');
      params.push(JSON.stringify(variables));
    }
    if (isDefault !== undefined) {
      updates.push('is_default = ?');
      params.push(isDefault ? 1 : 0);
    }
    
    params.push(req.params.id);
    
    const query = `UPDATE variable_presets SET ${updates.join(', ')} WHERE id = ?`;
    db.prepare(query).run(...params);
    
    const preset = db.prepare('SELECT * FROM variable_presets WHERE id = ?').get(req.params.id);
    
    res.json({
      ...preset,
      variables: JSON.parse(preset.variables_json)
    });
  } catch (error) {
    console.error('Update preset error:', error);
    res.status(500).json({ error: 'Erreur lors de la mise à jour du préréglage' });
  }
});

/**
 * DELETE /api/variables/presets/:id
 * Delete preset
 */
router.delete('/presets/:id', (req, res) => {
  try {
    const db = getDb();
    
    const preset = db.prepare('SELECT created_by FROM variable_presets WHERE id = ?').get(req.params.id);
    
    if (!preset) {
      return res.status(404).json({ error: 'Préréglage non trouvé' });
    }
    
    if (preset.created_by !== req.userId && req.userRole !== 'admin') {
      return res.status(403).json({ error: 'Non autorisé' });
    }
    
    db.prepare('DELETE FROM variable_presets WHERE id = ?').run(req.params.id);
    
    res.json({ message: 'Préréglage supprimé' });
  } catch (error) {
    console.error('Delete preset error:', error);
    res.status(500).json({ error: 'Erreur lors de la suppression du préréglage' });
  }
});

export default router;
