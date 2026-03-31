/**
 * Presentations routes
 * CRUD operations for presentations and slides
 */

import express from 'express';
import { getDb, generateId, transaction } from '../db/database.js';
import { authenticateToken } from './auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

/**
 * GET /api/presentations
 * Get all presentations for current user
 */
router.get('/', (req, res) => {
  try {
    const db = getDb();
    const presentations = db.prepare(`
      SELECT p.*, 
             u.first_name as creator_first_name,
             u.last_name as creator_last_name
      FROM presentations p
      LEFT JOIN users u ON p.created_by = u.id
      WHERE p.created_by = ? OR p.id IN (
        SELECT presentation_id FROM collaboration_sessions 
        WHERE user_id = ? AND is_active = 1
      )
      ORDER BY p.updated_at DESC
    `).all(req.userId, req.userId);
    
    // Parse JSON fields
    const parsed = presentations.map(p => ({
      ...p,
      settings: p.settings_json ? JSON.parse(p.settings_json) : {},
      variables: p.variables_json ? JSON.parse(p.variables_json) : {},
      creatorName: `${p.creator_first_name} ${p.creator_last_name}`
    }));
    
    res.json(parsed);
  } catch (error) {
    console.error('Get presentations error:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des présentations' });
  }
});

/**
 * GET /api/presentations/:id
 * Get single presentation with slides
 */
router.get('/:id', (req, res) => {
  try {
    const db = getDb();
    
    // Get presentation
    const presentation = db.prepare(`
      SELECT p.*,
             u.first_name as creator_first_name,
             u.last_name as creator_last_name
      FROM presentations p
      LEFT JOIN users u ON p.created_by = u.id
      WHERE p.id = ?
    `).get(req.params.id);
    
    if (!presentation) {
      return res.status(404).json({ error: 'Présentation non trouvée' });
    }
    
    // Get slides
    const slides = db.prepare(`
      SELECT * FROM slides 
      WHERE presentation_id = ? 
      ORDER BY "order" ASC
    `).all(req.params.id);
    
    // Parse JSON fields
    const result = {
      ...presentation,
      settings: presentation.settings_json ? JSON.parse(presentation.settings_json) : {},
      variables: presentation.variables_json ? JSON.parse(presentation.variables_json) : {},
      slides: slides.map(s => ({
        ...s,
        content: s.content_json ? JSON.parse(s.content_json) : {},
        layout: s.layout_json ? JSON.parse(s.layout_json) : {}
      })),
      creatorName: `${presentation.creator_first_name} ${presentation.creator_last_name}`
    };
    
    res.json(result);
  } catch (error) {
    console.error('Get presentation error:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération de la présentation' });
  }
});

/**
 * POST /api/presentations
 * Create new presentation
 */
router.post('/', (req, res) => {
  try {
    const { title, description = '', templateId } = req.body;
    
    if (!title) {
      return res.status(400).json({ error: 'Le titre est requis' });
    }
    
    const db = getDb();
    const presentationId = generateId();
    const now = new Date().toISOString();
    
    // Default settings
    const settings = {
      theme: 'alecia',
      aspectRatio: '16:9',
      defaultFont: 'Inter',
      showSlideNumbers: true,
      showFooter: true,
      footerText: 'Alecia - Conseil en financement'
    };
    
    // Default variables
    const variables = {
      client: '',
      date: new Date().toLocaleDateString('fr-FR'),
      aleciaContactName: '',
      aleciaContactEmail: ''
    };
    
    // Create presentation
    db.prepare(`
      INSERT INTO presentations 
      (id, title, description, created_by, created_at, updated_at, last_modified_by, template_id, settings_json, variables_json)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      presentationId,
      title,
      description,
      req.userId,
      now,
      now,
      req.userId,
      templateId || null,
      JSON.stringify(settings),
      JSON.stringify(variables)
    );
    
    // Create initial title slide
    const slideId = generateId();
    db.prepare(`
      INSERT INTO slides 
      (id, presentation_id, type, title, content_json, "order", created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      slideId,
      presentationId,
      'title',
      title,
      JSON.stringify({ subtitle: description }),
      0,
      now,
      now
    );
    
    // Get created presentation
    const presentation = db.prepare('SELECT * FROM presentations WHERE id = ?').get(presentationId);
    const slides = db.prepare('SELECT * FROM slides WHERE presentation_id = ? ORDER BY "order"').all(presentationId);
    
    res.status(201).json({
      ...presentation,
      settings: JSON.parse(presentation.settings_json),
      variables: JSON.parse(presentation.variables_json),
      slides: slides.map(s => ({
        ...s,
        content: JSON.parse(s.content_json),
        layout: s.layout_json ? JSON.parse(s.layout_json) : {}
      }))
    });
  } catch (error) {
    console.error('Create presentation error:', error);
    res.status(500).json({ error: 'Erreur lors de la création de la présentation' });
  }
});

/**
 * PUT /api/presentations/:id
 * Update presentation
 */
router.put('/:id', (req, res) => {
  try {
    const { title, description, status, settings, variables } = req.body;
    
    const db = getDb();
    const now = new Date().toISOString();
    
    // Build update query dynamically
    const updates = [];
    const params = [];
    
    if (title !== undefined) {
      updates.push('title = ?');
      params.push(title);
    }
    if (description !== undefined) {
      updates.push('description = ?');
      params.push(description);
    }
    if (status !== undefined) {
      updates.push('status = ?');
      params.push(status);
    }
    if (settings !== undefined) {
      updates.push('settings_json = ?');
      params.push(JSON.stringify(settings));
    }
    if (variables !== undefined) {
      updates.push('variables_json = ?');
      params.push(JSON.stringify(variables));
    }
    
    updates.push('updated_at = ?');
    params.push(now);
    updates.push('last_modified_by = ?');
    params.push(req.userId);
    
    params.push(req.params.id);
    
    const query = `UPDATE presentations SET ${updates.join(', ')} WHERE id = ?`;
    db.prepare(query).run(...params);
    
    // Return updated presentation
    const presentation = db.prepare('SELECT * FROM presentations WHERE id = ?').get(req.params.id);
    
    res.json({
      ...presentation,
      settings: JSON.parse(presentation.settings_json),
      variables: JSON.parse(presentation.variables_json)
    });
  } catch (error) {
    console.error('Update presentation error:', error);
    res.status(500).json({ error: 'Erreur lors de la mise à jour de la présentation' });
  }
});

/**
 * DELETE /api/presentations/:id
 * Delete presentation
 */
router.delete('/:id', (req, res) => {
  try {
    const db = getDb();
    
    // Check if user owns the presentation or is admin
    const presentation = db.prepare('SELECT created_by FROM presentations WHERE id = ?').get(req.params.id);
    
    if (!presentation) {
      return res.status(404).json({ error: 'Présentation non trouvée' });
    }
    
    if (presentation.created_by !== req.userId && req.userRole !== 'admin') {
      return res.status(403).json({ error: 'Non autorisé' });
    }
    
    db.prepare('DELETE FROM presentations WHERE id = ?').run(req.params.id);
    
    res.json({ message: 'Présentation supprimée' });
  } catch (error) {
    console.error('Delete presentation error:', error);
    res.status(500).json({ error: 'Erreur lors de la suppression de la présentation' });
  }
});

// ============================================================================
// SLIDES ROUTES
// ============================================================================

/**
 * POST /api/presentations/:id/slides
 * Add slide to presentation
 */
router.post('/:id/slides', (req, res) => {
  try {
    const { type, title, content, layout, order } = req.body;
    
    if (!type) {
      return res.status(400).json({ error: 'Le type de slide est requis' });
    }
    
    const db = getDb();
    const presentationId = req.params.id;
    const now = new Date().toISOString();
    
    // Get max order if not provided
    let slideOrder = order;
    if (slideOrder === undefined) {
      const result = db.prepare('SELECT MAX("order") as maxOrder FROM slides WHERE presentation_id = ?').get(presentationId);
      slideOrder = (result.maxOrder || 0) + 1;
    }
    
    const slideId = generateId();
    db.prepare(`
      INSERT INTO slides 
      (id, presentation_id, type, title, content_json, layout_json, "order", created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      slideId,
      presentationId,
      type,
      title || '',
      JSON.stringify(content || {}),
      layout ? JSON.stringify(layout) : null,
      slideOrder,
      now,
      now
    );
    
    // Update presentation timestamp
    db.prepare('UPDATE presentations SET updated_at = ?, last_modified_by = ? WHERE id = ?')
      .run(now, req.userId, presentationId);
    
    const slide = db.prepare('SELECT * FROM slides WHERE id = ?').get(slideId);
    
    res.status(201).json({
      ...slide,
      content: JSON.parse(slide.content_json),
      layout: slide.layout_json ? JSON.parse(slide.layout_json) : {}
    });
  } catch (error) {
    console.error('Add slide error:', error);
    res.status(500).json({ error: 'Erreur lors de l\'ajout de la slide' });
  }
});

/**
 * PUT /api/presentations/:presentationId/slides/:slideId
 * Update slide
 */
router.put('/:presentationId/slides/:slideId', (req, res) => {
  try {
    const { title, content, layout, order, isHidden } = req.body;
    
    const db = getDb();
    const now = new Date().toISOString();
    
    const updates = [];
    const params = [];
    
    if (title !== undefined) {
      updates.push('title = ?');
      params.push(title);
    }
    if (content !== undefined) {
      updates.push('content_json = ?');
      params.push(JSON.stringify(content));
    }
    if (layout !== undefined) {
      updates.push('layout_json = ?');
      params.push(JSON.stringify(layout));
    }
    if (order !== undefined) {
      updates.push('"order" = ?');
      params.push(order);
    }
    if (isHidden !== undefined) {
      updates.push('is_hidden = ?');
      params.push(isHidden ? 1 : 0);
    }
    
    updates.push('updated_at = ?');
    params.push(now);
    params.push(req.params.slideId);
    
    const query = `UPDATE slides SET ${updates.join(', ')} WHERE id = ?`;
    db.prepare(query).run(...params);
    
    // Update presentation timestamp
    db.prepare('UPDATE presentations SET updated_at = ?, last_modified_by = ? WHERE id = ?')
      .run(now, req.userId, req.params.presentationId);
    
    const slide = db.prepare('SELECT * FROM slides WHERE id = ?').get(req.params.slideId);
    
    res.json({
      ...slide,
      content: JSON.parse(slide.content_json),
      layout: slide.layout_json ? JSON.parse(slide.layout_json) : {}
    });
  } catch (error) {
    console.error('Update slide error:', error);
    res.status(500).json({ error: 'Erreur lors de la mise à jour de la slide' });
  }
});

/**
 * DELETE /api/presentations/:presentationId/slides/:slideId
 * Delete slide
 */
router.delete('/:presentationId/slides/:slideId', (req, res) => {
  try {
    const db = getDb();
    const now = new Date().toISOString();
    
    db.prepare('DELETE FROM slides WHERE id = ?').run(req.params.slideId);
    
    // Reorder remaining slides
    const slides = db.prepare('SELECT id FROM slides WHERE presentation_id = ? ORDER BY "order"').all(req.params.presentationId);
    const updateStmt = db.prepare('UPDATE slides SET "order" = ? WHERE id = ?');
    
    for (let i = 0; i < slides.length; i++) {
      updateStmt.run(i, slides[i].id);
    }
    
    // Update presentation timestamp
    db.prepare('UPDATE presentations SET updated_at = ?, last_modified_by = ? WHERE id = ?')
      .run(now, req.userId, req.params.presentationId);
    
    res.json({ message: 'Slide supprimée' });
  } catch (error) {
    console.error('Delete slide error:', error);
    res.status(500).json({ error: 'Erreur lors de la suppression de la slide' });
  }
});

/**
 * POST /api/presentations/:id/reorder
 * Reorder slides
 */
router.post('/:id/reorder', (req, res) => {
  try {
    const { slideIds } = req.body;
    
    if (!Array.isArray(slideIds)) {
      return res.status(400).json({ error: 'slideIds doit être un tableau' });
    }
    
    const db = getDb();
    const now = new Date().toISOString();
    
    const updateStmt = db.prepare('UPDATE slides SET "order" = ? WHERE id = ? AND presentation_id = ?');
    
    for (let i = 0; i < slideIds.length; i++) {
      updateStmt.run(i, slideIds[i], req.params.id);
    }
    
    // Update presentation timestamp
    db.prepare('UPDATE presentations SET updated_at = ?, last_modified_by = ? WHERE id = ?')
      .run(now, req.userId, req.params.id);
    
    res.json({ message: 'Slides réordonnées' });
  } catch (error) {
    console.error('Reorder slides error:', error);
    res.status(500).json({ error: 'Erreur lors du réordonnancement' });
  }
});

export default router;
