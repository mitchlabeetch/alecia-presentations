import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import express from 'express';
import slidesRouter from '../../server/routes/slides';
import { initTestDb, closeTestDb, createTestProject, createTestSlide } from '../utils/testDb';

describe('Slides API', () => {
  let app: express.Application;
  let testProjectId: string;

  beforeEach(() => {
    initTestDb();
    testProjectId = createTestProject({ name: 'Projet pour Slides' });
    app = express();
    app.use(express.json());
    app.use('/api/slides', slidesRouter);
  });

  afterEach(() => {
    closeTestDb();
  });

  describe('GET /api/slides', () => {
    it('devrait retourner les diapositives dun projet', async () => {
      // Create test slides
      createTestSlide(testProjectId, { position: 0, title: 'Slide 1' });
      createTestSlide(testProjectId, { position: 1, title: 'Slide 2' });

      const mockReq = {
        query: { projectId: testProjectId },
        method: 'GET',
        path: '/api/slides',
      };

      const mockRes = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      };

      const handler = slidesRouter.stack.find(
        (layer: any) => layer.route?.path === '/' && layer.route?.methods?.get
      );

      if (handler) {
        await handler.route.stack[0].handle(mockReq, mockRes);
        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalled();
      }
    });

    it('devrait retourner 400 si projectId est manquant', async () => {
      const mockReq = {
        query: {},
        method: 'GET',
        path: '/api/slides',
      };

      const mockRes = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      };

      const handler = slidesRouter.stack.find(
        (layer: any) => layer.route?.path === '/' && layer.route?.methods?.get
      );

      if (handler) {
        await handler.route.stack[0].handle(mockReq, mockRes);
        expect(mockRes.status).toHaveBeenCalledWith(400);
      }
    });
  });

  describe('POST /api/slides', () => {
    it('devrait creer une nouvelle diapositive', async () => {
      const slideData = {
        project_id: testProjectId,
        position: 0,
        title: 'Nouvelle Diapositive',
        layout: 'blank',
        background_color: '#ffffff',
      };

      const mockReq = {
        body: slideData,
        method: 'POST',
        path: '/api/slides',
      };

      const mockRes = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      };

      const handler = slidesRouter.stack.find(
        (layer: any) => layer.route?.path === '/' && layer.route?.methods?.post
      );

      if (handler) {
        await handler.route.stack[0].handle(mockReq, mockRes);
        expect(mockRes.status).toHaveBeenCalledWith(201);
        expect(mockRes.json).toHaveBeenCalledWith(
          expect.objectContaining({
            id: expect.any(String),
            project_id: testProjectId,
            title: 'Nouvelle Diapositive',
          })
        );
      }
    });

    it('devrait utiliser le projet non-specifie si non fourni', async () => {
      const mockReq = {
        body: { position: 0 },
        method: 'POST',
        path: '/api/slides',
      };

      const mockRes = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      };

      const handler = slidesRouter.stack.find(
        (layer: any) => layer.route?.path === '/' && layer.route?.methods?.post
      );

      if (handler) {
        await handler.route.stack[0].handle(mockReq, mockRes);
        // Should still work with default project
        expect(mockRes.status).toHaveBeenCalled();
      }
    });
  });

  describe('GET /api/slides/:id', () => {
    it('devrait retourner une diapositive par son ID', async () => {
      const slideId = createTestSlide(testProjectId, { title: 'Slide Specifique' });

      const mockReq = {
        params: { id: slideId },
        method: 'GET',
        path: `/api/slides/${slideId}`,
      };

      const mockRes = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      };

      const handler = slidesRouter.stack.find(
        (layer: any) => layer.route?.path === '/:id' && layer.route?.methods?.get
      );

      if (handler) {
        await handler.route.stack[0].handle(mockReq, mockRes);
        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith(
          expect.objectContaining({
            id: slideId,
            title: 'Slide Specifique',
          })
        );
      }
    });

    it('devrait retourner 404 si la diapositive nexiste pas', async () => {
      const mockReq = {
        params: { id: 'non-existent-slide' },
        method: 'GET',
        path: '/api/slides/non-existent-slide',
      };

      const mockRes = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      };

      const handler = slidesRouter.stack.find(
        (layer: any) => layer.route?.path === '/:id' && layer.route?.methods?.get
      );

      if (handler) {
        await handler.route.stack[0].handle(mockReq, mockRes);
        expect(mockRes.status).toHaveBeenCalledWith(404);
      }
    });
  });

  describe('PATCH /api/slides/:id', () => {
    it('devrait mettre a jour une diapositive existante', async () => {
      const slideId = createTestSlide(testProjectId, { title: 'Ancien Titre' });

      const mockReq = {
        params: { id: slideId },
        body: {
          title: 'Nouveau Titre',
          layout: 'two-column',
        },
        method: 'PATCH',
        path: `/api/slides/${slideId}`,
      };

      const mockRes = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      };

      const handler = slidesRouter.stack.find(
        (layer: any) => layer.route?.path === '/:id' && layer.route?.methods?.patch
      );

      if (handler) {
        await handler.route.stack[0].handle(mockReq, mockRes);
        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith(
          expect.objectContaining({
            title: 'Nouveau Titre',
            layout: 'two-column',
          })
        );
      }
    });

    it('devrait mettre a jour la couleur de fond', async () => {
      const slideId = createTestSlide(testProjectId);

      const mockReq = {
        params: { id: slideId },
        body: { background_color: '#061a40' },
        method: 'PATCH',
        path: `/api/slides/${slideId}`,
      };

      const mockRes = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      };

      const handler = slidesRouter.stack.find(
        (layer: any) => layer.route?.path === '/:id' && layer.route?.methods?.patch
      );

      if (handler) {
        await handler.route.stack[0].handle(mockReq, mockRes);
        expect(mockRes.status).toHaveBeenCalledWith(200);
      }
    });
  });

  describe('DELETE /api/slides/:id', () => {
    it('devrait supprimer une diapositive existante', async () => {
      const slideId = createTestSlide(testProjectId, { title: 'Slide A Supprimer' });

      const mockReq = {
        params: { id: slideId },
        method: 'DELETE',
        path: `/api/slides/${slideId}`,
      };

      const mockRes = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      };

      const handler = slidesRouter.stack.find(
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
  });

  describe('POST /api/slides/reorder', () => {
    it('devrait reordonner les diapositives', async () => {
      const slide1 = createTestSlide(testProjectId, { position: 0 });
      const slide2 = createTestSlide(testProjectId, { position: 1 });
      const slide3 = createTestSlide(testProjectId, { position: 2 });

      const mockReq = {
        body: {
          projectId: testProjectId,
          slideIds: [slide3, slide1, slide2],
        },
        method: 'POST',
        path: '/api/slides/reorder',
      };

      const mockRes = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      };

      const handler = slidesRouter.stack.find(
        (layer: any) => layer.route?.path === '/reorder' && layer.route?.methods?.post
      );

      if (handler) {
        await handler.route.stack[0].handle(mockReq, mockRes);
        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith({
          success: true,
        });
      }
    });

    it('devrait retourner 400 si les donnees sont incompletes', async () => {
      const mockReq = {
        body: { projectId: testProjectId },
        method: 'POST',
        path: '/api/slides/reorder',
      };

      const mockRes = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      };

      const handler = slidesRouter.stack.find(
        (layer: any) => layer.route?.path === '/reorder' && layer.route?.methods?.post
      );

      if (handler) {
        await handler.route.stack[0].handle(mockReq, mockRes);
        expect(mockRes.status).toHaveBeenCalledWith(400);
      }
    });
  });

  describe('GET /api/slides/:id/blocks', () => {
    it('devrait retourner les blocs dune diapositive', async () => {
      const slideId = createTestSlide(testProjectId);

      const mockReq = {
        params: { id: slideId },
        method: 'GET',
        path: `/api/slides/${slideId}/blocks`,
      };

      const mockRes = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      };

      const handler = slidesRouter.stack.find(
        (layer: any) => layer.route?.path === '/:id/blocks' && layer.route?.methods?.get
      );

      if (handler) {
        await handler.route.stack[0].handle(mockReq, mockRes);
        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith(expect.any(Array));
      }
    });
  });
});
