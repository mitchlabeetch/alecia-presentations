import type { Request, Response, NextFunction } from 'express';
import { getDb } from '../db/index.js';
import { createError } from './errorHandler.js';

export function verifyGalleryPin(req: Request, res: Response, next: NextFunction): void {
  const pin = req.headers['x-pin-code'] as string;
  const galleryPin = process.env.APP_PIN_CODE;

  if (!galleryPin) {
    res.status(500).json({ error: 'Configuration PIN manquante' });
    return;
  }

  if (!pin) {
    res.status(401).json({ error: 'Code PIN requis' });
    return;
  }

  if (pin !== galleryPin) {
    res.status(401).json({ error: 'Code PIN invalide' });
    return;
  }

  next();
}

export function verifyProjectPin(req: Request, _res: Response, next: NextFunction): void {
  const pin = req.headers['x-project-pin'] as string;
  const projectId = req.params.projectId || req.body.projectId;

  if (!projectId) {
    next();
    return;
  }

  if (!pin) {
    next();
    return;
  }

  const db = getDb();
  const project = db.prepare('SELECT pin_hash FROM projects WHERE id = ?').get(projectId) as { pin_hash: string | null } | undefined;

  if (!project) {
    next();
    return;
  }

  if (project.pin_hash && pin !== project.pin_hash) {
    next(new Error('Code PIN du projet invalide'));
    return;
  }

  next();
}

export function verifyMasterPassword(req: Request, res: Response, next: NextFunction): void {
  const masterPassword = req.headers['x-master-password'] as string;
  const appMasterPassword = process.env.APP_MASTER_PASSWORD;

  if (!appMasterPassword) {
    res.status(500).json({ error: 'Configuration mot de passe maître manquante' });
    return;
  }

  if (!masterPassword) {
    res.status(403).json({ error: 'Mot de passe maître requis pour accéder aux fonctionnalités IA' });
    return;
  }

  if (masterPassword !== appMasterPassword) {
    res.status(403).json({ error: 'Mot de passe maître invalide' });
    return;
  }

  next();
}
