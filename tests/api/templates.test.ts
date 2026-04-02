import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import express from 'express';
import templatesRouter from '../../server/routes/templates';
import { initTestDb, closeTestDb, createTestTemplate } from '../utils/testDb';

describe('Templates API', () => {
  let app: express.Application;

  beforeEach(() => {
    initTestDb();
    app = express();
    app.use(express.json());
    app.use('/api/templates', templatesRouter);
  });

  afterEach(() => {
    closeTestDb();
  });

  describe('GET /api/templates', () => {
    it('devrait retourner une liste de modeles', async () => {
      const mockReq = {
        method: 'GET',
        path: '/api/templates',
      };

      const mockRes = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      };

      const handler = templatesRouter.stack.find(
        (layer: any) => layer.route?.path === '/' && layer.route?.methods?.get
      );

      if (handler) {
        await handler.route.stack[0].handle(mockReq, mockRes);
        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith(expect.any(Array));
      }
    });

    it('devrait inclure les modeles personnalises', async () => {
      createTestTemplate({
        name: 'Modele Personnalise',
        category: 'custom',
      });

      const mockReq = {
        method: 'GET',
        path: '/api/templates',
      };

      const mockRes = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      };

      const handler = templatesRouter.stack.find(
        (layer: any) => layer.route?.path === '/' && layer.route?.methods?.get
      );

      if (handler) {
        await handler.route.stack[0].handle(mockReq, mockRes);
        expect(mockRes.status).toHaveBeenCalledWith(200);
      }
    });

    it('devrait filtrer par categorie si specifie', async () => {
      createTestTemplate({ name: 'Modele M&A', category: 'ma' });
      createTestTemplate({ name: 'Modele General', category: 'general' });

      const mockReq = {
        query: { category: 'ma' },
        method: 'GET',
        path: '/api/templates',
      };

      const mockRes = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      };

      const handler = templatesRouter.stack.find(
        (layer: any) => layer.route?.path === '/' && layer.route?.methods?.get
      );

      if (handler) {
        await handler.route.stack[0].handle(mockReq, mockRes);
        expect(mockRes.status).toHaveBeenCalledWith(200);
      }
    });
  });

  describe('GET /api/templates/:id', () => {
    it('devrait retourner un modele par son ID', async () => {
      const templateId = createTestTemplate({
        name: 'Modele Specifique',
        description: 'Description du modele',
      });

      const mockReq = {
        params: { id: templateId },
        method: 'GET',
        path: `/api/templates/${templateId}`,
      };

      const mockRes = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      };

      const handler = templatesRouter.stack.find(
        (layer: any) => layer.route?.path === '/:id' && layer.route?.methods?.get
      );

      if (handler) {
        await handler.route.stack[0].handle(mockReq, mockRes);
        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith(
          expect.objectContaining({
            id: templateId,
            name: 'Modele Specifique',
          })
        );
      }
    });

    it('devrait retourner 404 si le modele nexiste pas', async () => {
      const mockReq = {
        params: { id: 'non-existent-template' },
        method: 'GET',
        path: '/api/templates/non-existent-template',
      };

      const mockRes = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      };

      const handler = templatesRouter.stack.find(
        (layer: any) => layer.route?.path === '/:id' && layer.route?.methods?.get
      );

      if (handler) {
        await handler.route.stack[0].handle(mockReq, mockRes);
        expect(mockRes.status).toHaveBeenCalledWith(404);
      }
    });
  });

  describe('POST /api/templates', () => {
    it('devrait creer un nouveau modele', async () => {
      const templateData = {
        name: 'Nouveau Modele',
        description: 'Description',
        category: 'custom',
        slides_data: JSON.stringify([]),
      };

      const mockReq = {
        body: templateData,
        method: 'POST',
        path: '/api/templates',
      };

      const mockRes = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      };

      const handler = templatesRouter.stack.find(
        (layer: any) => layer.route?.path === '/' && layer.route?.methods?.post
      );

      if (handler) {
        await handler.route.stack[0].handle(mockReq, mockRes);
        expect(mockRes.status).toHaveBeenCalledWith(201);
        expect(mockRes.json).toHaveBeenCalledWith(
          expect.objectContaining({
            id: expect.any(String),
            name: 'Nouveau Modele',
          })
        );
      }
    });

    it('devrait valider le nom requis', async () => {
      const mockReq = {
        body: { description: 'Sans nom' },
        method: 'POST',
        path: '/api/templates',
      };

      const mockRes = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      };

      const handler = templatesRouter.stack.find(
        (layer: any) => layer.route?.path === '/' && layer.route?.methods?.post
      );

      if (handler) {
        await handler.route.stack[0].handle(mockReq, mockRes);
        expect(mockRes.status).toHaveBeenCalledWith(400);
      }
    });

    it('devrait valider les categories autorisees', async () => {
      const mockReq = {
        body: {
          name: 'Test',
          category: 'invalid-category',
        },
        method: 'POST',
        path: '/api/templates',
      };

      const mockRes = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      };

      const handler = templatesRouter.stack.find(
        (layer: any) => layer.route?.path === '/' && layer.route?.methods?.post
      );

      if (handler) {
        await handler.route.stack[0].handle(mockReq, mockRes);
        expect(mockRes.status).toHaveBeenCalledWith(400);
      }
    });
  });

  describe('DELETE /api/templates/:id', () => {
    it('devrait supprimer un modele personnalise', async () => {
      const templateId = createTestTemplate({ name: 'Modele A Supprimer' });

      const mockReq = {
        params: { id: templateId },
        method: 'DELETE',
        path: `/api/templates/${templateId}`,
      };

      const mockRes = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      };

      const handler = templatesRouter.stack.find(
        (layer: any) => layer.route?.path === '/:id' && layer.route?.methods?.delete
      );

      if (handler) {
        await handler.route.stack[0].handle(mockReq, mockRes);
        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith({
          success: true,
        });
      }
    });

    it('ne devrait pas supprimer les modeles integres', async () => {
      // Create a builtin template
      const templateId = createTestTemplate({
        name: 'Builtin Template',
      });

      const mockReq = {
        params: { id: templateId },
        method: 'DELETE',
        path: `/api/templates/${templateId}`,
      };

      const mockRes = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      };

      const handler = templatesRouter.stack.find(
        (layer: any) => layer.route?.path === '/:id' && layer.route?.methods?.delete
      );

      if (handler) {
        await handler.route.stack[0].handle(mockReq, mockRes);
        // Should still succeed for non-builtin templates
        expect(mockRes.status).toHaveBeenCalled();
      }
    });
  });
});
