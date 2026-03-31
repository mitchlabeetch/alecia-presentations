/**
 * Templates routes
 */

import express from 'express';
import { getDb, generateId } from '../db/database.js';
import { authenticateToken } from './auth.js';

const router = express.Router();

router.use(authenticateToken);

/**
 * GET /api/templates
 * Get all templates
 */
router.get('/', (req, res) => {
  try {
    const db = getDb();
    const { category } = req.query;
    
    let query = `
      SELECT t.*, 
             u.first_name as creator_first_name,
             u.last_name as creator_last_name
      FROM templates t
      LEFT JOIN users u ON t.created_by = u.id
    `;
    const params = [];
    
    if (category) {
      query += ' WHERE t.category = ?';
      params.push(category);
    }
    
    query += ' ORDER BY t.is_default DESC, t.name ASC';
    
    const templates = db.prepare(query).all(...params);
    
    const parsed = templates.map(t => ({
      ...t,
      slides: t.slides_json ? JSON.parse(t.slides_json) : [],
      variables: t.variables_json ? JSON.parse(t.variables_json) : {},
      settings: t.settings_json ? JSON.parse(t.settings_json) : {},
      creatorName: t.creator_first_name ? `${t.creator_first_name} ${t.creator_last_name}` : 'Alecia'
    }));
    
    res.json(parsed);
  } catch (error) {
    console.error('Get templates error:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des templates' });
  }
});

/**
 * GET /api/templates/:id
 * Get single template
 */
router.get('/:id', (req, res) => {
  try {
    const db = getDb();
    const template = db.prepare(`
      SELECT t.*,
             u.first_name as creator_first_name,
             u.last_name as creator_last_name
      FROM templates t
      LEFT JOIN users u ON t.created_by = u.id
      WHERE t.id = ?
    `).get(req.params.id);
    
    if (!template) {
      return res.status(404).json({ error: 'Template non trouvé' });
    }
    
    res.json({
      ...template,
      slides: JSON.parse(template.slides_json),
      variables: template.variables_json ? JSON.parse(template.variables_json) : {},
      settings: template.settings_json ? JSON.parse(template.settings_json) : {},
      creatorName: template.creator_first_name ? `${template.creator_first_name} ${template.creator_last_name}` : 'Alecia'
    });
  } catch (error) {
    console.error('Get template error:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération du template' });
  }
});

/**
 * POST /api/templates
 * Create new template from presentation
 */
router.post('/', (req, res) => {
  try {
    const { name, description, category, presentationId, isDefault = false } = req.body;
    
    if (!name || !category) {
      return res.status(400).json({ error: 'Nom et catégorie requis' });
    }
    
    const db = getDb();
    const now = new Date().toISOString();
    
    let slides = [];
    let variables = {};
    let settings = {};
    
    // If presentationId provided, copy from presentation
    if (presentationId) {
      const presentation = db.prepare('SELECT * FROM presentations WHERE id = ?').get(presentationId);
      if (presentation) {
        const slidesData = db.prepare('SELECT * FROM slides WHERE presentation_id = ? ORDER BY "order"').all(presentationId);
        slides = slidesData.map(s => ({
          type: s.type,
          title: s.title,
          content: JSON.parse(s.content_json),
          layout: s.layout_json ? JSON.parse(s.layout_json) : {}
        }));
        variables = presentation.variables_json ? JSON.parse(presentation.variables_json) : {};
        settings = presentation.settings_json ? JSON.parse(presentation.settings_json) : {};
      }
    }
    
    const templateId = generateId();
    db.prepare(`
      INSERT INTO templates 
      (id, name, description, category, slides_json, variables_json, settings_json, is_default, created_by, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      templateId,
      name,
      description || '',
      category,
      JSON.stringify(slides),
      JSON.stringify(variables),
      JSON.stringify(settings),
      isDefault ? 1 : 0,
      req.userId,
      now,
      now
    );
    
    const template = db.prepare('SELECT * FROM templates WHERE id = ?').get(templateId);
    
    res.status(201).json({
      ...template,
      slides: JSON.parse(template.slides_json),
      variables: JSON.parse(template.variables_json),
      settings: JSON.parse(template.settings_json)
    });
  } catch (error) {
    console.error('Create template error:', error);
    res.status(500).json({ error: 'Erreur lors de la création du template' });
  }
});

/**
 * PUT /api/templates/:id
 * Update template
 */
router.put('/:id', (req, res) => {
  try {
    const { name, description, category, slides, variables, settings } = req.body;
    
    const db = getDb();
    const now = new Date().toISOString();
    
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
    if (category !== undefined) {
      updates.push('category = ?');
      params.push(category);
    }
    if (slides !== undefined) {
      updates.push('slides_json = ?');
      params.push(JSON.stringify(slides));
    }
    if (variables !== undefined) {
      updates.push('variables_json = ?');
      params.push(JSON.stringify(variables));
    }
    if (settings !== undefined) {
      updates.push('settings_json = ?');
      params.push(JSON.stringify(settings));
    }
    
    updates.push('updated_at = ?');
    params.push(now);
    params.push(req.params.id);
    
    const query = `UPDATE templates SET ${updates.join(', ')} WHERE id = ?`;
    db.prepare(query).run(...params);
    
    const template = db.prepare('SELECT * FROM templates WHERE id = ?').get(req.params.id);
    
    res.json({
      ...template,
      slides: JSON.parse(template.slides_json),
      variables: JSON.parse(template.variables_json),
      settings: JSON.parse(template.settings_json)
    });
  } catch (error) {
    console.error('Update template error:', error);
    res.status(500).json({ error: 'Erreur lors de la mise à jour du template' });
  }
});

/**
 * DELETE /api/templates/:id
 * Delete template
 */
router.delete('/:id', (req, res) => {
  try {
    const db = getDb();
    
    // Only admin or creator can delete
    const template = db.prepare('SELECT created_by FROM templates WHERE id = ?').get(req.params.id);
    
    if (!template) {
      return res.status(404).json({ error: 'Template non trouvé' });
    }
    
    if (template.created_by !== req.userId && req.userRole !== 'admin') {
      return res.status(403).json({ error: 'Non autorisé' });
    }
    
    db.prepare('DELETE FROM templates WHERE id = ?').run(req.params.id);
    
    res.json({ message: 'Template supprimé' });
  } catch (error) {
    console.error('Delete template error:', error);
    res.status(500).json({ error: 'Erreur lors de la suppression du template' });
  }
});

/**
 * GET /api/templates/categories
 * Get template categories
 */
router.get('/meta/categories', (req, res) => {
  try {
    const categories = [
      { id: 'pitch', name: 'Pitch Deck', icon: 'presentation' },
      { id: 'fundraising', name: 'Levée de Fonds', icon: 'trending-up' },
      { id: 'cession', name: 'Cession', icon: 'handshake' },
      { id: 'acquisition', name: 'Acquisition', icon: 'building-2' },
      { id: 'financing', name: 'Financements Structurés', icon: 'landmark' },
      { id: 'report', name: 'Rapport', icon: 'file-text' },
      { id: 'team', name: 'Équipe', icon: 'users' },
      { id: 'references', name: 'Références', icon: 'award' }
    ];
    
    res.json(categories);
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des catégories' });
  }
});

export default router;
