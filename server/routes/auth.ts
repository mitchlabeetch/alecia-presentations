import { Router } from 'express';
import { getDb, saveDb, getOne } from '../db/index.js';
import { createError } from '../middleware/errorHandler.js';

const router = Router();

router.post('/verify', (req, res, next) => {
  try {
    const { pin } = req.body;

    if (!pin) {
      throw createError('Code PIN requis', 400);
    }

    const galleryPin = process.env.APP_PIN_CODE;
    const masterPassword = process.env.APP_MASTER_PASSWORD;

    if (!galleryPin) {
      throw createError('Configuration PIN manquante', 500);
    }

    const isValidPin = pin === galleryPin;
    const isMasterPassword = masterPassword && pin === masterPassword;

    if (!isValidPin && !isMasterPassword) {
      throw createError('Code PIN invalide', 401);
    }

    res.json({
      success: true,
      hasMasterAccess: !!isMasterPassword,
    });
  } catch (error) {
    next(error);
  }
});

router.post('/verify-project', async (req, res, next) => {
  try {
    const { projectId, pin } = req.body;

    if (!projectId || !pin) {
      throw createError('Projet et PIN requis', 400);
    }

    const project = getOne<{ id: string; pin_hash: string | null }>(
      'SELECT id, pin_hash FROM projects WHERE id = ?',
      [projectId]
    );

    if (!project) {
      throw createError('Projet non trouvé', 404);
    }

    if (project.pin_hash && pin !== project.pin_hash) {
      throw createError('Code PIN du projet invalide', 401);
    }

    res.json({ success: true });
  } catch (error) {
    next(error);
  }
});

router.put('/projects/:id/pin', async (req, res, next) => {
  try {
    const { pin } = req.body;
    const { id } = req.params;

    if (!pin) {
      throw createError('Nouveau PIN requis', 400);
    }

    const db = await getDb();
    db.run('UPDATE projects SET pin_hash = ? WHERE id = ?', [pin, id]);
    saveDb();

    res.json({ message: 'PIN du projet mis à jour avec succès' });
  } catch (error) {
    next(error);
  }
});

export default router;
