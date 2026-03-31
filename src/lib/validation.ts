import { z } from 'zod';

// ============================================================================
// USER & AUTHENTICATION SCHEMAS
// ============================================================================

export const emailSchema = z.string().email('Email invalide');

export const passwordSchema = z
  .string()
  .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
  .regex(/[A-Z]/, 'Le mot de passe doit contenir au moins une majuscule')
  .regex(/[0-9]/, 'Le mot de passe doit contenir au moins un chiffre');

export const userSignupSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  firstName: z.string().min(1, 'Prénom requis').max(50),
  lastName: z.string().min(1, 'Nom requis').max(50),
});

export const userSigninSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Mot de passe requis'),
});

export type UserSignup = z.infer<typeof userSignupSchema>;
export type UserSignin = z.infer<typeof userSigninSchema>;

// ============================================================================
// PROJECT SCHEMAS
// ============================================================================

export const projectCreateSchema = z.object({
  name: z.string().min(1, 'Nom du projet requis').max(200),
  targetCompany: z.string().optional(),
  targetSector: z.string().optional(),
  dealType: z.enum(['cession', 'acquisition', 'lbo', 'levée_fonds', 'fusion', 'autre']).optional(),
  templateId: z.string().optional(),
});

export const projectUpdateSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  targetCompany: z.string().optional(),
  targetSector: z.string().optional(),
  dealType: z.enum(['cession', 'acquisition', 'lbo', 'levée_fonds', 'fusion', 'autre']).optional(),
  theme: z
    .object({
      primaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Couleur hex invalide'),
      accentColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Couleur hex invalide'),
      fontFamily: z.string().optional(),
    })
    .optional(),
});

export type ProjectCreate = z.infer<typeof projectCreateSchema>;
export type ProjectUpdate = z.infer<typeof projectUpdateSchema>;

// ============================================================================
// SLIDE SCHEMAS
// ============================================================================

export const slideTypeSchema = z.enum([
  'title',
  'content',
  'two-column',
  'image',
  'chart',
  'table',
  'timeline',
  'team',
  'financial',
  'quote',
  'blank',
]);

export const slideCreateSchema = z.object({
  projectId: z.string().min(1, 'ID projet requis'),
  type: slideTypeSchema,
  title: z.string().max(500).optional().default(''),
  content: z.string().optional().default(''),
  order: z.number().int().min(0),
  notes: z.string().optional(),
});

export const slideUpdateSchema = z.object({
  title: z.string().max(500).optional(),
  content: z.string().optional(),
  order: z.number().int().min(0).optional(),
  notes: z.string().optional(),
  isHidden: z.boolean().optional(),
});

export const slideReorderSchema = z.object({
  slideId: z.string().min(1),
  newOrder: z.number().int().min(0),
});

export type SlideCreate = z.infer<typeof slideCreateSchema>;
export type SlideUpdate = z.infer<typeof slideUpdateSchema>;
export type SlideReorder = z.infer<typeof slideReorderSchema>;

// ============================================================================
// COMMENT SCHEMAS
// ============================================================================

export const commentCreateSchema = z.object({
  slideId: z.string().min(1, 'ID slide requis'),
  projectId: z.string().min(1, 'ID projet requis'),
  text: z.string().min(1, 'Texte du commentaire requis').max(2000),
  field: z.enum(['title', 'content', 'notes']).optional(),
});

export const commentUpdateSchema = z.object({
  text: z.string().min(1).max(2000).optional(),
  resolved: z.boolean().optional(),
});

export type CommentCreate = z.infer<typeof commentCreateSchema>;
export type CommentUpdate = z.infer<typeof commentUpdateSchema>;

// ============================================================================
// AI CHAT SCHEMAS
// ============================================================================

export const chatMessageSchema = z.object({
  projectId: z.string().min(1),
  content: z.string().min(1).max(10000),
  role: z.enum(['user', 'assistant']).default('user'),
});

export const aiGenerationRequestSchema = z.object({
  projectId: z.string().min(1),
  slideType: slideTypeSchema,
  context: z
    .object({
      projectName: z.string().optional(),
      targetCompany: z.string().optional(),
      dealType: z.string().optional(),
    })
    .optional(),
});

export const aiEnhancementRequestSchema = z.object({
  content: z.string().min(1).max(50000),
  intent: z.enum(['polish', 'shorten', 'expand']),
});

export type ChatMessage = z.infer<typeof chatMessageSchema>;
export type AIGenerationRequest = z.infer<typeof aiGenerationRequestSchema>;
export type AIEnhancementRequest = z.infer<typeof aiEnhancementRequestSchema>;

// ============================================================================
// EXPORT SCHEMAS
// ============================================================================

export const exportFormatSchema = z.enum(['pptx', 'pdf', 'images']);
export const exportQualitySchema = z.enum(['low', 'medium', 'high']);

export const exportRequestSchema = z.object({
  projectId: z.string().min(1),
  format: exportFormatSchema,
  quality: exportQualitySchema.default('high'),
  includeHiddenSlides: z.boolean().default(false),
  includeNotes: z.boolean().default(false),
  selectedSlides: z.array(z.string()).optional(),
});

export type ExportRequest = z.infer<typeof exportRequestSchema>;

// ============================================================================
// VALIDATION HELPER
// ============================================================================

export function validateSchema<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): {
  success: boolean;
  data?: T;
  errors?: string[];
} {
  const result = schema.safeParse(data);

  if (result.success) {
    return { success: true, data: result.data };
  }

  const errors = result.error.issues.map(
    (issue, _index, _array) =>
      `${issue.path.join('.')}: ${issue.message}`
  );

  return { success: false, errors };
}

// ============================================================================
// API RATE LIMITING
// ============================================================================

interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
}

export const RATE_LIMITS: Record<string, RateLimitConfig> = {
  // Auth endpoints
  '/auth/signup': { windowMs: 60000, maxRequests: 5 }, // 5 per minute
  '/auth/signin': { windowMs: 60000, maxRequests: 10 }, // 10 per minute

  // Project endpoints
  '/projects': { windowMs: 60000, maxRequests: 30 }, // 30 per minute
  '/projects/:id': { windowMs: 60000, maxRequests: 60 }, // 60 per minute

  // AI endpoints (more restrictive due to cost)
  '/ai/generate': { windowMs: 60000, maxRequests: 10 }, // 10 per minute
  '/ai/enhance': { windowMs: 60000, maxRequests: 20 }, // 20 per minute

  // Export endpoints
  '/export': { windowMs: 60000, maxRequests: 10 }, // 10 per minute

  // General API
  default: { windowMs: 60000, maxRequests: 100 }, // 100 per minute
};

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

// In-memory store (use Redis in production)
const rateLimitStore = new Map<string, RateLimitEntry>();

export function checkRateLimit(
  identifier: string,
  endpoint: string
): { allowed: boolean; remaining: number; resetAt: number } {
  const config = RATE_LIMITS[endpoint] || RATE_LIMITS.default;
  const now = Date.now();
  const key = `${identifier}:${endpoint}`;

  let entry = rateLimitStore.get(key);

  // Reset if window has passed
  if (!entry || entry.resetAt < now) {
    entry = {
      count: 0,
      resetAt: now + config.windowMs,
    };
    rateLimitStore.set(key, entry);
  }

  entry.count++;

  const remaining = Math.max(0, config.maxRequests - entry.count);
  const allowed = entry.count <= config.maxRequests;

  return {
    allowed,
    remaining,
    resetAt: entry.resetAt,
  };
}

// Clean up expired entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (entry.resetAt < now) {
      rateLimitStore.delete(key);
    }
  }
}, 60000); // Every minute

export default {
  emailSchema,
  passwordSchema,
  userSignupSchema,
  userSigninSchema,
  projectCreateSchema,
  projectUpdateSchema,
  slideCreateSchema,
  slideUpdateSchema,
  commentCreateSchema,
  aiGenerationRequestSchema,
  exportRequestSchema,
  validateSchema,
  checkRateLimit,
  RATE_LIMITS,
};
