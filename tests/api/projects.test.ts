import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import express from 'express';
import projectsRouter from '../../server/routes/projects';
import { createTestProject } from '../utils/testDb';
import { initTestDb, closeTestDb, getDb } from '../utils/testDb';

describe('Projects API', () => {
  let app: express.Application;

  beforeEach(() => {
    // Initialize test database
    initTestDb();
    app = express();
    app.use(express.json());
    app.use('/api/projects', projectsRouter);
  });

  afterEach(() => {
    closeTestDb();
  });

  describe('GET /api/projects', () => {
    it('devrait retourner une liste vide au debut', async () => {
      const mockReq = {
        method: 'GET',
        path: '/api/projects',
      };

      const mockRes = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      };

      const handler = projectsRouter.stack.find(
        (layer: any) => layer.route?.path === '/' && layer.route?.methods?.get
      );

      if (handler) {
        await handler.route.stack[0].handle(mockReq, mockRes);
        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith(expect.any(Array));
      }
    });

    it('devrait retourner les projets existants', async () => {
      // Create test projects
      createTestProject({ name: 'Projet Test 1' });
      createTestProject({ name: 'Projet Test 2' });

      const mockReq = {
        method: 'GET',
        path: '/api/projects',
      };

      const mockRes = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      };

      const handler = projectsRouter.stack.find(
        (layer: any) => layer.route?.path === '/' && layer.route?.methods?.get
      );

      if (handler) {
        await handler.route.stack[0].handle(mockReq, mockRes);
        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalled();
      }
    });
  });

  describe('POST /api/projects', () => {
    it('devrait creer un nouveau projet', async () => {
      const projectData = {
        name: 'Nouveau Projet',
        description: 'Description du projet',
      };

      const mockReq = {
        body: projectData,
        method: 'POST',
        path: '/api/projects',
      };

      const mockRes = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      };

      const handler = projectsRouter.stack.find(
        (layer: any) => layer.route?.path === '/' && layer.route?.methods?.post
      );

      if (handler) {
        await handler.route.stack[0].handle(mockReq, mockRes);
        expect(mockRes.status).toHaveBeenCalledWith(201);
        expect(mockRes.json).toHaveBeenCalledWith(
          expect.objectContaining({
            id: expect.any(String),
            name: 'Nouveau Projet',
            description: 'Description du projet',
          })
        );
      }
    });

    it('devrait retourner 400 si le nom est manquant', async () => {
      const mockReq = {
        body: { description: 'Sans nom' },
        method: 'POST',
        path: '/api/projects',
      };

      const mockRes = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      };

      const handler = projectsRouter.stack.find(
        (layer: any) => layer.route?.path === '/' && layer.route?.methods?.post
      );

      if (handler) {
        await handler.route.stack[0].handle(mockReq, mockRes);
        expect(mockRes.status).toHaveBeenCalledWith(400);
      }
    });
  });

  describe('GET /api/projects/:id', () => {
    it('devrait retourner un projet par son ID', async () => {
      const projectId = createTestProject({ name: 'Projet Specifique' });

      const mockReq = {
        params: { id: projectId },
        method: 'GET',
        path: `/api/projects/${projectId}`,
      };

      const mockRes = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      };

      const handler = projectsRouter.stack.find(
        (layer: any) => layer.route?.path === '/:id' && layer.route?.methods?.get
      );

      if (handler) {
        await handler.route.stack[0].handle(mockReq, mockRes);
        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith(
          expect.objectContaining({
            id: projectId,
            name: 'Projet Specifique',
          })
        );
      }
    });

    it('devrait retourner 404 si le projet nexiste pas', async () => {
      const mockReq = {
        params: { id: 'non-existent-id' },
        method: 'GET',
        path: '/api/projects/non-existent-id',
      };

      const mockRes = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      };

      const handler = projectsRouter.stack.find(
        (layer: any) => layer.route?.path === '/:id' && layer.route?.methods?.get
      );

      if (handler) {
        await handler.route.stack[0].handle(mockReq, mockRes);
        expect(mockRes.status).toHaveBeenCalledWith(404);
      }
    });
  });

  describe('PUT /api/projects/:id', () => {
    it('devrait mettre a jour un projet existant', async () => {
      const projectId = createTestProject({ name: 'Ancien Nom' });

      const mockReq = {
        params: { id: projectId },
        body: { name: 'Nouveau Nom' },
        method: 'PUT',
        path: `/api/projects/${projectId}`,
      };

      const mockRes = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      };

      const handler = projectsRouter.stack.find(
        (layer: any) => layer.route?.path === '/:id' && layer.route?.methods?.put
      );

      if (handler) {
        await handler.route.stack[0].handle(mockReq, mockRes);
        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith(
          expect.objectContaining({
            name: 'Nouveau Nom',
          })
        );
      }
    });
  });

  describe('DELETE /api/projects/:id', () => {
    it('devrait supprimer un projet existant', async () => {
      const projectId = createTestProject({ name: 'Projet A Supprimer' });

      const mockReq = {
        params: { id: projectId },
        method: 'DELETE',
        path: `/api/projects/${projectId}`,
      };

      const mockRes = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      };

      const handler = projectsRouter.stack.find(
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

    it('devrait retourner 404 si le projet nexiste pas', async () => {
      const mockReq = {
        params: { id: 'non-existent-id' },
        method: 'DELETE',
        path: '/api/projects/non-existent-id',
      };

      const mockRes = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      };

      const handler = projectsRouter.stack.find(
        (layer: any) => layer.route?.path === '/:id' && layer.route?.methods?.delete
      );

      if (handler) {
        await handler.route.stack[0].handle(mockReq, mockRes);
        expect(mockRes.status).toHaveBeenCalledWith(404);
      }
    });
  });

  describe('Validation', () => {
    it('devrait valider le format du PIN', async () => {
      const mockReq = {
        body: {
          name: 'Test',
          pin_code: 'too-long-pin-code-that-exceeds-limit',
        },
        method: 'POST',
        path: '/api/projects',
      };

      const mockRes = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      };

      const handler = projectsRouter.stack.find(
        (layer: any) => layer.route?.path === '/' && layer.route?.methods?.post
      );

      if (handler) {
        await handler.route.stack[0].handle(mockReq, mockRes);
        expect(mockRes.status).toHaveBeenCalledWith(400);
      }
    });
  });
});
