import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';
import { getDb, saveDb, execQuery, getOne } from '../db/index.js';
import { createError } from '../middleware/errorHandler.js';

const router = Router();

// GET /api/projects - Liste tous les projets
router.get('/', async (_req, res, next) => {
  try {
    const db = await getDb();
    const projects = execQuery(`
      SELECT 
        id, name, pin_hash as pinHash, user_tag as userTag,
        target_company as targetCompany, target_sector as targetSector,
        deal_type as dealType, theme_primary_color as primaryColor,
        theme_accent_color as accentColor, theme_font_family as fontFamily,
        theme_logo_path as logoPath, created_at as createdAt, updated_at as updatedAt
      FROM projects 
      ORDER BY updated_at DESC
    `);

    res.json(projects.map(p => ({
      ...p,
      theme: {
        primaryColor: p.primaryColor,
        accentColor: p.accentColor,
        fontFamily: p.fontFamily,
        logoPath: p.logoPath,
      },
    })));
  } catch (error) {
    next(error);
  }
});

// GET /api/projects/:id - Récupère un projet
router.get('/:id', async (req, res, next) => {
  try {
    const project = getOne(`
      SELECT * FROM projects WHERE id = ?
    `, [req.params.id]);

    if (!project) {
      throw createError('Projet non trouvé', 404);
    }

    res.json({
      ...project,
      theme: {
        primaryColor: project.theme_primary_color,
        accentColor: project.theme_accent_color,
        fontFamily: project.theme_font_family,
        logoPath: project.theme_logo_path,
      },
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/projects - Crée un nouveau projet
router.post('/', async (req, res, next) => {
  try {
    const {
      name,
      pin,
      userTag,
      targetCompany,
      targetSector,
      dealType,
      theme,
      templateId,
    } = req.body;

    const id = uuidv4();
    const now = Date.now();

    const db = await getDb();
    db.run(`
      INSERT INTO projects (
        id, name, pin_hash, user_tag, target_company, target_sector,
        deal_type, theme_primary_color, theme_accent_color, theme_font_family,
        theme_logo_path, template_id, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      id,
      name,
      pin ? await bcrypt.hash(pin, 10) : null,
      userTag || null,
      targetCompany || null,
      targetSector || null,
      dealType || 'custom',
      theme?.primaryColor || '#061a40',
      theme?.accentColor || '#b80c09',
      theme?.fontFamily || 'Bierstadt',
      theme?.logoPath || null,
      templateId || null,
      now,
      now
    ]);
    saveDb();

    if (templateId) {
      const template = getOne('SELECT slides FROM templates WHERE id = ?', [templateId]);
      if (template) {
        const templateSlides = JSON.parse(template.slides as string);
        for (const slide of templateSlides) {
          db.run(`
            INSERT INTO slides (id, project_id, order_index, type, title, content, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
          `, [
            uuidv4(),
            id,
            slide.orderIndex,
            slide.type,
            slide.title || '',
            JSON.stringify(slide.content || {}),
            now,
            now
          ]);
        }
        saveDb();
      }
    }

    res.status(201).json({ id, message: 'Projet créé avec succès' });
  } catch (error) {
    next(error);
  }
});

// PUT /api/projects/:id - Met à jour un projet
router.put('/:id', async (req, res, next) => {
  try {
    const { name, targetCompany, targetSector, dealType, theme } = req.body;
    const now = Date.now();

    const db = await getDb();
    db.run(`
      UPDATE projects SET
        name = COALESCE(?, name),
        target_company = COALESCE(?, target_company),
        target_sector = COALESCE(?, target_sector),
        deal_type = COALESCE(?, deal_type),
        theme_primary_color = COALESCE(?, theme_primary_color),
        theme_accent_color = COALESCE(?, theme_accent_color),
        theme_font_family = COALESCE(?, theme_font_family),
        theme_logo_path = COALESCE(?, theme_logo_path),
        updated_at = ?
      WHERE id = ?
    `, [
      name,
      targetCompany,
      targetSector,
      dealType,
      theme?.primaryColor,
      theme?.accentColor,
      theme?.fontFamily,
      theme?.logoPath,
      now,
      req.params.id
    ]);
    saveDb();

    res.json({ message: 'Projet mis à jour avec succès' });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/projects/:id - Supprime un projet
router.delete('/:id', async (req, res, next) => {
  try {
    const db = await getDb();
    db.run('DELETE FROM projects WHERE id = ?', [req.params.id]);
    saveDb();

    res.json({ message: 'Projet supprimé avec succès' });
  } catch (error) {
    next(error);
  }
});

export default router;
