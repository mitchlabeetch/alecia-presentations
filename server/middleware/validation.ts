/**
 * Alecia Presentations - Validation Middleware
 * Validation des requêtes API en français
 */

import type { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { createError } from './errorHandler.js';

// ============================================================================
// Schemas Zod
// ============================================================================

// Projet
export const createProjectSchema = z.object({
  name: z.string().min(1, 'Le nom du projet est requis').max(255, 'Le nom ne peut pas dépasser 255 caractères'),
  pin: z.string().optional(),
  userTag: z.string().optional(),
  targetCompany: z.string().optional(),
  targetSector: z.string().optional(),
  dealType: z.enum(['cession_vente', 'lbo_levee_fonds', 'acquisition_achat', 'custom']).optional(),
  potentialBuyers: z.array(z.string()).optional(),
  keyIndividuals: z.array(z.string()).optional(),
  themePrimaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Couleur hexadécimale invalide').optional(),
  themeAccentColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Couleur hexadécimale invalide').optional(),
  templateId: z.string().uuid('ID de template invalide').optional(),
});

export const updateProjectSchema = z.object({
  name: z.string().min(1, 'Le nom du projet est requis').max(255, 'Le nom ne peut pas dépasser 255 caractères').optional(),
  pin: z.string().optional().nullable(),
  userTag: z.string().optional().nullable(),
  targetCompany: z.string().optional().nullable(),
  targetSector: z.string().optional().nullable(),
  dealType: z.enum(['cession_vente', 'lbo_levee_fonds', 'acquisition_achat', 'custom']).optional(),
  potentialBuyers: z.array(z.string()).optional(),
  keyIndividuals: z.array(z.string()).optional(),
  themePrimaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Couleur hexadécimale invalide').optional(),
  themeAccentColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Couleur hexadécimale invalide').optional(),
});

// Slide
export const createSlideSchema = z.object({
  projectId: z.string().uuid('ID de projet invalide'),
  orderIndex: z.number().int().min(0, 'L\'index doit être positif'),
  type: z.string().min(1, 'Le type de slide est requis'),
  title: z.string().max(500, 'Le titre ne peut pas dépasser 500 caractères').optional(),
  content: z.record(z.unknown()).optional(),
  notes: z.string().max(5000, 'Les notes ne peuvent pas dépasser 5000 caractères').optional(),
  imagePath: z.string().url('URL d\'image invalide').optional().nullable(),
});

export const updateSlideSchema = z.object({
  orderIndex: z.number().int().min(0, 'L\'index doit être positif').optional(),
  type: z.string().min(1, 'Le type de slide est requis').optional(),
  title: z.string().max(500, 'Le titre ne peut pas dépasser 500 caractères').optional().nullable(),
  content: z.record(z.unknown()).optional().nullable(),
  notes: z.string().max(5000, 'Les notes ne peuvent pas dépasser 5000 caractères').optional().nullable(),
  imagePath: z.string().url('URL d\'image invalide').optional().nullable(),
});

// Commentaire
export const createCommentSchema = z.object({
  slideId: z.string().uuid('ID de slide invalide'),
  projectId: z.string().uuid('ID de projet invalide'),
  authorTag: z.string().max(100, 'Le tag ne peut pas dépasser 100 caractères').optional(),
  field: z.string().max(100, 'Le champ ne peut pas dépasser 100 caractères').optional(),
  text: z.string().min(1, 'Le texte du commentaire est requis').max(2000, 'Le commentaire ne peut pas dépasser 2000 caractères'),
  parentCommentId: z.string().uuid('ID de commentaire parent invalide').optional().nullable(),
});

export const updateCommentSchema = z.object({
  text: z.string().min(1, 'Le texte du commentaire est requis').max(2000, 'Le commentaire ne peut pas dépasser 2000 caractères').optional(),
  resolved: z.boolean().optional(),
});

// Chat
export const chatMessageSchema = z.object({
  content: z.string().min(1, 'Le message ne peut pas être vide').max(10000, 'Le message ne peut pas dépasser 10000 caractères'),
  provider: z.string().optional(),
  model: z.string().optional(),
});

export const chatStreamSchema = z.object({
  content: z.string().min(1, 'Le message ne peut pas être vide').max(10000, 'Le message ne peut pas dépasser 10000 caractères'),
  provider: z.string().optional(),
  model: z.string().optional(),
  conversationId: z.string().uuid('ID de conversation invalide').optional(),
});

// Variables
export const createVariablePresetSchema = z.object({
  projectId: z.string().uuid('ID de projet invalide').optional().nullable(),
  name: z.string().min(1, 'Le nom du preset est requis').max(255, 'Le nom ne peut pas dépasser 255 caractères'),
  variables: z.array(z.object({
    key: z.string().min(1, 'La clé est requise').max(100, 'La clé ne peut pas dépasser 100 caractères'),
    value: z.string().max(1000, 'La valeur ne peut pas dépasser 1000 caractères'),
  })).min(1, 'Au moins une variable est requise'),
  isDefault: z.boolean().optional(),
});

export const updateVariablePresetSchema = z.object({
  name: z.string().min(1, 'Le nom du preset est requis').max(255, 'Le nom ne peut pas dépasser 255 caractères').optional(),
  variables: z.array(z.object({
    key: z.string().min(1, 'La clé est requise').max(100, 'La clé ne peut pas dépasser 100 caractères'),
    value: z.string().max(1000, 'La valeur ne peut pas dépasser 1000 caractères'),
  })).min(1, 'Au moins une variable est requise').optional(),
  isDefault: z.boolean().optional(),
});

// Export
export const exportOptionsSchema = z.object({
  variablePresetId: z.string().uuid('ID de preset invalide').optional().nullable(),
  slideRange: z.object({
    start: z.number().int().min(0, 'L\'index de début doit être positif'),
    end: z.number().int().min(0, 'L\'index de fin doit être positif'),
  }).refine(data => data.end >= data.start, {
    message: 'L\'index de fin doit être supérieur ou égal à l\'index de début',
  }).optional(),
  includeWatermark: z.boolean().optional().default(true),
  aleciaBranding: z.boolean().optional().default(true),
});

// Import
export const importConvertSchema = z.object({
  fileId: z.string().uuid('ID de fichier invalide'),
  projectId: z.string().uuid('ID de projet invalide').optional().nullable(),
  slideRange: z.object({
    start: z.number().int().min(0, 'L\'index de début doit être positif'),
    end: z.number().int().min(0, 'L\'index de fin doit être positif'),
  }).optional(),
});

// ============================================================================
// Middleware Factory
// ============================================================================

export function validateBody<T>(schema: z.ZodSchema<T>) {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const result = schema.safeParse(req.body);
      
      if (!result.success) {
        const errors = result.error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message,
        }));
        
        res.status(400).json({
          error: 'Erreur de validation',
          details: errors,
        });
        return;
      }
      
      req.body = result.data;
      next();
    } catch (error) {
      next(error);
    }
  };
}

export function validateParams<T>(schema: z.ZodSchema<T>) {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const result = schema.safeParse(req.params);
      
      if (!result.success) {
        const errors = result.error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message,
        }));
        
        res.status(400).json({
          error: 'Erreur de validation des paramètres',
          details: errors,
        });
        return;
      }
      
      next();
    } catch (error) {
      next(error);
    }
  };
}

export function validateQuery<T>(schema: z.ZodSchema<T>) {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const result = schema.safeParse(req.query);
      
      if (!result.success) {
        const errors = result.error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message,
        }));
        
        res.status(400).json({
          error: 'Erreur de validation des paramètres de requête',
          details: errors,
        });
        return;
      }
      
      next();
    } catch (error) {
      next(error);
    }
  };
}

// ============================================================================
// Validation Helpers
// ============================================================================

export function sanitizeString(str: string): string {
  // Supprime les caractères dangereux
  return str
    .replace(/[<>]/g, '') // Supprime < et >
    .trim();
}

export function validateUUID(id: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
}

export function validateProjectOwnership(projectId: string, userId: string | null): boolean {
  // Pour l'instant, autoriser l'accès si l'utilisateur est authentifié
  // Plus tard, ajouter la vérification de propriété
  return true;
}

// ============================================================================
// Pre-built Validation Middlewares
// ============================================================================

export const validateCreateProject = validateBody(createProjectSchema);
export const validateUpdateProject = validateBody(updateProjectSchema);
export const validateCreateSlide = validateBody(createSlideSchema);
export const validateUpdateSlide = validateBody(updateSlideSchema);
export const validateCreateComment = validateBody(createCommentSchema);
export const validateUpdateComment = validateBody(updateCommentSchema);
export const validateChatMessage = validateBody(chatMessageSchema);
export const validateChatStream = validateBody(chatStreamSchema);
export const validateCreateVariablePreset = validateBody(createVariablePresetSchema);
export const validateUpdateVariablePreset = validateBody(updateVariablePresetSchema);
export const validateExportOptions = validateQuery(exportOptionsSchema);
export const validateImportConvert = validateBody(importConvertSchema);

// UUID param validation
export function validateUUIDParam(paramName: string) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const id = req.params[paramName];
    
    if (!id || !validateUUID(id)) {
      res.status(400).json({
        error: `Paramètre ${paramName} invalide`,
        message: 'L\'identifiant doit être un UUID valide',
      });
      return;
    }
    
    next();
  };
}
