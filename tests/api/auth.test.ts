import { describe, it, expect, beforeEach, vi } from 'vitest';
import express from 'express';
import authRouter from '../../server/routes/auth';

// Mock the database
vi.mock('../../server/db', () => ({
  getDb: vi.fn(() => ({
    prepare: vi.fn(() => ({
      get: vi.fn(),
      run: vi.fn(),
      all: vi.fn(() => []),
    })),
  })),
}));

describe('Auth API', () => {
  let app: express.Application;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use('/api/auth', authRouter);
  });

  describe('POST /api/auth/verify', () => {
    it('devrait retourner 400 si aucun PIN fourni', async () => {
      const mockReq = {
        body: {},
      };

      const mockRes = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      };

      // Simulate route handler directly
      const handler = authRouter.stack.find(
        (layer: any) => layer.route?.path === '/verify' && layer.route?.methods?.post
      );

      if (handler) {
        await handler.route.stack[0].handle(mockReq, mockRes);
        expect(mockRes.status).toHaveBeenCalledWith(400);
        expect(mockRes.json).toHaveBeenCalledWith({
          error: 'Code PIN requis',
        });
      }
    });

    it('devrait retourner 200 avec hasAccess pour PIN valide', async () => {
      const galleryPin = process.env.APP_PIN_CODE || '1234';

      const mockReq = {
        body: { pin: galleryPin },
      };

      const mockRes = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      };

      const handler = authRouter.stack.find(
        (layer: any) => layer.route?.path === '/verify' && layer.route?.methods?.post
      );

      if (handler) {
        await handler.route.stack[0].handle(mockReq, mockRes);
        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith({
          hasAccess: true,
          hasMasterAccess: false,
        });
      }
    });

    it('devrait retourner 200 avec hasMasterAccess pour mot de passe maitre', async () => {
      const masterPassword = process.env.APP_MASTER_PASSWORD || 'master-secret';

      const mockReq = {
        body: { pin: masterPassword },
      };

      const mockRes = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      };

      const handler = authRouter.stack.find(
        (layer: any) => layer.route?.path === '/verify' && layer.route?.methods?.post
      );

      if (handler) {
        await handler.route.stack[0].handle(mockReq, mockRes);
        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith({
          hasAccess: true,
          hasMasterAccess: true,
        });
      }
    });

    it('devrait retourner 401 pour PIN invalide', async () => {
      const mockReq = {
        body: { pin: 'wrong-pin' },
      };

      const mockRes = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      };

      const handler = authRouter.stack.find(
        (layer: any) => layer.route?.path === '/verify' && layer.route?.methods?.post
      );

      if (handler) {
        await handler.route.stack[0].handle(mockReq, mockRes);
        expect(mockRes.status).toHaveBeenCalledWith(401);
        expect(mockRes.json).toHaveBeenCalledWith({
          error: 'Code PIN invalide',
        });
      }
    });
  });

  describe('POST /api/auth/verify-project', () => {
    it('devrait verifier le PIN dun projet specifique', async () => {
      const mockReq = {
        body: {
          projectId: 'test-project-id',
          pin: '1234',
        },
      };

      const mockRes = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      };

      const handler = authRouter.stack.find(
        (layer: any) => layer.route?.path === '/verify-project' && layer.route?.methods?.post
      );

      if (handler) {
        await handler.route.stack[0].handle(mockReq, mockRes);
        // Should return success if PIN matches
        expect(mockRes.status).toHaveBeenCalled();
      }
    });
  });

  describe('Gestion des erreurs', () => {
    it('devrait gerer les erreurs de validation', async () => {
      const mockReq = {
        body: { pin: '' }, // PIN vide
      };

      const mockRes = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      };

      const handler = authRouter.stack.find(
        (layer: any) => layer.route?.path === '/verify' && layer.route?.methods?.post
      );

      if (handler) {
        await handler.route.stack[0].handle(mockReq, mockRes);
        expect(mockRes.status).toHaveBeenCalledWith(400);
      }
    });
  });
});
